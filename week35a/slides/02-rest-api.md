---
marp: true
title: "02-rest-api"
version: "1.0"
paginate: true
theme: default
---

# REST APIs using Spring Boot
3rd semester @ Erhvervsakademi København

---

## From Thymeleaf to REST APIs
- Last semester, you learned to build web applications using **Thymeleaf**.:
  - You used **Thymeleaf** to build web pages (HTML returned from controllers).
- This semester, we will focus on **REST APIs**:
  - Build **REST APIs** that return **data** (JSON or XML) instead of HTML.
  - Use **Spring Boot** to create RESTful services.


---

## What is a REST API?
- **REST** = **Re**presentational **S**tate **T**ransfer
- A way to **send and receive data** over HTTP
- Uses standard HTTP methods:
  - `GET` → Read data
  - `POST` → Create new data
  - `PUT` → Update existing data
  - `DELETE` → Remove data

---

## REST vs Thymeleaf
| Thymeleaf Controller | REST API Controller |
|----------------------|----------------------|
| Returns HTML view    | Returns JSON data    |
| `ModelAndView`       | `@ResponseBody` or `ResponseEntity` |
| Browser renders page | Any client can use (browser, mobile, JS, IoT) |

---

## Thymeleaf Controller
```java
@Controller
public class HelloController {
    @GetMapping("/hello")
    public String hello(Model model) {
        model.addAttribute("message", "Hello Thymeleaf!");
        return "index";
    }
}
```

---
## HELLO REST API Controller
```java
@RestController // returns JSON by default
public class HelloApiController {

    @GetMapping
    public String hello() {
        return "Hello REST API!";
    }
}
``` 

---

## Serializing Objects to JSON
`User.java`
```java
public class User {
    private String name;
    private int age;
    // Constructors, getters, setters
}
```
`UserController.java`
```java
@RestController
@RequestMapping("/api/user")
public class UserController {
    @GetMapping
    public User getUser() {
        return new User("Osman", 33);
    }
}
```

---

## Request and Response
- **Request**: Client sends a request to the server (from browser, mobile app, etc.)
    - `GET http://localhost:8080/api/user`
- **Response**: Server sends back data in JSON format
    ```json
    {
        "name": "Osman",
        "age": 33
    }
    ```

---

## HTTP Methods
- **GET**: Retrieve data (e.g., get a list of users)
    ```bash
    curl http://localhost:8080/api/user
    ```
- **POST**: Create new data (e.g., add a new user)
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"name": "Alice", "age": 30}' http://localhost:8080/api/user
    ```

- **PUT**: Update existing data (e.g., update user information)
    ```bash
    curl -X PUT -H "Content-Type: application/json" -d '{"name": "Alice", "age": 31}' http://localhost:8080/api/user/1
    ```
- **DELETE**: Remove data (e.g., delete a user)
    ```bash
    curl -X DELETE http://localhost:8080/api/user/1
    ```

---

## Response Status Codes
- **`200 OK`**: Request was successful
- **`201 Created`**: Resource was created successfully
- **`204 No Content`**: Request was successful, but no content to return
- **`400 Bad Request`**: Invalid request data
- **`404 Not Found`**: Resource not found
- **`500 Internal Server Error`**: Server encountered an error

---

## Setting Response status codes in Spring Boot
You can set the response status code in your controller methods using `ResponseEntity`:
```java
@GetMapping("/{id}")
public ResponseEntity<User> getUser(@PathVariable Long id) {
    User user = userService.findById(id);
    if (user != null) {
        return ResponseEntity.ok(user); // 200 OK
    } else {
        return ResponseEntity.notFound().build(); // 404 Not Found
    }
}
```


---

## Client-Server Architecture
- **Client**: The application that requests data or services
- **Server**: The application that provides data or services
- **Communication**: Typically over HTTP/HTTPS
```plaintext
+-----------------+                         +----------------------------+
|    Clients      |   ----- Requests ---->  |           Server           |
|-----------------|                         |----------------------------|
| - Browser       |                         | - API / Web Server         |
| - Mobile App    |   <---- Response -----  | - Business Logic           |
| - Desktop App   |                         | - Database                 |
| - IoT Device    |                         | - File Storage             |
| - Another Server|                         | - Another Service (micro)  |
+-----------------+                         +----------------------------+
```


---

## What is a REST API?
- **REST**: Representational State Transfer
- An architectural style for designing networked applications
- Uses standard HTTP methods (GET, POST, PUT, DELETE)
- Stateless communication
- Resources are identified by URIs
- Data is typically exchanged in JSON or XML format

---
## Why Use REST APIs?