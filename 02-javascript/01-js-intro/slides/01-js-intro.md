---
marp: true
title: "JavaScript Introduction"
version: "1.0"
paginate: true
---

<!-- _class: lead -->

# Introduction to JavaScript
### 3rd semester @ Erhvervsakademi København

<style>
section.lead h1 {
  text-align: center;
  font-size: 2.5em;
}
section.lead h3 {
  text-align: center;
  opacity: 0.6;
}
</style>

---

# What is JavaScript?
**A programming language.**

- **Interpreted, high-level, dynamic, weakly typed.**

- **Created in 1995 to make web pages interactive.**

- **Now it's also used for server-side development, mobile app etc using `Node.js`.**

- **Standardized as ECMAScript by ECMA International (defines core language features).**

---

# JavaScript overview

**Interpreted language**: 
- No need to compile code before running it.
- Works directly in web browsers like Chrome, Firefox, Safari, Edge.

**Dynamic typing**:
- No declared type, but values have types.
- Types can change at runtime.

**Object-oriented**:
- Everything is an object (arrays, functions, etc.).
- Later classes were added to the language (syntactic sugar).

---

# JavaScript syntax

**C/C++/Java-like syntax**:
- Curly braces `{}` to define code blocks.
- Semicolons `;` to end statements (optional but recommended).
- Parentheses `()` for function calls and control flow.
- Comments: `//` for single-line, `/* ... */` for multi-line.
- Case-sensitive (e.g., `myVar` and `myvar` are different).
- Usual operators: `+`, `-`, `*`, `/`, `%`, `=`, `==`, `===`, `!=`, `!==`, `<`, `>`, `<=`, `>=`.
    - Although `==` and `!=` are weird!

---

# JavaScript syntax example

```javascript
let str = "Hello, World!";

if (str.length > 0) {

    console.log(str);
} else {
    console.log("Empty string");
}
```

---

# JavaScript primitive types
- **Number**: Represents both integers and floating-point numbers (e.g., `42`, `3.14`).
- **String**: Represents sequences of characters (e.g., `"Hello, World!"`).
- **Boolean**: Represents logical values (`true` or `false`).
- **Undefined**: Represents a variable that has been declared but not assigned a value.
- **Null**: Represents the intentional absence of any object value.

---

# JavaScript variables

**Several ways to declare variables**:
- `var`: function-scoped, can be redeclared and updated.
- `let`: block-scoped, can be updated but not redeclared.
- `const`: block-scoped, cannot be updated or redeclared (must be initialized).

**Don't use `var` in modern code!**

---

# JavaScript conditionals

**All values are either "truthy" or "falsy"**:
- Falsy values: `false`, `0`, `""` (empty string), `null`, `undefined`, `NaN`.
- Everything else is truthy.

**Equality operators**:
- `==`: loose equality, performs type coercion (means it converts one or both values to a common type before making the comparison).
- `===`: strict equality, no type coercion.

---

# JavaScript functions

**Function declaration:**
```javascript
function myFunction(param1, param2) {
    return param1 + param2;
}
```
**Function expression:**
```javascript
const myFunction = function(param1, param2) {
    return param1 + param2;
};
```
**Arrow function:**
```javascript
const myFunction = (param1, param2) => param1 + param2;
```

---

# JavaScript functions (contd.)
**Functions are first-class citizens** (can be assigned to variables, passed as arguments, returned from other functions).
```javascript
function add(a, b) {
    return a + b;
}
const operate = (fn, x, y) => fn(x, y);
console.log(operate(add, 2, 3)); // Outputs: 5
```


**Can have default parameters:**
```javascript
function greet(name = "Guest") {
    console.log("Hello, " + name + "!");
}
```

---

# JavaScript objects
**Objects are collections of key-value pairs**:
```javascript
const person = {
    name: "Alice",
    age: 30,
    greet: () => console.log("Hello, " + person.name)
};
```
**Access properties using dot notation or bracket notation**:
```javascript
console.log(person.name); // Dot notation
console.log(person["age"]); // Bracket notation
```
**Add or modify properties**:
```javascript
person.city = "New York"; // Add new property
```

