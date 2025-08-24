# Design patterns: Ports and Adapters

Ports and Adapters, also known as Hexagonal Architecture, is a design pattern that aims to create a clear separation between the core logic of an application and the external systems it interacts with. This is achieved by defining "ports" (interfaces) that the core logic uses to communicate with the outside world, and "adapters" that implement these interfaces to interact with specific external systems (e.g., databases, APIs).

## Key Concepts

1. **Ports**: Interfaces that define the expected behavior of the application. They represent the entry points for external interactions.

2. **Adapters**: Implementations of the ports that connect the core logic to external systems. Adapters can be inbound (driving) or outbound (driven).

3. **Core Logic**: The central part of the application that contains the business rules and logic. It should be independent of external systems.

## Benefits

- **Separation of Concerns**: By isolating the core logic from external systems, you can change or replace adapters without affecting the core logic.

- **Testability**: The core logic can be easily tested in isolation by mocking the ports.

- **Flexibility**: New adapters can be added to support additional external systems without modifying the core logic.

## Example

Consider a simple application that interacts with a user database and an external payment API. The application could define the following ports:

- `UserRepository`: An interface for user data access.
- `PaymentService`: An interface for payment processing.

The application would then implement adapters for each port:

- `JpaUserRepository`: An adapter that uses JPA to access the user database.
- `StripePaymentService`: An adapter that uses the Stripe API for payment processing.

This way, the core logic can interact with the ports without knowing about the specific implementations, allowing for easy changes and testing.
