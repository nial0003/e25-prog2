# JavaScript for the Java Developer

## JavaScript fundamentals

### Variables and Data Types

In JavaScript, variables are used to store data values. You can declare a variable using `var`, `let`, or `const`. The most common data types in JavaScript include:
- **String**: Represents text, e.g., `"Hello, World!"`
- **Number**: Represents both integer and floating-point numbers, e.g., `42`, `3.14`
- **Boolean**: Represents logical values, either `true` or `false`
- **Object**: Represents a collection of properties, e.g., `{ name: "Alice", age: 30 }`
- **Array**: Represents a list of values, e.g., `[1, 2, 3, 4, 5]`
- **Undefined**: A variable that has been declared but not assigned a value
- **Null**: Represents the intentional absence of any object value

### Example of Variable Declaration and Data Types

```javascript
let name = "Alice"; // String
const age = 30; // Number
let isStudent = false; // Boolean
let person = { name: "Alice", age: 30 }; // Object
let numbers = [1, 2, 3, 4, 5]; // Array
let undefinedVar; // Undefined
let nullVar = null; // Null
```

Variables are dynamically typed in JavaScript (unlike Java that is statically typed), meaning you can change the type of data a variable holds at any time.

```javascript
let data = "Hello"; // Initially a String
data = 42; // Now a Number
data = true; // Now a Boolean
```

## Function Declarations and Expressions
Functions in JavaScript can be declared in two main ways: function declarations and function expressions.
### Function Declaration
A function declaration defines a named function that can be called anywhere in the scope it is defined.
```javascript
function greet(name) {
    return "Hello, " + name + "!";
}
console.log(greet("Alice")); // Output: Hello, Alice!
```
### Function Expression
A function expression defines a function as part of a variable assignment. Function expressions can be anonymous or named.
```javascript
const greet = function(name) {
    return "Hello, " + name + "!";
};
console.log(greet("Bob")); // Output: Hello, Bob!
```
### Arrow Functions
Arrow functions provide a shorter syntax for writing function expressions and do not have their own `this`
```javascript
const greet = (name) => "Hello, " + name + "!";
console.log(greet("Charlie")); // Output: Hello, Charlie!
```

### Differences Between Function Declarations and Expressions
1. **Hoisting**: Function declarations are hoisted, meaning they can be called before they are defined in the code. Function expressions are not hoisted, so they cannot be called before they are defined.
2. **`this` Context**: Arrow functions do not have their own `this` context, while regular functions do. This can affect how `this` behaves inside the function.
3. **Syntax**: Function expressions can be anonymous and are often used as callbacks or immediately invoked function expressions (IIFEs).

### Example of Function Declaration vs. Function Expression
```javascript
// Function Declaration
console.log(declaredFunction("Alice")); // Works because of hoisting
function declaredFunction(name) {
    return "Hello, " + name + "!";
}
// Function Expression
// console.log(expressFunction("Bob")); // Error: expressFunction is not defined
const expressFunction = function(name) {
    return "Hello, " + name + "!";
};
console.log(expressFunction("Bob")); // Works after definition
```

### Functions as First-Class Citizens
In JavaScript, functions are first-class citizens, meaning they can be treated like any other variable. They can be passed as arguments to other functions, returned from functions, and assigned to variables.
```javascript
function sayHello() {
    return "Hello!";
}
function executeFunction(func) {
    console.log(func());
}
executeFunction(sayHello); // Output: Hello!
```

### Equality Operators
JavaScript has two types of equality operators: `==` (loose equality) and `===` (strict equality).
- **Loose Equality (`==`)**: Compares two values for equality after converting both values to a common type (type coercion).
- **Strict Equality (`===`)**: Compares both value and type without performing type conversion.

### Example of Equality Operators
```javascript
console.log(5 == '5'); // true (loose equality, type coercion)
console.log(5 === '5'); // false (strict equality, different types)
console.log(null == undefined); // true (loose equality)
console.log(null === undefined); // false (strict equality)
```

### Closures
A closure is a function that retains access to its lexical scope, even when the function is executed outside that scope. Closures are often used to create private variables or functions.
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

