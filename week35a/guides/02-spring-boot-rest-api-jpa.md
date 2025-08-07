# Creating Spring Boot Rest APIs with Spring Data JPA

## Prerequisites:
You should already have a Spring Boot application with the following dependencies:
- `Spring Web`
- `Spring Data JPA` (for database access)
- `H2 Database` (for in-memory testing)
- `MySQL Driver` (for real database access)

Also, ensure you have a **MySQL database** set up (e.g., `schooldb`).

## Problem
We want to create a REST API with MySQL for managing **students**, exposing the following endpoints:

| Method | Endpoint             | Description               |
|--------|----------------------|---------------------------|
| GET    | `/api/students`       | Get all students           |
| GET    | `/api/students/{id}`  | Get a student by ID        |
| POST   | `/api/students`       | Create a new student       |
| PUT    | `/api/students/{id}`  | Update a student by ID     |
| DELETE | `/api/students/{id}`  | Delete a student by ID     |

## Creating entities
Let's start by creating an java class named `Course`.

> Place this in `src/main/java/ek.osnb/schooladmin/model/Course.java`.
Note: Replace with your own package artifact name (eg. `ek.osnb`).

To create an a class that maps directly to a database table, we need to use the `@Entity` annotation.

```java
@Entity
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String instructor;
    
    // Getters & setters 
}
```
- **`@Id`**: Tells JPA/Hibernate that this is the **Primary key**.
- **`@GeneratedValue(strategy = GenerationType.IDENTITY`**: This is equivalent to **`AUTO_INCREMENT`**, ie. the database will create the id's automatically.

### Running the application
If we run the application, JPA will automatically create the table (make sure that `spring.jpa.hibernate.ddl-auto=create`) is set.

We can check the database using **MySQL Workbench**, **DataGrip** etc. But we will use the terminal:
- Open up terminal (git-bash on windows), and type in the following command:
```bash
mysql -u root -p
```
    - Note that `root` is the username.

- You will be prompted to enter your password associated with the user - enter your password.
- Use the command `show databases;` to see a list of all your databases.
- To select the one we are interested in we will use the command:
```bash
use schooldb;
```
- To see all enter the following commmand:
```bash
show tables;
```
- If everything went well, the table `course` will appear.
- To see the schema of the table use:
```bash
describe course;
```
- You should see the following output:
![mysql](assets/02-img1.png)

## Creating a Repository (data access) layer
In order for our application to access the database, we will use a JPA interface, that automatically (at runtime) creates CRUD operations.

```java
public interface CourseRepository extends JpaRepository<Course, Long> {}
```
The input in the diamond operator (eg. `<>`) is `<ENTITY_CLASS, PRIMARY_KEY_FIELD>`.

Now we have a way to query the database using the interface.

## Creating a REST Controller
To expose endpoints the endpoint, we will make a `CourseController` class. You are probably familiar with the annotation `@Controller`, which exposes views. We want to expose data in the form of `JSON`. To do this we will use another annotation `@RestController`.

```java
@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseRepository courseRepository;
    
    public CourseController(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }
    
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseRepository.findAll());
    }

    // Other CRUD operations (POST, PUT, DELETE etc.)
}
```

## Creating dummy data
At the moment there is no data in the database, so we would like to add some dummy data. There are several ways to do it, we will do it the programmatic way:

```java
@Component
public class InitData implements CommandLineRunner {
    private CourseRepository courseRepository;

    public InitData(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public void run(String... args) {
        Course c1 = new Course();
        c1.setName("PROG2");
        c1.setInstructor("OSNB");

        Course c2 = new Course();
        c2.setName("TEK2");
        c2.setInstructor("OSNB");
        
        Course c3 = new Course();
        c3.setName("SYS2");
        c3.setInstructor("OSTU");

        courseRepository.saveAll(List.of(c1,c2,c3));
    }

}
```

## Testing the endpoint
- Start by running the application, the application is running on `http://localhost:8080`.
- Open up a browser, and paste in the url `http://localhost:8080/api/courses`:
- You should get the following output:
```json
[
    {
        "id": 1,
        "name":"PROG2",
        "instructor": "OSNB"
    },
    {
        "id": 2,
        "name":"TEK2",
        "instructor": "OSNB"
    },
    {
        "id": 3,
        "name":"SYS2",
        "instructor": "OSTU"
    }
]
```

- We could also test the in the terminal
```bash
curl http://localhost:8080/api/courses
```
- Which gives the same output as above, but maybe not as pretty.


