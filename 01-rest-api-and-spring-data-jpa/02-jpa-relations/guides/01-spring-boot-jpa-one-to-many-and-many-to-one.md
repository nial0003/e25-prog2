# Spring Data JPA - One-to-Many and Many-to-One Relationships

## Introduction
In this guide, we will explore how to model One-to-Many and Many-to-One relationships in Spring Data JPA. We will cover the necessary annotations, how to set up the entities, and how to manage these relationships.

One-to-Many / Many-to-One relationships are common in database design, where one entity can be associated with multiple instances of another entity. For example, a `Order` can have multiple `OrderLines`, a `Course` can have multiple `CourseOfferings`, a `Student` can have multiple `Enrollments`, etc.

## Setup
- Create a Spring Boot project with Spring web and Spring Data JPA, H2 database and MySQL dependencies - name the project `one-to-many`
- Use the following configuration in `application.properties` to set up the H2 database:
```properties
# H2 Database Configuration
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

spring.jpa.hibernate.ddl-auto=create-drop

## Logging
spring.jpa.show-sql=true
logging.level.org.hibernate.SQL=DEBUG
logging.level.sql=DEBUG
```

## Simple example
Let's consider a simple example where we have a `OrderLine` entity and an `Order` entity. An `Order` can have multiple `OrderLines`, but each `OrderLine` belongs to only one `Order`.

