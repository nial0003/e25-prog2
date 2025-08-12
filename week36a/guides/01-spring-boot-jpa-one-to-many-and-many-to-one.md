# Spring Data JPA - One-to-Many and Many-to-One Relationships

## Introduction
In this guide, we will explore how to model One-to-Many and Many-to-One relationships in Spring Data JPA. We will cover the necessary annotations, how to set up the entities, and how to manage these relationships.

One-to-Many / Many-to-One relationships are common in database design, where one entity can be associated with multiple instances of another entity. For example, a `OrderLine` can have multiple `Orders`, a `Course` can have multiple `CourseOfferings`, a `Student` can have multiple `Enrollments`, etc.

## Simple example
Let's consider a simple example where we have a `OrderLine` entity and an `Order` entity. An `Order` can have multiple `OrderLines`, but each `OrderLine` belongs to only one `Order`.

In SQL this relationship can be represented as follows:
```sql
CREATE TABLE order_line (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    productName VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    order_id BIGINT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_date DATE NOT NULL
);
```

We will model this relationship using JPA annotations, and begin with a unidirectional Many-to-One relationship (as this is the simplest form). The `OrderLine` entity will have a foreign key reference to the `Order` entity.

```java
@Entity
@Table(name = "order_lines") // This specifies the table name in the database
public class OrderLine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String productName;
    private double price;
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false) // This specifies the foreign key column in the order_line table
    private Order order;
    // Getters and Setters
}
```
```java
@Entity
@Table(name = "orders") // This specifies the table name in the database
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate orderDate;
    // Getters and Setters
}
```
In the above code:
- The `@ManyToOne` annotation indicates that many `OrderLine` entities can be associated with one `Order`. And that the `OrderLine` is the owning side of the relationship (eg. it contains the foreign key).
- The `@JoinColumn` annotation specifies the foreign key column in the `order_lines` table that references the `orders` table. **This is optional**. The only required annotation is `@ManyToOne`.
- The `nullable = false` attribute ensures that every `OrderLine` must be associated with an `Order`.
- The `@Table` annotation specifies the table name in the database, which is optional if the class name matches the table name. But in SQL databases the keyword `order` is reserved, so we use `orders` instead.



We create the repositories for both entities:
```java
public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
```
```java
public interface OrderRepository extends JpaRepository<Order, Long> {
}
```

### Using the Repositories
You can use these repositories to perform CRUD operations on the entities. For example, to save an `Order` with multiple `OrderLines`, you can do the following:
```java
@Component
public class InitData implements CommandLineRunner {

    private OrderRepository orderRepository;    
    private OrderLineRepository orderLineRepository;

    public InitData(OrderRepository orderRepository, OrderLineRepository orderLineRepository) {
        this.orderRepository = orderRepository;
        this.orderLineRepository = orderLineRepository;
    }

    public void run(String... args) {
        Order order = new Order();
        order.setOrderDate(LocalDate.now());
        orderRepository.save(order);

        OrderLine line1 = new OrderLine();
        line1.setProductName("Product 1");
        line1.setPrice(10.99);
        line1.setOrder(order);
        orderLineRepository.save(line1);

        OrderLine line2 = new OrderLine();
        line2.setProductName("Product 2");
        line2.setPrice(20.49);
        line2.setOrder(order);
        orderLineRepository.save(line2);
    }
}
```
We first save the `Order` entity before saving the `OrderLine` entities. This is because the `OrderLine` needs to reference an existing `Order`. In addition, how does `line1.setOrder(order);` work? The `Order` entity becomes managed by the JPA context when we call `orderRepository.save(order);`. This means that the `Order` entity has an `Id` assigned to it, which is then used by the `OrderLine` entity when we call `line1.setOrder(order);`. (To see this at a print statement before and after the `save` call, you can use `System.out.println(order.getId());` to see the ID assigned by the database.).

In the db you should see the following:
![orders-db](assets/01-img1.png)


