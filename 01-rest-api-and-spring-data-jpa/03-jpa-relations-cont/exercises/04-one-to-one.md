# Adding a one-to-one (DRAFT)

## Goal:

The goal of this exercise is to add a one-to-one relationship between the `Customer` and `Profile` entities.

## Step 1: Create the entities:

Create the following entities:

```java
@Entity
public class Customer extends BaseEntity {

    private String name;

    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL)
    private Profile profile;

    // Constructors, Getters and Setters

}

@Entity
public class Profile extends BaseEntity {

    private String bio;

    @OneToOne
    private Customer customer;

    // Constructors, Getters and Setters

}
```

## Step 2: Adding repositories

Create the following repositories:

```java
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

}

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {

}
```

## Step 3: (DRAFT) Implement a servicelayer and controller for the `Customer` entity