In SQL this relationship can be represented as follows:
```sql
CREATE TABLE orders (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_date DATE
);

CREATE TABLE order_lines (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    productName VARCHAR(255) NOT NULL,
    price FLOAT(53) NOT NULL,
    order_id BIGINT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

We will model this relationship using JPA annotations, and begin with a unidirectional Many-to-One relationship (as this is the simplest form). The `OrderLine` entity will have a foreign key reference to the `Order` entity.

Create the following entities in the `org.example.onetomany.models` package:

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

In the above code:
- The `@ManyToOne` annotation indicates that many `OrderLine` entities can be associated with one `Order`. And that the `OrderLine` is the owning side of the relationship (eg. it contains the foreign key).
- The `@JoinColumn` annotation specifies the foreign key column in the `order_lines` table that references the `orders` table. **This is optional**. The only required annotation is `@ManyToOne`.
- The `nullable = false` attribute ensures that every `OrderLine` must be associated with an `Order`.
- The `@Table` annotation specifies the table name in the database, which is optional if the class name matches the table name. But in SQL databases the keyword `order` is reserved, so we use `orders` instead.



We create the repositories for both entities, in the `org.example.onetomany.repositories` package:
```java
public interface OrderLineRepository extends JpaRepository<OrderLine, Long> {
}
```
```java
public interface OrderRepository extends JpaRepository<Order, Long> {
}
```

### Using the Repositories
You can use these repositories to perform CRUD operations on the entities. For example, to save an `Order` with multiple `OrderLines`, you can do the following to the `org.example.onetomany.config` package:
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
Notice that:
- We first save the `Order` entity before saving the `OrderLine` entities. This is because the `OrderLine` needs to reference an existing `Order`.
- In addition, how does `line1.setOrder(order);` work? The `Order` entity becomes managed by the JPA context when we call `orderRepository.save(order);`. This means that the `Order` entity has an `Id` assigned to it, which is then used by the `OrderLine` entity when we call `line1.setOrder(order);`. (To see this at a print statement before and after the `save` call, you can use `System.out.println(order.getId());` to see the ID assigned by the database.).

In the db you should see the following:
![orders-db](assets/01-img1.png)

### Creating a REST Controller
To expose the `Order` and `OrderLine` entities via a REST API, we can create a controller in the `org.example.onetomany.controllers` package:

```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return ResponseEntity.ok(orders);
    }
}
```

By running the application, you can access the endpoint `http://localhost:8080/api/orders` to retrieve all orders:
```json
[
    {
        "id": 1,
        "orderDate": "2025-08-18"
    }
]
```

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
    private Set<OrderLine> orderLines = new HashSet<>();
    // Getters and Setters
}
```
In a bidirectional JPA relationship, there are two sides:
- **The owning side** – the side that holds the foreign key (the `OrderLine` entity, eg. the class that has `@ManyToOne`).
- **The inverse side** – the side with mappedBy (`@OneToMany` in `Order`). The `mappedBy` attribute tells JPA that the `OrderLine` entity owns the relationship 
(because it has the foreign key column). 

##### Testing the Rest API with Bidirectional Relationship
If we now test the application in the browser, cURL or Postman, we get a weird repsonse:
```json
[{"id":1,"orderDate":"2025-08-18","orderLines":[{"id":2,"productName":"Product 2","price":20.49,"order":{"id":1,"orderDate":"2025-08-18","orderLines":[{"id":2,"productName":"Product 2","price":20.49,"order":{"id":1,"orderDate":"2025-08-18","orderLines":[{"id":2,"productName":"Product 2","price":20.49,"order":{"id":1,"orderDate":"2025-08-18","orderLines":[{"id":2,"productName":"Product 2","price":20.49,"order":{"id":1,"orderDate":"2025-08-18","orderLines":[{"id":2,"productName":"Product 2","price":20.49,"order":{"id":1,"orderDate":"2025-08-18","orderLines":[{"id":2,"productName":"Product 2","price":20.49,"order":{"id":1,"orderDate":"2025-08-18","orderLines":[{"id":2,"productName":"Product 2","price":20.49,"order":{"id":1,"orderDate":"2025-08-18","orderLines
```
This is because we have a circular reference between `Order` and `OrderLine`. When the JSON serializer tries to serialize the `Order` entity, it encounters the `orderLines` field, which contains `OrderLine` entities that reference back to the `Order`, creating an infinite loop.

#### Solving Circular References
This is a common problem when dealing with bidirectional relationships in JPA. The JSON serializer tries to serialize the entire object graph, which leads to circular references.

We can solve this by using `@JsonBackReference` and `@JsonManagedReference` annotations from the Jackson library, which is used by Spring Boot for JSON serialization.

```java
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate orderDate;

    @OneToMany(mappedBy = "order")
    @JsonManagedReference // This indicates that this is the parent side of the relationship
    private Set<OrderLine> orderLines = new HashSet<>();
    // Getters and Setters
}
```


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
    @JsonBackReference
    private Order order;
    // Getters and Setters
}
```

Now if we run the application and access the endpoint `http://localhost:8080/api/orders`, we will get a response without circular references:
```json
[
    {
        "id": 1,
        "orderDate": "2025-08-18",
        "orderLines": [
            {
                "id": 2,
                "productName": "Product 2",
                "price": 20.49
            },
            {
                "id": 1,
                "productName": "Product 1",
                "price": 10.99
            }
        ]
    }
]
```

Notice that this produces the following SQL query:
```sql
SELECT ol1_0.order_id,ol1_0.id,ol1_0.price,ol1_0.product_name FROM order_lines ol1_0 WHERE ol1_0.order_id=?
SELECT ol1_0.order_id,ol1_0.id,ol1_0.price,ol1_0.product_name FROM order_lines ol1_0 WHERE ol1_0.order_id=?
```

This is because the `orderLines` field is **lazily** loaded by default. If you want to eagerly load the `OrderLines` when fetching an `Order`, you can use the `fetch = FetchType.EAGER` attribute in the `@OneToMany` annotation (although not recommended for large datasets as it can lead to performance issues):

```java
@OneToMany(mappedBy = "order", fetch = FetchType.EAGER)
private Set<OrderLine> orderLines = new HashSet<>();
```

It is also possible to use DTOs to control the data being sent to the client and avoid circular references. We will explore that later.

### Cascading operations from parent entity
When you have a bidirectional relationship, you can also use cascading operations to automatically persist or delete associations with child entities when the parent entity is saved, updated or deleted. For example, if you want to automatically save `OrderLines` when saving an `Order`, you can use the `cascade` attribute in the `@OneToMany` annotation:

```java
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // This indicates that this is the parent side of the relationship
    private Set<OrderLine> orderLines = new HashSet<>();
```
- With `cascade = CascadeType.ALL` only: when you delete an `Order`, the associated 
  `OrderLine`s will remain in the database (their `order_id` may be set to `null`).
- With `cascade = CascadeType.ALL, orphanRemoval = true`: when you delete an `Order` 
  or remove an `OrderLine` from its collection, the `OrderLine` will be physically 
  deleted from the database.

This means that we can change the `InitData` class to add `OrderLines` to an `Order` without having to save each `OrderLine` individually. For example:

```java
public void run(String... args) {
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
}
```
- This will save the `Order` and its associated `OrderLines` in a single operation, thanks to the cascading effect.
- Note that we need to sync both sides of the relationship by setting the `Order` in each `OrderLine` and adding the `OrderLines` to the `Order`. This ensures that both sides of the relationship are aware of each other.

### Keeping both sides of the relationship in sync
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

Note that all operations on the `OrderLines` collection should be done through the `Order` class to ensure that both sides of the relationship are always in sync. This way, you can add or remove `OrderLines` from an `Order` without having to manually set the `Order` in each `OrderLine`.

We can then update the `InitData` class to use these utility methods:

```java
public void run(String... args) {
    OrderLine line1 = new OrderLine();
    line1.setProductName("Product 1");
    line1.setPrice(10.99);

    OrderLine line2 = new OrderLine();
    line2.setProductName("Product 2");
    line2.setPrice(20.49);

    Order order = new Order();
    order.setOrderDate(LocalDate.now());

    // Sync both sides of the relationship
    order.addOrderLine(line1); // This automatically sets the Order in line1 and adds it
    order.addOrderLine(line2); // This automatically sets the Order in line2 and adds

    // This will also save line1 and line2 automatically
    orderRepository.save(order);
}
```

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
#### Removing a single `OrderLine` from an `Order`
```java
Order order = orderRepository.findById(1L).orElseThrow();
OrderLine line1 = order.getOrderLines().iterator().next(); // Assuming that it is present
order.removeOrderLine(line1); // This automatically sets the Order in line1 to null and
orderRepository.save(order); // This will save the Order and remove line1 foreign key reference
```

### When to use cascading operations
Cascading operations can be very useful in scenarios where you want to manage the lifecycle of child entities through the parent entity. For example, if you want to automatically persist or delete child entities when the parent entity is saved or deleted, cascading operations can simplify your code and reduce boilerplate.

#### When using cascading operations, ask yourself:
- Do I want to automatically persist or delete child entities when the parent entity is saved or deleted?
- Do I want to manage the lifecycle of child entities through the parent entity?
If the answer is yes, then cascading operations can be very useful. However, be cautious with cascading deletes, as they can lead to unintended data loss if not handled carefully.


## API and service layer
At the moment, we have a simple REST API that allows us to retrieve all `Order` entities and their associated `OrderLines`. However, we need to create a more structured service layer to handle the business logic and manage the relationships between `Order` and `OrderLine` entities.

First, we create a **service layer** to handle the business logic for managing `Order` and `OrderLine` entities. This service will use the repositories to perform CRUD operations and manage relationships.

Create the following service class in the `org.example.onetomany.services` package:

```java
@Service
public class OrderService {
    private final OrderRepository orderRepository;

    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        if (orderOptional.isPresent()) {
            return orderOptional.get();
        }
        throw new RuntimeException("Order not found with id: " + id);
    }

    public Order createOrder(Order order) {
        for (var orderLines : order.getOrderLines()) {
            orderLines.setId(null); // Make sure to set ID to null for new OrderLines
        }
        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        if (orderOptional.isPresent()) {
            orderRepository.delete(orderOptional.get());
        }
        throw new RuntimeException("Order not found with id: " + id);
    }

    public Order updateOrder(Long id, Order order) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        if (orderOptional.isPresent()) {
            Order existingOrder = orderOptional.get();
            existingOrder.setOrderDate(order.getOrderDate());
            existingOrder.getOrderLines().clear(); // Clear existing OrderLines
            for (var orderLine : order.getOrderLines()) {
                orderLine.setId(null); // Make sure to set ID to null for new OrderLines
                existingOrder.addOrderLine(orderLine); // Add new OrderLines
            }
            return orderRepository.save(existingOrder);
        }
        throw new RuntimeException("Order not found with id: " + id);
    }
}
```

Notice that:
- The `OrderService` class uses the `OrderRepository` to perform CRUD operations on `Order` entities.
- The `createOrder` method ensures that the `OrderLine` entities are not detached (see below) by setting their IDs to `null` before saving. This prevents the `PersistentObjectException` when trying to persist detached entities.
- The `updateOrder` method clears the existing `OrderLines` and adds new ones to ensure that the relationship is properly managed.
- The `deleteOrder` method checks if the `Order` exists before deleting it, throwing an exception if it does not.

The Controller class will handle the HTTP requests and responses only. Instead of injecting the `OrderRepository`, it will use the `OrderService` to perform the necessary operations.

```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.createOrder(order));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order order) {
        return ResponseEntity.ok(orderService.updateOrder(id, order));
    }
}
```

This controller provides endpoints to:
- Get all orders (`GET /api/orders`)
- Get an order by ID (`GET /api/orders/{id}`)
- Create a new order (`POST /api/orders`)
- Delete an order by ID (`DELETE /api/orders/{id}`)
- Update an order by ID (`PUT /api/orders/{id}`)


### Detached entities
In JPA, the `save()` method works like this:
- If the ID is `null` → it performs an **insert**.
- If the ID is not `null` and the entity is managed → it performs an **update**.
- If the ID is not `null` but the entity is detached (not in the persistence context) → 
  you get a `PersistentObjectException: detached entity passed to persist`.

In our example, if we try to call `orderService.createOrder(Order order)` and the `OrderLines` already have an ID set, we could get the following exception:
```bash
org.hibernate.PersistentObjectException: detached entity passed to persist: org.example.onetomany.models.OrderLine
```
This means that the `OrderLine` entities already have an ID assigned, and when we try to persist them again, we get an exception.

To avoid this, we should ensure that when creating a new `Order` with `OrderLines`, we do not set the ID on the `OrderLine` entities. This can be done by setting the ID to `null` before saving the `Order`, as done above in the `createOrder` method.

**How to avoid this exception:**
- Only pass managed or new (transient) entities to save(), not detached ones (entities that have an ID set).
- Be cautious with entities pulled from previous sessions/transactions or external sources like DTOs, make sure they are not already persisted in the database.

### Summary
- We have learned how to model One-to-Many and Many-to-One relationships in Spring Data JPA.
- We started with a unidirectional Many-to-One relationship and then made it bidirectional by adding a `Set<OrderLine>` field in the `Order` entity.
- We explored the importance of keeping both sides of the relationship in sync and created utility methods to manage the relationship more easily.
- We have also created a REST API to manage `Order` and `OrderLine` entities using a service layer and `@JsonBackReference` and `@JsonManagedReference` annotations to avoid recursive serialization issues.
- We discussed cascading operations and how to use them to automatically persist or delete child entities when the parent entity is saved or deleted.
- Finally, we learned about detached entities and how to avoid exceptions when trying to persist them.