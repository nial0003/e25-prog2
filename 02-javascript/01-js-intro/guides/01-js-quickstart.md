# JavaScript Quickstart Guide for Java Developers

This guide is designed to help Java developers quickly get up to speed with JavaScript by highlighting key differences and similarities between the two languages.

## JavaScript Basics

### Variables
In JavaScript, you can declare variables using `var`, `let`, or `const`.
- `var` is function-scoped and can be redeclared.
- `let` is block-scoped and cannot be redeclared within the same scope.
- `const` is also block-scoped and is used for variables that should not be reassigned.

```javascript
let name = "John"; // Block-scoped variable
const age = 30; // Constant variable
var city = "New York"; // Function-scoped variable
```

### Data Types
JavaScript has several data types.

#### Primitive Data Types
- **String**: e.g., `"Hello"`
- **Number**: e.g., `42`, `3.14`
- **Boolean**: e.g., `true`, `false`
- **Undefined**: A variable that has been declared but not assigned a value.
- **Null**: Represents the intentional absence of any object value.

```javascript
let message = "Hello, World!"; // String
let count = 100; // Number
let isAvailable = false; // Boolean
let notDefined; // Undefined
let emptyValue = null; // Null
```

#### String Methods
JavaScript strings come with a variety of built-in methods for manipulating and inspecting string values.
```javascript
let str = "Hello, World!";
console.log(str.length); // Output: 13
console.log(str.toUpperCase()); // Output: "HELLO, WORLD!"
console.log(str.toLowerCase()); // Output: "hello, world!"
console.log(str.indexOf("World")); // Output: 7
console.log(str.slice(0, 5)); // Output: "Hello"
console.log(str.replace("World", "JavaScript")); // Output: "Hello, JavaScript
console.log(str.split(", ")); // Output: ["Hello", "World!"]
```


#### Reference Data Types
- **Object**: A collection of properties and methods, e.g., `{ name: "Alice", age: 30 }`
- **Array**: An ordered list of values, e.g., `[1, 2, 3]`
```javascript
let person = { name: "Alice", age: 30 }; // Object
let numbers = [1, 2, 3, 4, 5]; // Array
```

### Equality Operators
JavaScript has two types of equality operators:
- `==` (loose equality): Compares values after type coercion.
- `===` (strict equality): Compares both value and type without coercion.
```javascript
console.log(5 == '5'); // true (loose equality)
console.log(5 === '5'); // false (strict equality)
```

### Functions
Functions in JavaScript can be declared in several ways.
#### Function Declaration
```javascript
function greet(name) {
    return "Hello, " + name + "!";
}
console.log(greet("Alice")); // Output: Hello, Alice!
```
#### Function Expression
```javascript
const greet = function(name) {
    return "Hello, " + name + "!";
};
console.log(greet("Bob")); // Output: Hello, Bob!
```
#### Arrow Function
```javascript
const greet = (name) => "Hello, " + name + "!";
console.log(greet("Charlie")); // Output: Hello, Charlie
```

#### Functions as First-Class Citizens
Functions in JavaScript can be assigned to variables, passed as arguments to other functions, and returned from other functions.
```javascript
function sayHello() {
    return "Hello!";
}
function executeFunction(func) {
    console.log(func());
}
executeFunction(sayHello); // Output: Hello!
```

#### Hoisting
In JavaScript, function declarations are hoisted, meaning they can be called before they are defined. Function expressions and arrow functions are not hoisted.
```javascript
console.log(add(5, 10)); // Output: 15
function add(a, b) {
    return a + b;
}
// console.log(subtract(10, 5)); // Error: subtract is not defined
const subtract = function(a, b) {
    return a - b;
};
```

### Control flow
- Conditionals: `if`, `else if`, `else`, `switch`
- Loops: `for`, `while`, `do...while`, `for...in`, `for...of`
- Exception handling: `try`, `catch`, `finally`, `throw`
```javascript
// Conditionals
let number = 10;
if (number > 0) {
    console.log("Positive number");
} else if (number < 0) {
    console.log("Negative number");
} else {
    console.log("Zero");
}

// Switch statement
switch (number) {
    case 1:
        console.log("One");
        break;
    case 10:
        console.log("Ten");
        break;
    default:
        console.log("Other number");
}

// Loops
for (let i = 0; i < 5; i++) {
    console.log(i);
}

let i = 0;
while (i < 5) {
    console.log(i);
    i++;
}

// For.. in loop (for objects)
let obj = { a: 1, b: 2, c: 3 };
for (let key in obj) {
    console.log(key + ": " + obj[key]);
}

// For.. of loop (for arrays)
let arr = [10, 20, 30];
for (let value of arr) {
    console.log(value);
}

// Exception handling
try {
    throw new Error("An error occurred");
} catch (e) {
    console.log(e.message);
} finally {
    console.log("Execution completed");
}
```

