# Adding Exception Handling

## Goal
Implement a global exception handling mechanism for the library system.

## Steps:
- Create a global exception handler class annotated with `@RestControllerAdvice` or `@ControllerAdvice`
- Create custom exception classes for specific errors like (`NotFoundException`, `BadRequestException`, etc.)
- Add exception handling methods in the global exception handler to return meaningful error responses.

## Optional:
- Add `jakarta.validation` dependency to your `pom.xml`:
    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    ```
- Use validation annotations in your DTOs (e.g., `@NotNull`, `@Size`, etc.) to enforce constraints. See a full list of validation annotations in the [Jakarta Bean Validation](https://www.baeldung.com/java-validation).
- Use the global exception handler to catch validation errors:
    - Use @ExceptionHandler(MethodArgumentNotValidException.class) to catch validation errors
    - Add to the `ProblemDetail` object the following way: 
    ```java
    List<String> errors = new ArrayList<>();
    for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
        errors.add(fieldError.getDefaultMessage());
    }
    problemDetail.setProperty("error", errors);
    ```
    - The `errors` variable is a list of validation error messages.