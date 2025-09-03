# Many-to-many bidirectional relationship

## Goal:

Learn how to implement a bidirectional many-to-many relationship in Spring Data JPA.

## Step 1: Update entities

In the `Category` class, add a `ManyToMany` relationship with `Product`:

```java
@Entity
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToMany(mappedBy = "categories")
    private Set<Product> products = new HashSet<>();

    // Constructors, Getters and Setters
}
```

Now the relationship between `Product` and `Category` is bidirectional. `Product` is the owner of the relationship - hence it manages the jointable `product_category`.

## Step 3: Add helper methods for synching relationship

In the `Product` class, add the following helper methods:

```java
@Entity
public class Product {

    // Other fields

    public void addCategory(Category category) {
        if (category == null) return;
        if (this.categories.add(category)) {
            category.addProduct(this);
        }
    }

    public void removeCategory(Category category) {
        if (category == null) return;
        if (this.categories.remove(category)) {
            category.removeProduct(this);
        }
    }
}
```

In the `Category` class, add the following helper methods:

```java
@Entity
public class Category {

    // Other fields

    void addProduct(Product p) {
        products.add(p);
    }

    void removeProduct(Product p) {
        products.remove(p);
    }
}
```

## Step 4: Updating `InitData`

Inside the `run` method replace the following lines:

```java
novel.getCategories().add(books);
phone.getCategories().add(electronics);
```

With:
```java
novel.addCategory(books);
phone.addCategory(electronics);
```

## Step 5: Avoid infinite recursion

Create either a DTO using records, or use `@JsonManagedReference` and `@JsonBackReference` annotations to manage the serialization process and avoid infinite recursion.

## Step 6: Testing the implementation

Test all the endpoints using Postman.