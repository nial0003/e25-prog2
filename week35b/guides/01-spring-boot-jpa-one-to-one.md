# Spring Data JPA - One-to-One Relationships

## Prerequisites
- A Spring Boot application set up with Spring Data JPA.
- A working MySQL database.

## What are One-to-One Relationships?
One-to-One relationships in JPA allow you to map a single entity to another single entity. This is useful when you want to represent a relationship where one entity is directly associated with another, such as a user profile linked to a user account.

Until now you have only worked with one-to-many relationships, by creating SQL tables directly in MySQL. In this guide, we will explore how to create one-to-one relationships using Spring Data JPA.

Example of a Student and StudentProfile relationship in SQL:
```sql
CREATE TABLE student (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE student_profile (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bio TEXT,
    student_id BIGINT UNIQUE,
    FOREIGN KEY (student_id) REFERENCES student(id)
);
```
We will try to create a similar relationship using Spring Data JPA.

## Creating One-to-One Relationships using Spring Data JPA
To create a one-to-one relationship in Spring Data JPA, you can use the `@OneToOne` annotation. This annotation can be used in both directions of the relationship, depending on whether you want a unidirectional or bidirectional relationship. More on that later.

### Example Entities
Let's create two entities: `Student` and `StudentProfile`.
```java
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    @OneToOne
    private StudentProfile profile;

    // Getters and Setters
}
```
```java
@Entity
public class StudentProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String bio;
}
```

### Creating the Repository
The repositories for these entities can be created as follows:
```java
public interface StudentRepository extends JpaRepository<Student, Long> {
}
```
```java
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
}
```

So we do not need to do anything special in the repository layer to handle one-to-one relationships. Spring Data JPA will automatically handle the mapping for us.

### Controller layer
We create a simple controller to handle `GET`requests for both entities.
```java
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Optional<Student> studentOptional = studentRepository.findById(id);
        if (studentOptional.isPresent()) {
            return ResponseEntity.ok(studentOptional.get());
        }
        return ResponseEntity.notFound().build();
    }
}
```

At the moment we do not have any data in our database, so we will need to create some sample data to test our one-to-one relationship.
### Dummy Data Creation
We will use the `CommandLineRunner` interface to create some dummy data when the application starts.
```java
@Component
public class InitData implements CommandLineRunner {
    private final StudentRepository studentRepository;
    private final StudentProfileRepository studentProfileRepository;

    public InitData(StudentRepository studentRepository, StudentProfileRepository studentProfileRepository) {
        this.studentRepository = studentRepository;
        this.studentProfileRepository = studentProfileRepository;
    }

    public void run(String... args) throws Exception {
        Student student = new Student();
        student.setName("OSNB");
        student.setEmail("osnb@example.com");


        StudentProfile profile = new StudentProfile();
        profile.setBio("Ananas pizza is a crime");  
        student.setProfile(profile);

        studentProfileRepository.save(profile);
        studentRepository.save(student);
    }
}
```
Notice how we save `StudentProfile` entity before saving the `Student`. This is important because the `StudentProfile` must exist before it can be associated with a `Student`.

### Running the Application
Now, if you run the application and access the endpoint `/api/students`, you should see the `Student` entities along with their associated `StudentProfile` entities:
```json
[
    {
        "id": 1,
        "name": "OSNB",
        "email": "osnb@example.com",
        "profile": {
            "id": 1,
            "bio": "Ananas pizza is a crime"
        }
    }
]
```

## Bidirectional vs Unidirectional Relationships
Let's say we would like to access the `Student` entity from the `StudentProfile` entity. In that case, we need to make the relationship bidirectional.
To do this, we can modify the `StudentProfile` entity to include a reference back to the `Student` entity:
```java
@Entity
public class StudentProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bio;

    @OneToOne(mappedBy = "profile") 
    private Student student;

    // Getters and Setters
}
```
This way, you can navigate the relationship in both directions (in Java code). The `mappedBy` attribute indicates that the `StudentProfile` entity is the inverse side of the relationship (the one that does not hold the foreign key). The value of `mappedBy` should match the name of the field in the `Student` entity that holds the reference to `StudentProfile`, i.e., `profile`.

If you run the application now, you can access the endpoint `/api/students` and you will get infinite recursion, since the `Student` entity references the `StudentProfile`, which in turn references the `Student` and so on.

To avoid the infinite recursion, we will use two annotations from the Jackson library (the library that handles JSON serialization in Spring): `@JsonManagedReference` / `@JsonBackReference`.
```java
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    @OneToOne
    @JsonManagedReference // This is the parent side of the relationship
    private StudentProfile profile;
    // Getters and Setters
}
```
```java
@Entity
public class StudentProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String bio;
    @OneToOne(mappedBy = "profile")
    @JsonBackReference // This is the child side of the relationship
    private Student student;
    // Getters and Setters
}
```
Now, when you access the `/api/students` endpoint, you will get the `Student` entity with its `StudentProfile`, but the `StudentProfile` will not contain a reference back to the `Student`, thus preventing infinite recursion.

## Common Pitfalls and How to Avoid Them
- **Infinite Recursion**: When using bidirectional relationships, be careful with serialization. Use `@JsonIgnore` on one side of the relationship to prevent infinite recursion during JSON serialization.
- **Cascading Operations**: Ensure that you understand how cascading operations work in JPA. If you want to delete a `Student` and also delete the associated `StudentProfile`, you can use the `cascade` attribute in the `@OneToOne` annotation.
- **Transient Entities**: Be cautious when dealing with transient entities (entities that have not yet been saved). If you try to save a `Student` with a new `StudentProfile` that has not been persisted, it will throw an exception. Always ensure that the associated entity is managed by the persistence context.