Note that `var` is function-scoped, while `let` and `const` are block-scoped. This means that variables declared with `let` or `const` are only accessible within the block they are defined in, such as within an `if` statement or a loop.

```javascript
if (true) {
    let blockScoped = "I am block scoped";
    console.log(blockScoped); // Works
}
console.log(blockScoped); // Error: blockScoped is not defined

if (true) {
    var functionScoped = "I am function scoped";
    console.log(functionScoped); // Works
}
console.log(functionScoped); // Works, because var is function-scoped
```

**Moral of the story**: Prefer `let` and `const` over `var` to avoid scope-related bugs and improve code readability.

### Operators
JavaScript includes a variety of operators for performing operations on variables and values. Some common operators include
- **Arithmetic Operators**: `+`, `-`, `*`, `/`, `%` (modulus)
- **Assignment Operators**: `=`, `+=`, `-=`, `*=`, `/=`
- **Comparison Operators**: `==`, `===`, `!=`, `!==`, `<`, `>`, `<=`, `>=`
- **Logical Operators**: `&&` (AND), `||` (OR), `!` (NOT)
- **Ternary Operator**: `condition ? expr1 : expr2`

### Control Structures
JavaScript supports various control structures for managing the flow of execution in your code, including:
- **Conditional Statements**: `if`, `else if`, `else`, `switch`
- **Loops**: `for`, `while`, `do...while`, `for...in`, `for...of`
- **Exception Handling**: `try`, `catch`, `finally`, `throw`
### Example of Control Structures
```javascript
// Conditional Statement
let age = 20;
if (age < 18) {
    console.log("Minor");
} else if (age >= 18 && age < 65) {
    console.log("Adult");
} else {
    console.log("Senior");
}
// Loop
for (let i = 0; i < 5; i++) {
    console.log(i);
}
// Exception Handling
try {
    throw new Error("Something went wrong!");
} catch (error) {
    console.error(error.message);
} finally {
    console.log("Execution completed.");
}
```

### Objects and Arrays
Objects and arrays are fundamental data structures in JavaScript.
- **Objects**: Collections of key-value pairs, where keys are strings (or Symbols) and values can be any data type, including other objects or functions.
```javascript
let person = {
    name: "Alice",
    age: 30,
    greet: function() {
        console.log("Hello, my name is " + this.name);
    }
};
person.greet(); // Output: Hello, my name is Alice
```
- **Arrays**: Ordered lists of values, which can hold multiple data types, including other arrays or objects.
```javascript
let numbers = [1, 2, 3, 4, 5];
console.log(numbers[0]); // Output: 1
numbers.push(6); // Add an element to the end
console.log(numbers.length); // Output: 6
```
Arrays can have different types of elements:
```javascript
let mixedArray = [1, "two", true, { key: "value" }, [5, 6, 7]];
console.log(mixedArray);
```

### Array Methods
JavaScript provides several built-in methods for manipulating arrays, such as:
- `push()`: Adds one or more elements to the end of an array.
- `pop()`: Removes the last element from an array.
- `shift()`: Removes the first element from an array.
- `unshift()`: Adds one or more elements to the beginning of an array.
- `forEach()`: Executes a provided function once for each array element.
- `map()`: Creates a new array with the results of calling a provided function on every element.
- `filter()`: Creates a new array with all elements that pass the test implemented by the provided function.
- `reduce()`: Executes a reducer function on each element of the array, resulting in a single output value.
```javascript
let numbers = [1, 2, 3, 4, 5];
numbers.push(6); // [1, 2, 3, 4, 5, 6]
numbers.pop(); // [1, 2, 3, 4, 5]
numbers.shift(); // [2, 3, 4, 5]
numbers.unshift(0); // [0, 2, 3, 4, 5]
numbers.forEach(num => console.log(num)); // Logs each number
let doubled = numbers.map(num => num * 2); // [0, 4, 6, 8, 10]
let evens = numbers.filter(num => num % 2 === 0); // [0, 2, 4]
let sum = numbers.reduce((acc, num) => acc + num, 0); // 14
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

### 