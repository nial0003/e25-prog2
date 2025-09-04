# Exception handling in Spring Boot

## Goal:

Implement an exception handling mechanism for the GitHub API client.

## Step 1: Error handling (Problem Details)

We will implement a global exception handler that catches all `ApiException` instances and returns a standardized error response.

The standardized error response follows the **RFC 7807 Problem Details** specification.

Inside the `shared` package, create the following abstract class:

```java
public abstract class ApiException extends RuntimeException {
    private final HttpStatus status;
    private final String code;

    protected ApiException(HttpStatus status, String code, String message) {
        super(message);
        this.status = status;
        this.code = code;
    }

    protected ApiException(HttpStatus status, String code, String message, Throwable cause) {
        super(message, cause);
        this.status = status;
        this.code = code;
    }

    public HttpStatus status() {
        return status;
    }

    public String code() {
        return code;
    }
}
```

This class will be used as a base class for all client-related exceptions.

Inside the same package create a `ClientException` class, that extends `ApiException`:

```java
public final class ClientException extends ApiException {

  public ClientException(HttpStatus status, String code, String message) {
      super(status, code, message);
  }

  public ClientException(HttpStatus status, String code, String message, Throwable cause) {
      super(status, code, message, cause);
  }
}
```
This exception will be thrown when the GitHub API returns a client error (4xx). Which typically happens when we hit the API rate limit or provide invalid input.

## Step 2: Global Exception Handler

The Global Exception Handler will catch all `ApiException` instances and return a standardized error response.

Create the the `GlobalExceptionHandler` class in `adapters.in.web` package:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ApiException.class)
  public ResponseEntity<ProblemDetail> handleApi(ApiException ex, HttpServletRequest req) {

    ProblemDetail pd = ProblemDetail.forStatusAndDetail(ex.status(), ex.getMessage());
    pd.setTitle(ex.code());
    pd.setProperty("path", req.getRequestURI());
    pd.setProperty("timestamp", LocalDateTime.now());

    return ResponseEntity.status(ex.status()).body(pd);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ProblemDetail> handleOther(Exception ex, HttpServletRequest req) {

    ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error");

    pd.setTitle("INTERNAL_ERROR");
    pd.setProperty("path", req.getRequestURI());
    pd.setProperty("timestamp", LocalDateTime.now());

    return ResponseEntity.status(500).body(pd);
  }
}
```
- The `ProblemDetail` class is a built-in Spring class that represents the Problem Details response according to the **RFC 7807** specification.
- The `HttpServletRequest` is used to extract the request URI and set it in the `ProblemDetail` response.
- The `@ExceptionHandler` annotation is used to define the method that will handle specific exceptions. Note that the last method will catch all other exceptions.

## Step 3: Making the GitHub API adapter throw

So far we have only thrown `RuntimeException`.

Instead we want to throw `ClientException` with the appropriate status and message.

Replace the following inside `GitHubHttpAdapter`:
```java
catch (HttpStatusCodeException e) {
    throw new RuntimeException("Failed to fetch user from GitHub");
} catch (RestClientException e) {
    throw new RuntimeException("Failed to fetch user from GitHub");
}
```

With the following error handling:

```java
catch (HttpStatusCodeException e) {
    // Convert numeric status code to HttpStatus
    HttpStatus status = HttpStatus.resolve(e.getStatusCode().value());

    // If status is not recognized, fallback to BAD_GATEWAY
    if (status == null) {
        status = HttpStatus.BAD_GATEWAY;
    }

    // Extract response body
    String body = e.getResponseBodyAsString();

    // Determine error code based on status and response body
    String code = status == HttpStatus.FORBIDDEN && body.toLowerCase().contains("rate limit")
            ? "GITHUB_RATE_LIMIT" : "EXTERNAL_API_ERROR";
    throw new ClientException(status, code, "Failed to call GitHub: " + e.getMessage(), e);
} catch (RestClientException e) {
    throw new ClientException(HttpStatus.BAD_GATEWAY, "UPSTREAM_CALL_FAILED", "Failed to call GitHub", e);
}
```

- Note that we throw `ClientException(status, code, message, cause)`, preserving the original exception as the **cause** for logging/stack traces.
- The `RestClientException` is a base class for all exceptions thrown by the RestTemplate.
- The `HttpStatusCodeException` is a specialized type of `RestClientException` that contains the HTTP status code and response body.

## Step 4: Test the API

Run the application, and test the following endpoint:

```bash
curl http://localhost:8080/api/users/osman-butt
```

**If you haven´t already:**

<img src="assets/subkaribe.png" width="240" />

**to my GitHub profile**

## Step 5: Adding cacheControl

Inside the controller class, we would like to add caching headers to the response.

To do this, we can use the `CacheControl` class provided by Spring.

```java
@GetMapping("/{userName}")
  public ResponseEntity<UserView> byUserName(@PathVariable String userName) {
    return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(10, TimeUnit.MINUTES))
            .body(query.byUserName(userName));
  }
```
This will add a `Cache-Control` header to the response, instructing clients to cache the response for 10 minutes. If the same request is made again within this time frame, the cached response will be returned instead of hitting the backend service.

## Step 6: Verify caching

Run the program.

Try hitting the endpoints a couple of times in **Postman** or your browser and observe the response times. They should be significantly faster after the first request, as the responses are served from the cache.

Try to access your database, to verify that the data is being persisted.