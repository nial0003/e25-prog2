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

