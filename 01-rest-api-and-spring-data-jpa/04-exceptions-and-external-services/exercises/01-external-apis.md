# External APIs using RestTemplate

## Goal

Consume GitHub's API to retrieve user information and return a subset of the user data. Cache the retrieved user data in a local database.

> We’ll follow **Hexagonal Architecture (Ports & Adapters)** so our core logic stays framework‑free. Spring bits (web, HTTP client, JPA) live in adapters.

---

## Introduction

**GitHub REST API docs:** [https://docs.github.com/en/rest](https://docs.github.com/en/rest)

Endpoints we’ll use:

* **Get a single user**: `GET /users/{username}`
* **Get users (public list)**: `GET /users`

Base URL: `https://api.github.com`

> ⚠️ **Rate limits**: Unauthenticated requests are heavily rate‑limited. Always send a `User-Agent` header and (ideally) authenticate with a token to raise your limits.

---

## Step 1: Project setup

**Dependencies** (Maven):

* `spring-boot-starter-web` (controllers + RestTemplate builder)
* `spring-boot-starter-data-jpa` (persistence)
* `com.h2database:h2` (in-memory DB for dev)
* (optional) `validation` if you want request DTO validation

**Package structure (Hexagonal)**

```
ek.osnb.ghusers
├─ Application.java
├─ config/
├─ core/
│  ├─ domain/
│  │  ├─ model/
│  │  └─ port/
│  │     ├─ in/
│  │     └─ out/
│  └─ app/
├─ adapters/
│  ├─ in/
│  │  └─ web/
│  └─ out/
│     ├─ github/
│     └─ persistence/
└─ shared/
```

**application.properties**

```properties
external.api.base.url=https://api.github.com

spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.username=sa
spring.datasource.password=

spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

**HTTP client config** (`config/HttpConfig.java`)


```java
@Bean
public RestTemplate restTemplate() {
    return new RestTemplate();
}
```
But we would lose the ability to configure timeouts easily.


## Step 2: Domain model (core.domain.model)

In the domain we want to keep it free of framework dependencies. So we will not use any Spring or JPA types here.


In the following package `core/domain/model` add the following model:

```java
public class User {
    private final String login;
    private final String name;
    private final String bio;
    private final int publicRepos;

    public User(String login, String name, String bio, int publicRepos) {
        this.login = login;
        this.name = name;
        this.bio = bio;
        this.publicRepos = publicRepos;
    }

    // Getters & Setters
}
```

## Step 3: Ports (core.domain.port)

First we will create an **Inbound port**, this is what the application offers to the outside world.

Inside the `core/domain/port/in` package create the following interface:

```java
public interface GetUserQuery {
    public record UserView(String login, String bio, int publicRepos) {}
    UserView byUserName(String userName);
    List<UserView> all();
}
```

The **Outbound ports** are what the application needs (or requires) from the outside world.

Inside the `core/domain/port/out` package create the following interface:

```java
public interface GitHubPort {
    User fetch(String login);
    List<User> fetchAll();
}
```

Inside the `core/domain/port/out` package create the following interface:

```java
public interface LoadUserPort {
    Optional<User> findByUserName(String userName);
}
```

Inside the `core/domain/port/out` package create the following interface:

```java
public interface SaveUserPort {
    void save(User user);
}
```

The `SaveUserPort` interface defines a method for saving user data, allowing the application to persist user information **without** being tied to a specific storage mechanism.

## Step 4: Application service (core.app)

Inside the `core.app` package, the inbound ports are implemented, while the outbound ports are used to interact with external systems. We are using composition to assemble the application services. The use cases are implemented as plain Java classes, without any framework dependencies.


Inside the `core/app` package create the following use case implementation:

```java
public class UserLookupService implements GetUserQuery {
    private final GitHubPort gitHubPort;
    private final LoadUserPort loadPort;
    private final SaveUserPort savePort;

    public UserLookupService(GitHubPort gitHubPort, LoadUserPort loadPort, SaveUserPort savePort) {
        this.gitHubPort = gitHubPort;
        this.loadPort = loadPort;
        this.savePort = savePort;
    }

    @Override
    public UserView byUserName(String userName) {
        // 1) Try cache (MySQL or H2)
        Optional<User> cached = loadPort.findByUserName(userName);
        if (cached.isPresent()) {
            var u = cached.get();
            return new UserView(u.getLogin(), u.getBio(), u.getPublicRepos());
        }
        // 2) Call GitHub
        User u = gitHubPort.fetch(userName);
        // 3) Cache the result
        savePort.save(u);
        return new UserView(u.getLogin(), u.getBio(), u.getPublicRepos());
    }

    @Override
    public List<UserView> all() {
        List<User> list = gitHubPort.fetchAll();
        for (User u : list) {
            savePort.save(u);
        }
        List<UserView> result = new ArrayList<>();
        for (User u : list) {
            rresult.add(new UserView(u.getLogin(), u.getBio(), u.getPublicRepos()));
        }
        return result;
    }
}
```

**Take a moment to review the code and understand the flow.**


## Step 5: Adapter OUT — GitHub HTTP client (adapters/out/github)

Inside the `adapters/out/github` package, create a new class called `GitHubHttpAdapter`.

The role of this adapter is to translate our **GitHubPort** interface into actual HTTP calls using `RestTemplate`.


```java
@Component
public class GitHubHttpAdapter implements GitHubPort {
    private final RestTemplate restTemplate;
    private final ObjectMapper mapper;
    private final String baseUrl;

    public GitHubHttpAdapter(RestTemplate restTemplate,
                             ObjectMapper mapper,
                             @Value("${external.api.base.url}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.mapper = mapper;
        this.baseUrl = baseUrl;
    }

    private HttpEntity<Void> requestEntity() {
        // Normally you would add headers here
        return null;
    }

    // --- DTOs matching GitHub JSON ---
    record ApiResponse(
            String login,
            String name,
            String bio,
            @JsonProperty("public_repos")
            int publicRepos
    ) {}

    @Override
    public User fetch(String userName) {
        String url = baseUrl + "/users/" + UriUtils.encode(userName, StandardCharsets.UTF_8);
        try {
            // Create a GET request
            ResponseEntity<ApiResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    requestEntity(), ApiResponse.class);

            // Retrieve the payload from the response
            var b = response.getBody();

            if (b == null) {
                throw new RuntimeException("Failed to fetch user from GitHub");
            }
            return new User(b.login(), b.name(), b.bio(), b.publicRepos());
        } catch (HttpStatusCodeException e) {
            throw new RuntimeException("Failed to fetch user from GitHub");
        } catch (RestClientException e) {
            throw new RuntimeException("Failed to fetch user from GitHub");
        }
    }

    @Override
    public List<User> fetchAll() {
        String url = baseUrl + "/users";
        try {
            // Create a GET request
            ResponseEntity<List<ApiResponse>> resp =
                    restTemplate.exchange(
                            url,
                            HttpMethod.GET,
                            requestEntity(),
                            new ParameterizedTypeReference<List<ApiResponse>>(){}
                    );

            // Retrieve the body/payload from the response
            var list = resp.getBody();
            if (list == null) {
                throw new RuntimeException("Failed to fetch user from GitHub");
            }
            List<User> users = new ArrayList<>();
            for (ApiResponse d : list) {
                users.add(new User(d.login(), d.name(), d.bio(), d.publicRepos()));
            }
            return users;
        } catch (HttpStatusCodeException e) {
            throw new RuntimeException("Failed to fetch user from GitHub");
        } catch (RestClientException e) {
            throw new RuntimeException("Failed to fetch user from GitHub");
        }
    }
}
```
- Notice how we access the base url from `application.properties` file using `@Value` annotation.
- The `GitHubPort` is the **abstraction** that the adapter implements. The adapter is an **implementation detail** that can be swapped (to a different provider).
- The `ParameterizedTypeReference` is a Spring class that helps to capture and pass generic type information at runtime. It is useful when the response is a list of items.

Notice that we could also have used, when the response is a single item:
```java
ResponseEntity<ApiResponse> resp = restTemplate.getForEntity(url, ApiResponse.class);
```

---

## Step 6: Adapter OUT — Persistence (adapters/out/persistence)

We’ll store a minimal cache using Spring Data JPA.

Inside the `adapters/out/persistence` package, create the following JPA classes:

```java
@Entity
@Table(name = "users")
public class UserEntity {
  @Id
  private String login;
  private String name;
  private String bio;
  private int publicRepos;

  // Add getters and setters
}
```

In the same package, create the following repository interface:

```java
public interface UserJpaRepository extends JpaRepository<UserEntity, String> {}
```

Then create an adapter that implements the `LoadUserPort` and `SaveUserPort` interfaces, and uses the `UserJpaRepository` to persist data. 


```java
@Component
public class UserPersistenceAdapter implements LoadUserPort, SaveUserPort {
  private final UserJpaRepository repo;

  public UserPersistenceAdapter(UserJpaRepository repo) {
    this.repo = repo;
  }

  @Override
  public Optional<User> findByUserName(String login) {
    Optional<UserEntity> userEntityOptional = repo.findById(login);
    if (userEntityOptional.isEmpty()) {
      return Optional.empty();
    }
    UserEntity userEntity = userEntityOptional.get();
    return Optional.of(
        new User(userEntity.getLogin(), userEntity.getName(), userEntity.getBio(), userEntity.getPublicRepos())
        );
  }

  @Override
  public void save(User u) {
      var e = new UserEntity();
      e.setLogin(u.getLogin());
      e.setName(u.getName());
      e.setBio(u.getBio());
      e.setPublicRepos(u.getPublicRepos());
      repo.save(e);
  }
}
```

**Take a moment to understand the code.**

---

## Step 7: Adapter IN — Web (adapters/in/web)

The inbound adapter is responsible for exposing the application's use cases to **the outside world**. We will create a REST controller to handle incoming HTTP requests.

Inside the `adapters/in/web` package, create a new class:

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
  
  private final GetUserQuery query;

  public UserController(GetUserQuery query) {
    this.query = query;
  }

  @GetMapping("/{userName}")
  public ResponseEntity<GetUserQuery.UserView> byUserName(@PathVariable String userName) {
    return ResponseEntity.ok(query.byUserName(userName));
  }

  @GetMapping
  public ResponseEntity<List<GetUserQuery.UserView>> all() {
    return ResponseEntity.ok(query.all());
  }
}
```

**Note** that the controller only depends on **inbound ports**. They don’t know about GitHub or database specifics.

You will probably see the warning/error:
`Could not autowire. No beans of 'GetUserQuery' type found`. This will be handled next.

## Step 8: Wiring (config)


Since the everything inside the `core` package is independent of Spring, we are not using any Spring-specific annotations or features in our core logic. This means that the classes in the `core` package are not instantiated by Spring and need to be created manually in the configuration. This is where we define the beans that will be used by the application.

Inside the `config` package, create a new class:

```java
@Configuration
public class AppConfig {
  @Bean
  GetUserQuery getUserQuery(GitHubPort gh, LoadUserPort load, SaveUserPort save) {
    return new UserLookupService(gh, load, save);
  }
}
```

**Note** that the core stays free of Spring—config assembles the pieces at the edges.

## Step 9:

Try to run the application. Only try the `GET /api/users/{userName}` endpoint, as the other will throw errors, beacuse of GitHubs rate limiting.

## Why Hexagonal here?

- Core logic is **portable** and easy to test.
- You can swap **outbound** adapters (GitHub HTTP → mock, or another provider) without touching core.
- You can add **inbound** adapters (REST, CLI, messaging) exposing the same use cases.