## Implementing full CRUD operations
We still need implement the remaining four endpoints:

In `CourseController.java` add the following
```java
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Optional<Course> coursOptional = courseRepository.findById(id);
        if(coursOptional.isPresent()) {
            return ResponseEntity.ok(coursOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
```
- `@GetMapping("/{id}")`: This is the endpoint for getting a course by its ID.
- `@PathVariable Long id`: This tells Spring to extract the `id` from the URL.
- `Optional<Course> coursOptional = courseRepository.findById(id)`: This uses the repository to find a course by its ID. The return type is `Optional<Course>`, which is a container that may or may not contain a value. 
- `if(coursOptional.isPresent())`: This checks if the course was found.
- `return ResponseEntity.ok(coursOptional.get())`: If the course was found, we return it with a 200 OK status.
- `return ResponseEntity.notFound().build()`: If the course was not found, we return a 404 Not Found status.

```java
    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course savedCourse = courseRepository.save(course);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCourse);
    }
```
- `@PostMapping`: This is the endpoint for creating a new course.
- `@RequestBody Course course`: This tells Spring to extract the course data from the request body.
- `Course savedCourse = courseRepository.save(course)`: This saves the course to the database.
- `return ResponseEntity.status(HttpStatus.CREATED).body(savedCourse)`: This returns the saved course with a 201 Created status.

```java
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        if(!courseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        course.setId(id);
        Course updatedCourse = courseRepository.save(course);
        return ResponseEntity.ok(updatedCourse);
    }
```
- `@PutMapping("/{id}")`: This is the endpoint for updating a course by its ID.
- `if(!courseRepository.existsById(id))`: This checks if the course exists.
- `course.setId(id)`: This sets the ID of the course to the one provided (only if there is a mismatch).
- `Course updatedCourse = courseRepository.save(course)`: This saves the updated course to the database.

- `return ResponseEntity.ok(updatedCourse)`: This returns the updated course with a 200 OK status.

```java
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        if(!courseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        courseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
```
- `@DeleteMapping("/{id}")`: This is the endpoint for deleting a course by its ID.
- `courseRepository.deleteById(id)`: This deletes the course from the database.
- `return ResponseEntity.noContent().build()`: This returns a 204 No Content status, indicating that the deletion was successful.

## Testing the remaining endpoints
- **Get a course by ID**:
```bash
curl http://localhost:8080/api/courses/1
```
- **Create a new course**:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"name":"NEW COURSE", "instructor":"NEW INSTRUCTOR"}' http://localhost:8080/api/courses
```
- **Update a course**:
```bash
curl -X PUT -H "Content-Type: application/json" -d '{"name":"UPDATED COURSE", "instructor":"UPDATED INSTRUCTOR"}' http://localhost:8080/api/courses/1
```

- **Delete a course**:
```bash
curl -X DELETE http://localhost:8080/api/courses/1
```

## Using named queries
Named queries allow you to define queries in a more readable way. Let's add a named query to our `Course` entity to find courses by instructor.
```java
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByInstructor(String instructor);
}
```
You can use this method in your controller to get courses by instructor:
```java
@GetMapping("/instructor/{instructor}")
public ResponseEntity<List<Course>> getCoursesByInstructor(@PathVariable String instructor) {
    List<Course> courses = courseRepository.findByInstructor(instructor);
    if (courses.isEmpty()) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(courses);
}
```
## Testing named queries
- **Get courses by instructor**:
```bash
curl http://localhost:8080/api/courses/instructor/OSNB
```
- This will return all courses taught by "OSNB".
```json
[
    {
        "id": 1,
        "name": "PROG2",
        "instructor": "OSNB"
    },
    {
        "id": 2,
        "name": "TEK2",
        "instructor": "OSNB"
    }
]
```

## Conclusion
In this tutorial, we have created a simple Spring Boot REST API with Spring Data JPA to manage courses. We have implemented all CRUD operations and tested them using both a web browser and the terminal. This is a foundational step in building more complex applications with Spring Boot and JPA.

## Exercises
1. Add a service layer that handles the business logic. This will make the controller depend on `CourseService` instead of `CourseRepository`, and the service will depend on `CourseRepository`. For these small applications, it really doesn't matter, but if you add more complex logic, it is a good practice to separate the concerns.
2. Repeat the same steps for a `Student` entity, creating a `StudentRepository`, `StudentController`, and implementing CRUD operations.