### Bidirectional Relationships
#### Problem
In the above example, we have a unidirectional relationship where `OrderLine` knows about `Order`, but `Order` does not know about its `OrderLines`. This can be limiting in some cases, especially when you want to access all `OrderLines` from an `Order` entity.

#### Solution
To make the relationship bidirectional, we can add a `List<OrderLine>` field in the `Order` entity and use the `@OneToMany` annotation. This allows us to navigate from `Order` to its associated `OrderLines` in Java code.

```java
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate orderDate;
    @OneToMany(mappedBy = "order")
    private List<OrderLine> orderLines = new ArrayList<>();
    // Getters and Setters
}
```
Remember in a bidirectional JPA relationship, there are two sides:
- **The owning side** – the side that holds the foreign key (`@ManyToOne` in `OrderLine`).
- **The inverse side** – the side with mappedBy (`@OneToMany` in `Order`).

This means that `OrderLines` can be accessed from an `Order` instance like this:
```java
Order order = orderRepository.findById(1L).orElseThrow();
Set<OrderLine> lines = order.getOrderLines();
```

These lines produce the following SQL query:
```sql
SELECT o1_0.id,o1_0.order_date FROM orders o1_0 WHERE o1_0.id=?
```

No where is the `order_lines` table queried. Even though we define the variable `lines` on the second line, it does not trigger a database query until we access the `lines` variable. This is known as lazy loading. On the other hand if we were to access the `lines` variable, it would trigger a query to fetch the associated `OrderLines`:

```java
Set<OrderLine> lines = order.getOrderLines(); // This does not trigger a query yet
System.out.println(lines.size()); // This triggers a query to fetch the associated OrderLines
```

Which produces two SQL queries:
```sql
SELECT o1_0.id,o1_0.order_date FROM orders o1_0 WHERE o1_0.id=?
SELECT ol1_0.order_id,ol1_0.id,ol1_0.price,ol1_0.product_name FROM order_lines ol1_0 WHERE ol1_0.order_id=?
```

This is because the `orderLines` field is lazily loaded by default. If you want to eagerly load the `OrderLines` when fetching an `Order`, you can use the `fetch = FetchType.EAGER` attribute in the `@OneToMany` annotation (although not recommended for large datasets as it can lead to performance issues):

```java
@OneToMany(mappedBy = "order", fetch = FetchType.EAGER)
private Set<OrderLine> orderLines = new HashSet<>();
```

### Cascading operations from parent entity
When you have a bidirectional relationship, you can also use cascading operations to automatically persist or delete child entities when the parent entity is saved or deleted. For example, if you want to automatically save `OrderLines` when saving an `Order`, you can use the `cascade` attribute in the `@OneToMany` annotation:

```java
@OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
private Set<OrderLine> orderLines = new HashSet<>();
```
This means that when you save an `Order`, all associated `OrderLines` will also be saved automatically. Similarly, if you delete an `Order`, all associated `OrderLines` will also be deleted. So if we want to save an `Order` with its `OrderLines`, we can do the following:

```java
OrderLine line1 = new OrderLine();
line1.setProductName("Product 1");
line1.setPrice(10.99);

OrderLine line2 = new OrderLine();
line2.setProductName("Product 2");
line2.setPrice(20.49);

Order order = new Order();
order.setOrderDate(LocalDate.now());

// Sync both sides of the relationship
line1.setOrder(order);
line2.setOrder(order);
order.getOrderLines().add(line1);
order.getOrderLines().add(line2);

// This will also save line1 and line2 automatically
orderRepository.save(order);
```

- This will save the `Order` and its associated `OrderLines` in a single operation, thanks to the cascading effect.
- Note that we need to sync both sides of the relationship by setting the `Order` in each `OrderLine` and adding the `OrderLines` to the `Order`. This ensures that both sides of the relationship are aware of each other.

