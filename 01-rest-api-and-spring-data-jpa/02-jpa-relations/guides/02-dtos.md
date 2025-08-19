# DTOs (Data Transfer Objects)

## What are DTOs?
DTOs, or Data Transfer Objects, are plain Java objects used to transfer data between different layers of an application, especially between the service layer and the presentation layer.
They help to:
- Avoid circular references when serializing bidirectional JPA relationships.
- Prevent exposing unnecessary or sensitive fields to the client.
- Provide a clean, API-focused data model that can evolve independently of the database schema.

## Problem
When working with Spring Data JPA and bidirectional relationships such as Order ↔ OrderLine, you can run into circular reference issues.
For example:
- Order has a collection of OrderLines
- Each OrderLine points back to its Order

If you try to serialize this directly to JSON, you’ll get infinite recursion.

Also, entities often have more data than we want to expose in API responses. For example, maybe Order has internal fields like customerId or status that you don’t want the client to see.

## What is a Java `record`?
A record in Java is a special kind of class that is used to create immutable data objects.
Records are immutable data carriers — once created, their fields cannot be reassigned.
Records automatically generate boilerplate code like getters, equals, hashCode, and toString methods, making them ideal for DTOs.
They are defined using the `record` keyword.
For example:
```java
public record SimpleRecord(Long id, String name) {}
```
This creates a record with two fields: `id` and `name`. You can create an instance of this record like this:
```java
SimpleRecord record = new SimpleRecord(1L, "Example");
```
We can access the fields using the automatically generated getters:
```java
Long id = record.id(); // 1L
String name = record.name(); // "Example"
```
Notice how we can access the fields using the method names that match the field names.


## DTO Solution
Instead of using `@JsonManagedReference` or `@JsonBackReference` to handle circular references, we can create DTOs that represent only the data we want to expose in our API. We will create DTOs by using Java `records` that represent the data we want to expose in our API.

First remove the `@JsonManagedReference` and `@JsonBackReference` annotations from the `Order` and `OrderLine` entities. This will prevent Jackson from trying to serialize the circular references.

Create the following DTOs in the `org.example.onetomany.dtos` package:

```java
public record OrderDto (
    Long id,
    LocalDate orderDate,
    Set<OrderLineDto> orderLines
) {}
```

```java
public record OrderLineDto (
    Long id,
    String productName,
    double price
) {}
```

Now, when we fetch an `Order` entity, we can convert it to a `OrderDto` before returning it in the API response. This way, we avoid circular references and control the data being sent to the client. 

Create a new mapper class in the package `org.example.onetomany.mappers` to handle the conversion between entities and DTOs:

```java
public class OrderMapper {

    public static OrderLineDto toOrderLineDto(OrderLine orderLine) {
        return new OrderLineDto(
                orderLine.getId(),
                orderLine.getProductName(),
                orderLine.getPrice()
        );
    }

    public static OrderDto toOrderDto(Order order) {
        Set<OrderLine> orderLines = order.getOrderLines();
        Set<OrderLineDto> orderLineDtos = new HashSet<>();
        for (var orderLine : orderLines) {
            orderLineDtos.add(toOrderLineDto(orderLine));
        }
        return new OrderDto(
                order.getId(),
                order.getOrderDate(),
                orderLineDtos
        );
    }

    public static OrderLine toOrderLineEntity(OrderLineDto orderLineDto) {
        OrderLine orderLine = new OrderLine();
        orderLine.setId(orderLineDto.id());
        orderLine.setProductName(orderLineDto.productName());
        orderLine.setPrice(orderLineDto.price());
        return orderLine;
    }

    public static Order toOrderEntity(OrderDto orderDto) {
        Order order = new Order();
        order.setId(orderDto.id());
        order.setOrderDate(orderDto.orderDate());
        for (OrderLineDto orderLineDto : orderDto.orderLines()) {
            order.addOrderLine(toOrderLineEntity(orderLineDto));
        }
        return order;
    }
}
```

We will refactor the service layer to use these DTOs instead of the entity classes directly. This keeps our service layer clean and focused on business logic, while the DTOs handle the data transfer concerns.

```java
@Service
public class OrderService {
    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // FIND
    public List<OrderDto> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<OrderDto> orderDtos = new ArrayList<>();
        for (Order order : orders) {
            orderDtos.add(OrderMapper.toOrderDto(order));
        }
        return orderDtos;
    }

    // FIND by ID
    public OrderDto getOrderById(Long id) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        if (orderOptional.isPresent()) {
            return OrderMapper.toOrderDto(orderOptional.get());
        }
        throw new RuntimeException("Order not found with id: " + id);
    }

    // CREATE
    public OrderDto createOrder(OrderDto orderDto) {
        Order newOrder = OrderMapper.toOrderEntity(orderDto);
        for (var orderLine : newOrder.getOrderLines()) {
            orderLine.setId(null); // Make sure to set ID to null for new OrderLines
        }
        return OrderMapper.toOrderDto(orderRepository.save(newOrder));
    }

    // DELETE
    public void deleteOrder(Long id) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        if (orderOptional.isPresent()) {
            orderRepository.delete(orderOptional.get());
        }
        throw new RuntimeException("Order not found with id: " + id);
    }

    public OrderDto updateOrder(Long id, OrderDto orderDto) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        if (orderOptional.isPresent()) {
            Order existingOrder = orderOptional.get();
            existingOrder.setOrderDate(orderDto.orderDate());
            existingOrder.getOrderLines().clear(); // Clear existing OrderLines
            for (var orderLine : orderDto.orderLines()) {
                OrderLine newOrderLine = OrderMapper.toOrderLineEntity(orderLine);
                newOrderLine.setId(null); // Make sure to set ID to null for new OrderLines
                existingOrder.addOrderLine(newOrderLine); // Add new OrderLines
            }
            return OrderMapper.toOrderDto(orderRepository.save(existingOrder));
        }
        throw new RuntimeException("Order not found with id: " + id);
    }
}
```

We then need to update the controller to use the `OrderDto` instead of the `Order` entity directly. This keeps our API responses clean and focused on the data we want to expose.

```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@RequestBody OrderDto orderDto) {
        return ResponseEntity.ok(orderService.createOrder(orderDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDto> updateOrder(@PathVariable Long id, @RequestBody OrderDto orderDto) {
        return ResponseEntity.ok(orderService.updateOrder(id, orderDto));
    }
}
```
This way, the controller layer is clean and only deals with DTOs, while the service layer handles the conversion between entities and DTOs.

This approach allows us to keep our entities clean and focused on the database representation, while DTOs handle the data transfer concerns. It also makes it easier to change the API response structure without affecting the underlying entity model.

Furthermore it solves the problem of circular references.


## Summary
- **DTOs** are used to transfer data between layers, avoiding circular references and sensitive data exposure.
- **Service Layer** can talk directly with entities, but only return DTOs.