---

# JavaScript arrays
**Arrays are ordered collections of values**:
```javascript
const numbers = [1, 2, 3, 4, 5];
```
**Access elements using index (0-based)**:
```javascript
console.log(numbers[0]); // Outputs: 1
```
**Common array methods**:
- `push()`: Add element to the end.
- `pop()`: Remove last element.
- `shift()`: Remove first element.
- `unshift()`: Add element to the beginning.

---

# JavaScript arrays (contd.)
**More array methods**:
- `forEach()`: Iterate over elements.
- `map()`: Transform elements and return a new array.
- `filter()`: Filter elements based on a condition.
- `reduce()`: Reduce array to a single value.
```javascript
const doubled = numbers.map(n => n * 2); // [2, 4, 6, 8, 10]
const evens = numbers.filter(n => n % 2 === 0); // [2, 4]
const sum = numbers.reduce((acc, n) => acc + n, 0); // 15
```
**NOTE:** They take functions as arguments!

---

# JavaScript loops
**Loops are the same as in Java**:

**Difference: for-in vs for-of**:
- `for-in`: Iterates over the keys of an object (or indices of an array).
- `for-of`: Iterates over the values of an iterable (like an array or string).
```javascript
const arr = ['a', 'b', 'c'];
for (const index in arr) {
    console.log(index); // Outputs: 0, 1, 2
}
for (const value of arr) {
    console.log(value); // Outputs: 'a', 'b', 'c'
}
```

---
# JavaScript special features
**Hoisting**:
Variable (`var`) and function declarations are moved to the top of their containing scope during compilation. (Only declarations, not initializations.)

```javascript
console.log(x); // Outputs: undefined
var x = 5; // x is hoisted but not initialized

greet(); // Outputs: "Hello!"
function greet() { // Function declaration is hoisted
    console.log("Hello!"); 
}
```
---
# JavaScript special features (contd.)
**Closures**:
A closure is a function that retains access to its lexical scope, even when the function is executed outside that scope.
```javascript
function outerFunction() {
    let outerVariable = "I'm from outer scope!";
    function innerFunction() {
        console.log(outerVariable);
    }
    return innerFunction;
}
const closure = outerFunction();
closure(); // Outputs: "I'm from outer scope!"
```
**So the `innerFunction()` has access to:** its own scope, the outer function's scope and the global scope.

---

# JavaScript special features (contd.)

**Destructuring**:
A convenient way to extract values from arrays or properties from objects into distinct variables.
```javascript
// Array destructuring
const rgb = [255, 200, 100];
const [red, green, blue] = rgb;
console.log(red, green, blue); // Outputs: 255 200 100

// Object destructuring
const person = { name: "Osman", age: 33 };
const { name, age } = person;
console.log(name, age); // Outputs: Osman 33
```

---

# JavaScript special features (contd.)

**Template Literals**:
A way to create strings that can span multiple lines and include embedded expressions.
```javascript
const person = { name: "Osman", age: 33 };
const { name, age } = person;

const greeting = `Hello, my name is ${name} and I am ${age} years old.`;

console.log(greeting); // Outputs: Hello, my name is Osman and I am 33 years old.
```

---

# JavaScript classes
**Classes are syntactic sugar over JavaScript's existing prototype-based inheritance**:
```javascript
class Person {
    #name; // Private field
    constructor(name) {
        this.#name = name;
    }
    greet() {
        console.log(`Hello, my name is ${this.#name}`);
    }
}
```
```javascript
const obj = new Person("Osman");
obj.greet();
```
---

# JavaScript in the browser

**Inline JavaScript (we won't use this often)**:
```html
<script>
    // JavaScript code goes here
</script>
```
**External JavaScript file**:
```html
<script src="app.js"></script>
```
**Multiple JavaScript files with `type=module`:**

Allows importing other modules using `import` and `export` statements.
```html
<script type="module" src="app.js"></script>
```

<br/>
where `app.js` is the entry point of your application.
