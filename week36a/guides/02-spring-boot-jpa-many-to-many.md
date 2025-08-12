# Spring Data JPA - Many-to-many Relationships

## Set up before starting
- Ensure you have a Spring Boot project set up with Spring Data JPA and a database (H2 or MySQL).
- Make sure you have the necessary dependencies in your `pom.xml`.
- Configure your `application.properties` file with the database connection settings.
```properties
# MySQL Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/manytomanydb?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=create
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

## Introduction
In this guide, we will explore how to model Many-to-Many relationships in Spring Data JPA. We will cover the necessary annotations, how to set up the entities, and how to manage these relationships.

Many-to-Many relationships are common in database design, where one entity can be associated with multiple instances of another entity and vice versa. For example, a `Student` can enroll in multiple `Courses`, and a `Course` can have multiple `Students` enrolled in it.

Note that we could also model the relationship as a One-to-Many and Many-to-One relationship by introducing an intermediate entity, such as `Enrollment`, to represent the association between `Student` and `Course`. For simplicity, we will focus on the Many-to-Many relationship directly in this guide.

## Unidirectional Many-to-Many Relationship
A unidirectional Many-to-Many relationship means that one entity knows about the other, but the other does not know about the first. In this case, we will have a `Student` entity that knows about the `Course` entity, but the `Course` entity does not know about the `Student` entity.

In SQL this relationship can be represented as follows:
```sql
CREATE TABLE student (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE course (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    year INT NOT NULL
);

CREATE TABLE student_course (
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (course_id) REFERENCES course(id)
);
```

We will model this relationship using JPA annotations. First, we create the `Student` and `Course` entities:

```java
@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @ManyToMany
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> courses = new HashSet<>();
}
```
```java
@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private int year;
}
```
In the above code:
- The `@ManyToMany` annotation is used to define the Many-to-Many relationship between `Student` and `Course`. And the `@JoinTable` annotation specifies the join table that holds the foreign keys for both entities.
- The `joinColumns` attribute specifies the foreign key column for the `Student` entity, and the `inverseJoinColumns` attribute specifies the foreign key column for the `Course` entity.
- The `Set<Course> courses` field in the `Student` entity represents the collection of `Course` entities associated with a `Student`.

Note that `Student` owns the relationship because it contains the `@JoinTable` annotation.

---------------

We create the repositories for both entities:
```java
public interface StudentRepository extends JpaRepository<Student, Long> {
}
```
```java
public interface CourseRepository extends JpaRepository<Course, Long> {
}
```

### Using the Repositories
You can use these repositories to perform CRUD operations on the entities. For example, you can create a new `Student` and associate it with some `Course` entities.
```java
@Component
public class InitData implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public InitData(StudentRepository studentRepository, CourseRepository courseRepository) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    public void run(String... args) {
        // Create some courses
        Course course1 = new Course();
        course1.setTitle("PROG2");
        course1.setYear(2025);

        Course course2 = new Course();
        course2.setTitle("TEK2");
        course2.setYear(2025);

        // Save courses
        courseRepository.saveAll(List.of(course1, course2));

        // Create a student and associate with courses
        Student student = new Student();
        student.setName("Student A");
        student.getCourses().add(course1);
        student.getCourses().add(course2);

        // Save the student
        studentRepository.save(student);
    }
}
```
Because the relationship is unidirectional, only the `Student.courses` side is needed.

### Bidirectional Relationships
A bidirectional Many-to-Many relationship means that both entities know about each other. In this case, we will modify the `Course` entity to include a reference to the `Student` entity.

```java
@Entity
@Table(name = "courses")
public class Course {
    // existing fields
    @ManyToMany(mappedBy = "courses")
    private Set<Student> students = new HashSet<>();
    // getters and setters
}
```

Now we need to modify the `InitData` class to handle the bidirectional relationship:
```java
@Component
public class InitData implements CommandLineRunner {
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public InitData(StudentRepository studentRepository, CourseRepository courseRepository) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    public void run(String... args) {
        // Create some courses
        Course course1 = new Course();
        course1.setTitle("PROG2");
        course1.setYear(2025);

        Course course2 = new Course();
        course2.setTitle("TEK2");
        course2.setYear(2025);

        // Save courses
        courseRepository.saveAll(List.of(course1, course2));

        // Create a student and associate with courses
        Student student = new Student();
        student.setName("Student A");

        // Sync the relationship
        student.getCourses().add(course1);
        student.getCourses().add(course2);
        course1.getStudents().add(student);
        course2.getStudents().add(student);

        // Save the student
        studentRepository.save(student);
    }
}
```
This code ensures that both sides of the relationship are synchronized when saving the entities.

## Excercises
1. **Create DTOs**: Create Data Transfer Objects (DTOs) for `Student` and `Course` entities. Implement a service layer that converts between entities and DTOs.
2. **Create a REST API**: Implement a REST API to manage `Student` and `Course` entities. Include endpoints to create, read, update, and delete both entities.
