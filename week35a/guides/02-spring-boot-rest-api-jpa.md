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
