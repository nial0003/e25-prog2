# Calling External APIs

At some point, you may need to call external APIs from your Spring Boot application. This can be done using the `RestTemplate` class or the more modern `WebClient` from the Spring WebFlux project.

## Using RestTemplate

`RestTemplate` is a synchronous client to perform HTTP requests. Note that it is deprecated in favor of `WebClient` (we will cover later), but for our usecase, it is fairly straightforward to use.

1. Add the `RestTemplate` bean to your configuration:

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate(); 
    }
}
```

2. Inject the `RestTemplate` bean into your service:

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ApiService {

    private final RestTemplate restTemplate;

    @Autowired
    public ApiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String callExternalApi() {
        String url = "https://api.example.com/data";
        return restTemplate.getForObject(url, String.class);
    }
}
```

### Parsing complex JSON Responses
If the external API returns JSON data, you can parse it into a Java object using `RestTemplate`:

```java
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ApiService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public ApiService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public MyResponseObject callExternalApi() {
        String url = "https://api.example.com/data";
        String jsonResponse = restTemplate.getForObject(url, String.class);
        
        try {
            return objectMapper.readValue(jsonResponse, MyResponseObject.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JSON response", e);
        }
    }
}

```

### Parsing lists of objects:
If the API returns a list of objects, you can use `ParameterizedTypeReference`:

```java
import org.springframework.core.ParameterizedTypeReference;

public class ApiService {

    private final RestTemplate restTemplate;

    public ApiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<MyResponseObject> callExternalApi() {
        String url = "https://api.example.com/data";
        ResponseEntity<List<MyResponseObject>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<MyResponseObject>>() {}
        );
        return response.getBody();
    }
}
```

## Using WebClient

`WebClient` is a non-blocking, reactive client for HTTP requests. It's part of the Spring WebFlux project and is the preferred way to make HTTP calls in modern Spring applications.

1. Add the `WebClient` bean to your configuration:

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class AppConfig {
    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}
```

2. Inject the `WebClient.Builder` into your service and create a `WebClient` instance:

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class ApiService {

    private final WebClient webClient;

    @Autowired
    public ApiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String callExternalApi() {
        String url = "https://api.example.com/data";
        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
```

## Conclusion

In this guide, we've covered how to call external APIs from your Spring Boot application using both `RestTemplate` and `WebClient`. Depending on your use case, you can choose the one that best fits your needs.