# Spring Boot Data JPA Test

## Set up before starting
- Create a new Spring Boot project with the following dependencies:
  - Spring Web
  - Spring Data JPA
  - H2 Database (for testing)
  - MySQL Driver
- Ensure you have a MySQL database running if you plan to use it for testing.

## Introduction
In this guide, we will explore how to set up DataJpaTest in a Spring Boot application. We will cover the necessary dependencies, how to configure the application properties, and how to write tests for JPA entities using a H2 database.

### Example
Create a simple Spring Boot application with a JPA entity - `User` - and a repository - `UserRepository`.
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;

    // Getters and Setters
}
```

Create a test class for the `UserRepository` called `UserRepositoryTest`:
```java
@DataJpaTest
public class UserRepositoryTest {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DataSource dataSource;

    @Test
    void shouldReturnH2DatabaseName() throws Exception {
        var conn = dataSource.getConnection();
        String dbName = conn.getMetaData()
                .getDatabaseProductName();
        System.out.println("Database: " + dbName);
        assertEquals("H2", dbName, "Database should be H2");
    }


    @Test
    void testSaveUser() {
        // Arrange
        User user = new User();
        user.setName("User 1");
        user.setEmail("u1@example.com");

        // Act
        User savedUser = userRepository.save(user);

        // Assert
        assertNotNull(savedUser.getId());
        assertEquals("User 1", savedUser.getName());
        assertEquals("u1@example.com", savedUser.getEmail());
    }

    private User createUser(String name, String email) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        return user;
    }

    @Test
    void testFindAllUsers() {
        // Arrange
        User user1 = createUser("User 1", "u1@mail.dk");
        User user2 = createUser("User 2", "u2@mail.dk");
        User user3 = createUser("User 3", "u3@mail.dk");
        userRepository.saveAll(List.of(user1, user2, user3));

        // Act
        List<User> users = userRepository.findAll();

        // Assert
        assertEquals(3, users.size(), "Should return 3 users");
    }

        
}
```
So even though we havent created a `application.properties` file, the `@DataJpaTest` annotation will automatically configure an in-memory H2 database for testing purposes. But if we want to customize the db setting, fx if we want to use a MySQL database, we can create a configuration file `application.properties` file in the `src/test/resources` directory with the following content:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/testdb
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=root
```

To use this configuration, we need to annotate our test class with `@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)`, which prevents Spring from replacing the datasource with an in-memory database.

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class UserRepositoryTest {
    // Test methods
}
```
This way the `shouldReturnH2DatabaseName()` test will fail, because we are not using an H2 database anymore.

``` bash
src
├── main
└── test
│   └── java
│   │   └── com
│   │       └── example
│   │           └── demo
│   │               ├── DemoApplicationTests.java
│   │               └── repository
│   │                   └── UserRepositoryTest.java
│   └── resources
│       └── application-test.properties
```

### Configuring profiles
To use different configurations for different environments, we can create multiple `application-{profile}.properties` files. For example, we can create `application-test.properties` for testing and `application-prod.properties` for production. We can then specify the active profile in our test class using the `@ActiveProfiles` annotation:

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
public class UserRepositoryTest {
    // Test methods
}
```

This comes in handy when we would like to use different environments for testing, development, and production.