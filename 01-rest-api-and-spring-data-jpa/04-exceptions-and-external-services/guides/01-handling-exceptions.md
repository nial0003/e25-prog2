# Global Exception Handling

In a Spring Boot application, you can handle exceptions globally using the `@ControllerAdvice` annotation. This allows you to define a centralized exception handling mechanism for your entire application.

## Step 1: Create a Global Exception Handler

Create a new class annotated with `@ControllerAdvice` and define methods to handle specific exceptions.

```java
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
    }
}
```

## Step 2: Throw Exceptions in Your Controllers

In your controller classes, you can throw exceptions when needed. The global exception handler will catch these exceptions and return the appropriate response.

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyController {

    @GetMapping("/resource/{id}")
    public Resource getResource(@PathVariable String id) {
        return resourceService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
    }
}
```

## Conclusion

By using `@ControllerAdvice`, you can centralize your exception handling logic and keep your controllers clean and focused on their primary responsibilities.