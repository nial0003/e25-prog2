# Library project - day 3

## Goal:

Implement a many-to-many relationship between `Work` and `Author` entities, and a Many-To-Many relationship between `Work` and `Subject` entities.

You’ll update entities, DTOs, mappers, services, controllers, and seed data.

## Requirements

- There should be a bidirectional ManyToMany relationship between `Work` and `Author`.
- There should be a unidirectional ManyToMany relationship between `Work` and `Subject`. `Work` should have a collection of `Subject` entities, but `Subject` should not have a reference to `Work`.


## Step 1: Create the entities

1. Create the `Author` entity with the following fields:
   - `id` (Long)
   - `name` (String)

2. Create the `Subject` entity with the following fields:
   - `id` (Long)
   - `name` (String)
   
## Step 2: Establish relationships

1. In the `Work` entity, add the following annotations:
   - `@ManyToMany` for the relationship with `Author`
   - `@ManyToMany` for the relationship with `Subject`

2. In the `Author` entity, add the following annotation:
   - `@ManyToMany(mappedBy = "authors")` for the relationship with `Work`

3. In the `Subject` entity, no additional annotations are needed since the relationship is unidirectional.

## Step 3: Create repositories

Create the `AuthorRepository`, `SubjectRepository` interfaces that extend `JpaRepository`.

## Step 4: Create and update the service layer

1. Create the `AuthorService` and `SubjectService` classes.
2. Implement the necessary methods to handle business logic.
3. Update the `WorkService` to handle the new relationships with `Author` and `Subject`.

## Step 5: Create DTOs

1. Create the `AuthorDTO` and `SubjectDTO` classes, to avoid infinite recursion issues (only an issue with `Author`).
2. Implement the necessary mappers to convert between entities and DTOs.

## Step 6: Create controllers

1. Create the `AuthorController` and `SubjectController` classes.
2. Implement CRUD endpoints for `Author` and `Subject` entities.

## Step 7: Update the `WorkController`

1. Update the `WorkController` to handle the new relationships with `Author` and `Subject`.

## Step 8: Update the `InitData` class

1. Update the `InitData` class to include authors and subjects when initializing works.
2. Ensure that the relationships are properly established in the database.
