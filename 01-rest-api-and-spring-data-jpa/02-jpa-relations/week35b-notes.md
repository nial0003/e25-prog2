# Spring Data JPA - One-to-one relationships

**Author** Osman B - osnb@ek.dk 

PROG2 - Datamatiker 3rd semester @ EK - Erhvervsakademi København

**Date**: XX-XX-2025

## Topics
- Creating OneToMany and ManyToOne Relationships using Spring Data JPA
- Bidirectional vs Unidirectional Relationships
- DTO (Data Transfer Object) Patterns in OneToMany and ManyToOne Relationships
- Fetching Strategies (Eager vs Lazy Loading)
- Cascading Operations in OneToMany and ManyToOne Relationships

## Class notes
-  

---

## Peer instructions
### 1. When does infinite recursion occur in a One-to-One relationship?
- a. When both entities reference each other  
- b. When one entity has a `@OneToOne` annotation  
- c. When the entities are not annotated with `@Entity`  
- d. When the entities are not saved in the database

### 2. What is bidirectional relationship in JPA?
- a. A relationship where both entities reference each other  
- b. A relationship where one entity references another  
- c. A relationship where entities are not related  
- d. A relationship that does not require annotations

### 3. What does `mappedBy` in `@OneToOne(mappedBy = "...")` do in a bidirectional relationship?
- a. It specifies the owning side of the relationship
- b. It specifies the inverse side of the relationship

### 4. What is the purpose of using DTOs in a One-to-One relationship?
- a. To avoid circular references and control data exposure
- b. To automatically fetch related entities
- c. To simplify the database schema
- d. To create a new entity in the database

### 5. What is the default fetching strategy for `@OneToOne` relationships in Spring Data JPA?
- a. Lazy fetching
- b. Eager fetching
- c. No fetching strategy

### 6. What does `cascade = CascadeType.ALL` do in a `@OneToOne` relationship?
- a. It allows all operations (like save, delete) to be cascaded to the related entity
- b. It prevents any operations on the related entity
- c. It only allows read operations on the related entity

### 7. What is the purpose of the `@JoinColumn` annotation in a One-to-One relationship?
- a. To specify the column that holds the foreign key in the owning entity
- b. To specify the column that holds the primary key in the related entity

### 8. What does `@OneToOne(fetch = FetchType.LAZY)` do?
- a. It fetches the related entity immediately when the parent entity is fetched
- b. It fetches the related entity only when it is accessed for the first time.
