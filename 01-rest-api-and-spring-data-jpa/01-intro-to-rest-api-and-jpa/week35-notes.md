# REST API & Spring Data JPA introduction

Osman B - osnb@ek.dk 

PROG2 - Datamatiker 3rd semester @ EK - Erhvervsakademi København

**Date**: XX-XX-2025

## Topics
- Intro to the course and semester plan
- Exam overview and and dates??
- What is a REST web API (with examples)
- How do we build a a REST (web) API using Spring Boot?
- Review of JDBC from 2nd semester using MySQL
- Setting up a Spring Boot Application using Spring Data JPA with H2 and/or MySQL database
- Configuring applications.properties
- Creating Entities
- Initializing the database with dummy data using an SQL file and programatic way
- JUnit tests


## Class notes
-  


---

## Peer instructions 
### 1. What does the `@Entity` annotation do?
- a. Marks a class as a Spring bean  
- b. Maps the class to a database table  
- c. Ensures the class has an ID field  
- d. Registers the class with the repository  

---

### 2. Which of these fields must be present in every JPA entity?
- a. A field with `@Column`  
- b. A field with `@GeneratedValue`  
- c. A field with `@Id`  
- d. A field named `id`  

---

### 3. What does `@GeneratedValue(strategy = GenerationType.IDENTITY)` do?
- a. Manually assigns a value to the ID field  
- b. Uses a UUID generator  
- c. Lets the database auto-generate the primary key (e.g., auto-increment)  
- d. Requires the developer to provide the ID  

---

### 4. What happens when you call `.save()` on a Spring Data JPA repository?
- a. It updates the database schema  
- b. It persists a new entity or updates an existing one based on the ID  
- c. It always inserts a new record  
- d. It deletes the entity if it already exists  

---

### 5. What does `spring.jpa.hibernate.ddl-auto=update` do?
- a. Drops and recreates all tables every time  
- b. Does nothing — no schema changes  
- c. Updates the DB schema based on entities without removing existing data  
- d. Only validates the schema without changes  

---

### 6. Which `ddl-auto` setting should you avoid in production?
- a. `validate`  
- b. `update`  
- c. `none`  
- d. `create-drop`  

---

### 7. What happens if we omit a getter (e.g. `getName()`) for an entity field when calling a REST endpoint?
- a. The field will still be included in the JSON response  
- b. The field will be excluded from the JSON response  
- c. The application will throw an error  
- d. The field will be included only in POST requests  
 

## Exercises

