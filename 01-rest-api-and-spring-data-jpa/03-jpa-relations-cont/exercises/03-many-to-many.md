# Connecting Products with Orderlines (DRAFT)

## Goal:

The goal is to let each `OrderLine` reference a `Product`. The `OrderLine` entity should have a many-to-one relationship with the `Product` entity. The relationship should be unidirectional, meaning that only the `OrderLine` will hold a reference to the `Product`, not the other way around.

# Step 1: Replacing attributes in the `OrderLine` entity

The `OrderLine` entity currently has `product` and `unitPrice` attributes. These should be removed and replaced with a reference to the `Product` entity.

```java
@Entity
public class OrderLine extends BaseEntity {

    @ManyToOne
    private Product product;
    private int quantity;

    // Constructors, Getters and Setters

}
```

## Step 2: Update rest of application (DRAFT)

Update `OrderService` and `OrderController` to use the new `OrderLine` structure.

Update `InitData` to reflect the changes in the `OrderLine` entity.