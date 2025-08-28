# Library Project

## Introduction
Throughout this semester, we will be building a REST API for a library system using Spring Boot. This project will serve as a practical application of the concepts learned in class, including entity creation, database interactions, and RESTful API design.

We will be building the library system step by step, starting with the foundational components and gradually adding more features. The project will be structured to allow for easy expansion and modification as we learn new concepts.

The aim of the project is to build a library system, where we split the system into several **bounded contexts**, each representing a specific area of the system. The bounded contexts are:
- **Catalog**: Contains information about works, editions, publishers, authors, and subjects.
- **Inventory**: Manages libraries, and copies of works.
<!-- - **Loans**: Handles loans and reservations of works (**OPTIONAL IF TIME ALLOWS!**)
- **Users**: Manages users, roles, and members of the library (**OPTIONAL IF TIME ALLOWS!**) -->

### Dependencies
- **Catalog** is upstream does not depend on any modules.
- **Inventory** depends on **Catalog** for edition/work lookup (only reads from the service).
<!-- - **Loans** depends on **Inventory** (to check/lock copies) and **Users** (to check members).
- **Users** is upstream for identity; other modules can use it for user management. -->

## Project start
You will work on this project during classes and at home. The project will be divided into several milestones, each focusing on a specific aspect of the library system and coupling with the concepts learned in class. Each lecture contains a set of tasks that you will complete.

In the first part of the project, we will focus on building a REST API using Spring Data JPA. We will build the `Catalog` module, which will contain information about works, editions, publishers, authors, and subjects.

The `Catalog` module have the following domain model:

```plaintext
+--------+ 1..*     +------+  0..*       +---------+
| Author | -------- | Work | ----------- | Subject |
+--------+     0..* +------+        1..* +---------+
                        | 1
                        |
                  1...* |
                  +---------+ 1..*     +-----------+
                  | Edition | -------- | Publisher |
                  +---------+        1 +-----------+
```
- **Work**: Contains information about a book, including its title, author(s), and subjects.
- **Author**: Represents the authors of a work.
- **Subject**: Represents the subjects associated with a work.
- **Edition**: Represents a specific edition of a work.
- **Publisher**: Represents the publisher of a specific edition.