### Creating a utility method for syncing relationships
To avoid repeating the code for syncing both sides of the relationship, we can create a utility method in the `Order` class to handle this (since it is the parent entity). This method will add an `OrderLine` to the `Order` and automatically set the `Order` in the `OrderLine`.

This is not strictly necessary, but it helps to keep the code clean and maintainable. Here’s how you can implement this:

```java
@Entity
@Table(name = "orders")
public class Order {
    // Other fields and methods...
    public void addOrderLine(OrderLine orderLine) {
        orderLine.setOrder(this); // Set the Order in the OrderLine
        this.orderLines.add(orderLine); // Add the OrderLine to the Order's collection
    }

    public void removeOrderLine(OrderLine orderLine) {
        orderLine.setOrder(null); // Remove the Order reference from the OrderLine
        this.orderLines.remove(orderLine); // Remove the OrderLine from the Order's collection
    }
}
```
```java
@Entity
@Table(name = "order_lines")
public class OrderLine {
    // Other fields and methods...
    public void setOrder(Order order) {
        this.order = order;
    }
}
```

Note that all operations on the `OrderLines` collection should be done through the `Order` class to ensure that both sides of the relationship are always in sync.
This way, you can add or remove `OrderLines` from an `Order` without having to manually set the `Order` in each `OrderLine`. For example:

#### Adding an `Order` with `OrderLines`
```java
Order order = new Order();
OrderLine line1 = new OrderLine();
order.addOrderLine(line1); // This automatically sets the Order in line1 and adds it
orderRepository.save(order); // This will save the Order and line1
```
#### Adding an `OrderLine` to an existing `Order`
```java
Order order = orderRepository.findById(1L).orElseThrow();
OrderLine line2 = new OrderLine();
order.addOrderLine(line2); // This automatically sets the Order in line2 and adds it
orderRepository.save(order); // This will save the Order and line2
```
#### Removing an `OrderLine` from an `Order`
```java
Order order = orderRepository.findById(1L).orElseThrow();
OrderLine line1 = order.getOrderLines().get(0); // Assuming that it is present
order.removeOrderLine(line1); // This automatically sets the Order in line1 to null and
orderRepository.save(order); // This will save the Order and remove line1
```

### When to use cascading operations
Cascading operations can be very useful in scenarios where you want to manage the lifecycle of child entities through the parent entity. For example, if you want to automatically persist or delete child entities when the parent entity is saved or deleted, cascading operations can simplify your code and reduce boilerplate.

#### When using cascading operations, ask yourself:
- Do I want to automatically persist or delete child entities when the parent entity is saved or deleted?
- Do I want to manage the lifecycle of child entities through the parent entity?
If the answer is yes, then cascading operations can be very useful. However, be cautious with cascading deletes, as they can lead to unintended data loss if not handled carefully.

### Summary
- We have learned how to model One-to-Many and Many-to-One relationships in Spring Data JPA.
- We started with a unidirectional Many-to-One relationship and then made it bidirectional by adding a `Set<OrderLine>` field in the `Order` entity.
- We explored the importance of keeping both sides of the relationship in sync and created utility methods to manage the relationship more easily.
- We also learned about cascading operations and how they can simplify the management of child entities through the parent entity.

## Exercises
1. **Create a new entity**: Create a new entity called `Course` with fields `id`, `name`, and `description`.
2. **Create a new entity**: Create a new entity called `CourseOffering` with fields `id`, `semester`, and `year`.
3. **Establish a relationship**: Establish a One-to-Many relationship between `Course` and `CourseOffering`, where a `Course` can have multiple `CourseOfferings`, but each `CourseOffering` belongs to only one `Course`.
4. **Create repositories**: Create repositories for both `Course` and `CourseOffering`.
5. **Initialize data**: Create a class that implements `CommandLineRunner` to initialize the database with some dummy data. Create a few `Course` entities and associate multiple `CourseOfferings` with each `Course`.