### Closures
A closure is a function that retains access to its lexical scope (the scope in which it was defined), even when the function is executed outside that scope. Closures are often used to create private variables or functions.
```javascript
function outerFunction() {
    let count = 0; // Private variable
    return function innerFunction() {
        count++;
        return count;
    };
}
const counter = outerFunction();
console.log(counter()); // Output: 1
console.log(counter()); // Output: 2
console.log(counter()); // Output: 3
```

### Scope
JavaScript has function scope and block scope. Variables declared with `var` are function-scoped, while those declared with `let` and `const` are block-scoped. This means that variables declared with `let` or `const` are only accessible within the block they are defined in, such as within an `if` statement or a loop.
```javascript
if (true) {
    let blockScoped = "I am block scoped";
    var functionScoped = "I am function scoped";
}
console.log(functionScoped); // Output: I am function scoped
// console.log(blockScoped); // Error: blockScoped is not defined
```

**Prefer `let` and `const` over `var` to avoid scope-related bugs and improve code readability.**

### Operators
JavaScript includes a variety of operators for performing operations on variables and values. Some common operators include
- **Arithmetic Operators**: `+`, `-`, `*`, `/`, `%` (modulus)
- **Assignment Operators**: `=`, `+=`, `-=`, `*=`, `/=`
- **Comparison Operators**: `==`, `===`, `!=`, `!==`, `<`, `>`, `<=`, `>=`

#### Logical Operators
- **Logical AND (`&&`)**: Returns true if both operands are true.
- **Logical OR (`||`)**: Returns true if at least one operand is true.
- **Logical NOT (`!`)**: Returns true if the operand is false.
```javascript
let a = true;
let b = false;
console.log(a && b); // false
console.log(a || b); // true
console.log(!a); // false
```

### Objects
Objects in JavaScript are collections of key-value pairs, similar to Java's HashMap or custom classes. 
```javascript
let person = {
    name: "Alice",
    age: 30,
    greet: function() {
        return "Hello, " + this.name;
    }
};
console.log(person.greet()); // Output: Hello, Alice
console.log(person.age); // Output: 30
person.age = 31; // Update property
console.log(person.age); // Output: 31
person.city = "New York"; // Add new property
console.log(person.city); // Output: New York
delete person.city; // Remove property
console.log(person.city); // Output: undefined
```

### Arrays
Arrays are ordered lists of values (that can be of any type), similar to Java's ArrayList.
```javascript
let fruits = ["Apple", "Banana", "Cherry"];
console.log(fruits.length); // Output: 3
console.log(fruits[1]); // Output: Banana
fruits.push("Date"); // Add to end
console.log(fruits); // Output: ["Apple", "Banana", "Cherry", "Date"]
fruits.pop(); // Remove from end
console.log(fruits); // Output: ["Apple", "Banana", "Cherry"]
fruits.shift(); // Remove from start
console.log(fruits); // Output: ["Banana", "Cherry"]
fruits.unshift("Mango"); // Add to start
console.log(fruits); // Output: ["Mango", "Banana", "Cherry"]
```

#### Array methods
JavaScript arrays come with a variety of built-in methods for manipulating and iterating over array elements.
```javascript
let numbers = [1, 2, 3, 4, 5];
// forEach
numbers.forEach(num => console.log(num)); // Logs each number
// map
let doubled = numbers.map(num => num * 2);
console.log(doubled); // Output: [2, 4, 6, 8, 10]
// filter
let evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // Output: [2, 4]
// reduce (acc is updated with each iteration)
let sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum); // Output: 15
```

### Destructuring
Destructuring is a convenient way of extracting values from arrays or properties from objects into distinct variables
```javascript
// Array Destructuring
let [first, second] = [1, 2, 3];
console.log(first); // Output: 1
console.log(second); // Output: 2
// Object Destructuring
let { name, isStudent } = { name: "Alice", age: 30, isStudent: false };
console.log(name); // Output: Alice
console.log(isStudent); // Output: false
```

### Template Literals
Template literals are a way to embed expressions within string literals, using backticks (`` ` ``) instead of single or double quotes. They allow for multi-line strings and string interpolation.
```javascript
let name = "Alice";
let age = 30;
let greeting = `Hello, my name is ${name} and I am ${age} years old.`;
console.log(greeting); // Output: Hello, my name is Alice and I am 30 years old.
let multiLine = `This is a string
                that spans multiple
                lines.`;
console.log(multiLine);
```

### Console
JavaScript provides a built-in `console` object for logging information to the browser's console, similar to Java's `System.out.println()`.
```javascript
console.log("Hello, World!"); // Standard log
console.error("This is an error message"); // Error message
console.warn("This is a warning message"); // Warning message
console.info("This is an informational message"); // Informational message
console.debug("This is a debug message"); // Debug message
```

