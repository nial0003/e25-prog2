# DTOs (Data Transfer Objects)

## What are DTOs?
DTOs, or Data Transfer Objects, are plain Java objects that are used to transfer data between different layers of an application, particularly between the service layer and the presentation layer. They are often used to encapsulate data that needs to be sent over the network or returned in API responses.

## Problem
When dealing with Spring Data JPA and bidirectional relationships, such as one-to-one relationships, we often face the issue of circular references. This can lead to problems when serializing entities to JSON, as the serializer enters an infinite loop trying to resolve the references.

Another common issue is that entities often contain more data than needed for a specific use case, or they may expose sensitive information (like passwords) that should not be sent to the client.

## DTO Solution
To solve these problems, we can use DTOs. By creating a DTO for our entities, we can control exactly what data is sent to the client, avoiding circular references and sensitive data exposure.

If we consider the `Student` and `StudentProfile` entities from the previous example, we can create a DTO for each entity:

```java
public class StudentDTO {
    private Long id;
    private String name;
    private String email;
    private StudentProfileDTO profile;
    // Getters and Setters
}
````

```java
public class StudentProfileDTO {
    private Long id;
    private String bio;
    // Getters and Setters
}
```

Now, when we fetch a `Student` entity, we can convert it to a `StudentDTO` before returning it in the API response. This way, we avoid circular references and control the data being sent to the client. The conversion should be done in the service layer.

```java
@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;

    public List<StudentDTO> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        List<StudentDTO> studentDTOs = new ArrayList<>();
        for (Student student : students) {
            StudentDTO dto = convertToDTO(student);
            studentDTOs.add(dto);
        }
        return studentDTOs;
    }

    public StudentDTO getStudentById(Long id) {
        Optional<Student> studentOptional = studentRepository.findById(id);
        if (studentOptional.isPresent()) {
            return convertToDTO(studentOptional.get());
        }
        return null;
    }

    private StudentDTO convertToDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setProfile(convertToProfileDTO(student.getProfile()));
        return dto;
    }

    private StudentProfileDTO convertToProfileDTO(StudentProfile profile) {
        StudentProfileDTO dto = new StudentProfileDTO();
        dto.setId(profile.getId());
        dto.setBio(profile.getBio());
        return dto;
    }
}
```
So now our  controller layer can remain clean and focused on handling HTTP requests, while the service layer handles the business logic and data transformation.

```java
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public List<StudentDTO> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        StudentDTO studentDTO = studentService.getStudentById(id);
        if (studentDTO != null) {
            return ResponseEntity.ok(studentDTO);
        }
        return ResponseEntity.notFound().build();
    }
}
```

This approach allows us to keep our entities clean and focused on the database representation, while DTOs handle the data transfer concerns. It also makes it easier to change the API response structure without affecting the underlying entity model.

Furthermore it solves the problem of circular references.

## Using `record`s for DTOs
In modern Java, you can also use records to define DTOs. Records are a special kind of class in Java that are immutable and provide a concise way to define data carriers. Here's how you can define the `StudentDTO` and `StudentProfileDTO` using records:
```java
public record StudentDTO(Long id, String name, String email, StudentProfileDTO profile) {}

public record StudentProfileDTO(Long id, String bio) {}
```
This approach is more concise and leverages the benefits of immutability, making it a good choice for DTOs.

### How do we instantiate and use records?
You can instantiate a record by providing the values for its components in the constructor-like syntax. Here's how you can create an instance of `StudentDTO` and access its fields:
```java
StudentProfileDTO profile = new StudentProfileDTO(1L, "Ananas pizza is a crime");
StudentDTO student = new StudentDTO(1L, "OSNB", "osnb@example.com", profile);
System.out.println("Student Name: " + student.name());
System.out.println("Profile Bio: " + student.profile().bio());
```

## Summary
- **DTOs** are used to transfer data between layers, avoiding circular references and sensitive data exposure.
- **Service Layer** handles the conversion from entities to DTOs, keeping the controller layer clean.

## Exercises
1. Create an ENUM `Gender` with values `MALE`, `FEMALE`, and `OTHER`. Add a field of type `Gender` to the `StudentProfileDTO` and update the service layer accordingly.
2. Refactor the dtos in the example to use records instead.
3. Update the service layer to use the new record-based DTOs.
