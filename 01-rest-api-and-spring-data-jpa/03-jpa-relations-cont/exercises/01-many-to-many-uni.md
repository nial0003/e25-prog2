# Spring Data JPA: Adding Many-to-Many Relationships

## Goal:

Add a many-to-many relationship between the `Product` and `Category` entities.

## Step 1: Setup

Make sure to use the forked repo from last week `https://github.com/ek-osnb/spring-jpa-relations`.

Make sure you have the OneToMany and ManyToOne relationships set up correctly in your entities.

## Step 2: Create entities

Create the `Product` and `Category`. The `Product` entity should look like:

```java
@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private double price;

    // Constructors, Getters and Setters
}
```

Add the `Category` entity as follows:

```java
@Entity
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;


    // Constructors, Getters and Setters
}
```

## Step 3: Adding unidirectional mapping

Inside the `Product` class add a `ManyToMany`relation to `category`.

```java
@Entity
public class Product {
    // Other fields

    @ManyToMany
    private Set<Category> categories = new HashSet<>();

    // Constructors, Getters and Setters
}
```

This makes the relationship between `Product` and `Category` unidirectional, meaning that only the `Product` entity is aware of the relationship.

## Step 3: Create Repositories

Create the `ProductRepository` and `CategoryRepository` interfaces as follows:

```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
```

## Step 4: Create a service layer
Create the service layer for `Product` and `Category` classes as follows:

```java
@Service
public class ProductService {
    private ProductRepository productRepository;
    private CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Product findById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isEmpty()) {
            throw new RuntimeException("Product not found");
        }
        return product.get();
    }

    public Product createProduct(Product product) {
        product.setId(null);
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product product) {
        Product existingProduct = findById(id);
        existingProduct.setName(product.getName());
        existingProduct.setPrice(product.getPrice());
        
        // Get category ids
        List<Long> categoryIds = new ArrayList<>();
        for (Category category : product.getCategories()) {
            categoryIds.add(category.getId());
        }

        // Find existing categories
        Set<Category> newCategories = new HashSet<>(categoryRepository.findAllById(categoryIds));

        // Update the categories
        existingProduct.getCategories().clear();
        existingProduct.getCategories().addAll(newCategories);

        return productRepository.save(existingProduct);
    }

    public void deleteById(Long id) {
        productRepository.deleteById(id);
    }
}

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public Category findById(Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        if (category.isEmpty()) {
            throw new RuntimeException("Category not found");
        }
        return category.get();
    }

    public Category createCategory(Category category) {
        category.setId(null);
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category category) {
        Category existingCategory = findById(id);
        if (category.getName() != null) {
            existingCategory.setName(category.getName());
        }
        return categoryRepository.save(existingCategory);
    }

    public void deleteById(Long id) {
        categoryRepository.deleteById(id);
    }
}
```

## Step 5: Add some sample data

Inside the `InitData`, try adding some sample products and categories.

Notice that we want to save the categories first before associating them with products, this is because the `Product` entity needs to reference existing `Category` entities.

```java
public void run(String... args) throws Exception {
    Category electronics = new Category();
    electronics.setName("Electronics");

    Category books = new Category();
    books.setName("Books");

    // save the categories
    categoryRepository.saveAll(List.of(electronics, books));

    Product novel = new Product();
    novel.setName("Novel");
    novel.setPrice(120);

    Product phone = new Product();
    phone.setName("Smartphone");
    phone.setPrice(1400);

    novel.getCategories().add(books);
    phone.getCategories().add(electronics);

    // save the products
    productRepository.saveAll(List.of(novel, phone));
}
```

## Step 5: Create Controllers

Add a new Controller: `api/products`

```java
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> findAll() {
        return ResponseEntity.ok(productService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        Product product = productService.findById(id);
        try {
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Product> save(@RequestBody Product product) {
        Product savedProduct = productService.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        productService.deleteById(id);
    }
}
```

**Try to run the application**

## Step 6: Testing the endpoints

Test all the endpoints using Postman.


## Step 7 (optional): Add a category controller

Add a category controller for all CRUD operations.

