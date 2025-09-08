# JavaScript Exercises: Basics


## Setup: 
Create a new folder for this exercise.

Inside this folder, create two files: `index.html` and `app.js`.

Add the following boilerplate code to `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JavaScript Variables Exercise</title>
</head>
<body>
    <h1>JavaScript Exercise: Basics</h1>
    <pre>Open the console to see the output.</pre>
    <script src="app.js"></script>
</body>
</html>
```

Note that we use `<script src="app.js"></script>` to link the JavaScript file.

Start the live server (runs on `localhost:5500`) and open the browser console to see the output of your JavaScript code.

Write your JavaScript code in `app.js` to complete the exercises below.

You can use `console.log()` to print output to the console.

For comments use `//` for single-line comments and `/* ... */` for multi-line comments.

**Example**:
```javascript
// This is a single-line comment
/*
This is a multi-line comment
*/
console.log("Hello, World!"); // Prints Hello, World! to the console
```

---

## 1. Variables & Data Types

**Exercise 1:**

* Declare a `const` variable called `gravity` with value `9.81`.
* Declare a `let` variable called `height` with value `20`.
* Calculate the potential energy (`gravity * height * mass`) for `mass = 70` and log it.

**Exercise 2:**

* Declare a variable `temperature` without assigning a value and log it.
* Later, assign `25` to it and log it again.

---

## 2. Strings

**Exercise 3:**

* Create a string `"Learning JavaScript"`.
* Print its length.
* Convert it to lowercase.
* Extract the word `"JavaScript"` using `substring()`.

**Exercise 4:**

* Replace the word `"Learning"` with `"Mastering"`, using `replace()`.
* Find the position of the word `"JavaScript"` using `indexOf()`.
* Split the string into characters and log the resulting array (use `split("")`).

---

## 3. Equality Operators

**Exercise 5:**

* Compare `0 == false` and `0 === false`.
* Compare `"" == false` and `"" === false`.
* Explain the differences.

---

## 4. Functions

**Exercise 6:**

* Write a function declaration `square(n)` that returns the square of a number.
* Write a function expression `cube(n)` that returns the cube of a number.
* Write an arrow function `power(base, exp)` that calculates exponentiation.

**Exercise 7:**

* Write a function `applyOperation(op, a, b)` that executes the passed-in operation function on two numbers.
* Test it with `add`, `subtract`, and `multiply` functions.

---

## 5. Control Flow

**Exercise 8:**

* Write a program that checks if a given year is a leap year. A year is a leap year if it is divisible by 4 but not by 100, unless it is also divisible by 400.

* Rewrite the logic using a `switch` statement for the months of the year: log the number of days for `February`, `April`, and default.

**Exercise 9:**

* Use a `for` loop to print all even numbers between `1` and `10`.
* Use a `while` loop to count down from `5` to `1`.
* Use a `for...of` loop to print elements of an array `["red", "green", "blue"]`.

---

## 6. Closures

**Exercise 10:**

* Create a closure `createLogger(prefix)` that returns a function which logs messages with that prefix.
* Example: 
```javascript
const errorLogger = createLogger("ERROR");
errorLogger("File not found"); // output: ERROR: File not found
```

---

## 7. Scope

**Exercise 11:**

* Create a variable inside a function using `let` and try accessing it outside.
* Do the same with `var` inside the function.
* What differences do you observe? What is the reason for these differences?

---

## 8. Objects

**Exercise 12:**

* Create an object `book` with properties `title`, `author`, and `pages`.
* Add a method `getSummary()` that returns a formatted string.
* Add a new property `publishedYear` dynamically.
* Delete the `pages` property.

---

## 9. Arrays

**Exercise 13:**

* Create an array of cities `["Paris", "London", "Tokyo"]`.
* Add `"Berlin"` to the end.
* Remove the first element.
* Use `map()` to append `" City"` to each element.
* Use `filter()` to keep only cities with more than 5 characters.
* Use `reduce()` to concatenate all names into a single string.

---

## 10. Destructuring & Template Literals

**Exercise 14:**

* Destructure the array `[100, 200, 300]` into three variables.
* Destructure the object `{firstName: "John", lastName: "Doe"}` into variables.
* Use template literals to print: `"My name is John Doe and I scored 300 points."`

---

## 11. Console

**Exercise 15:**

* Use `console.log` to print a welcome message.
* Use `console.warn` to log a message about deprecation.
* Use `console.error` to log an invalid input.
* Use `console.table` to display an array of books with `title` and `author`.

---