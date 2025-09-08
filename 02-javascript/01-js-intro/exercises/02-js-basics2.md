# JavaScript Exercises


### Exercise 1: FizzBuzz Implementation
Write a function `fizzBuzz(n)` that prints numbers from `1` to `n`. For multiples of `3`, print "Fizz" instead of the number, for multiples of `5`, print "Buzz", and for multiples of both `3` and `5`, print "FizzBuzz".


## String Exercises

### Exercise 2: FirstHalf string
Write a function `firstHalf(str)` that takes a string and returns the first half of it. If the string has an odd length, include the middle character in the first half.

**Example:**
```javascript
console.log(firstHalf("WooHoo")); // Output: "Woo"
console.log(firstHalf("Hello"));  // Output: "Hel"
console.log(firstHalf("abcdef")); // Output: "abc"
```

### Exercise 3: MiddleTwo chars
Write a function `middleTwo(str)` that takes a string of even length and returns the middle two characters.


**Example:**
```javascript
console.log(middleTwo("string")); // Output: "ri"
console.log(middleTwo("code"));   // Output: "od"
console.log(middleTwo("Practice")); // Output: "ct"
```

### Exercise 4: EndsWithLy
Write a function `endsWithLy(str)` that checks if a given string ends with "ly".

**Example:**
```javascript
console.log(endsWithLy("oddly")); // Output: true
console.log(endsWithLy("y"));     // Output: false
console.log(endsWithLy("oddy"));  // Output: false
```

### Exercise 5: Max of Three
Write a function `maxOfThree(a, b, c)` that returns the largest of three
numbers.

**Example:**
```javascript
console.log(maxOfThree(1, 2, 3)); // Output: 3
console.log(maxOfThree(3, 2, 1)); // Output: 3
console.log(maxOfThree(1, 3, 2)); // Output: 3
console.log(maxOfThree(-1, -2, -3)); // Output: -1
```

### Exercise 6: CountVowels
Write a function `countVowels(str)` that counts the number of vowels in a given string.

**Hint:** You can use a loop to iterate through the string and check each character. And use `.includes()` method to check if a character is a vowel.

**Example:**
```javascript
console.log(countVowels("hello")); // Output: 2
console.log(countVowels("JavaScript")); // Output: 3
console.log(countVowels("rhythm")); // Output: 0
```

### Exercise 7: IsPalindrome
Write a function `isPalindrome(str)` that checks if a given string is a palindrome (reads the same forwards and backwards).

**Example:**
```javascript
console.log(isPalindrome("racecar")); // Output: true
console.log(isPalindrome("hello"));   // Output: false
console.log(isPalindrome("madam"));   // Output: true
```

### Exercise 8: MaxBlock
Write a function `maxBlock(str)` that returns the length of the largest block of adjacent identical characters in a string.

**Example:**
```javascript
console.log(maxBlock("hoopla")); // Output: 2 (the "oo"
console.log(maxBlock("abbCCCddBBBxx")); // Output: 3 (the "CCC" or "BBB")
console.log(maxBlock("")); // Output: 0
```

### Exercise 9: SumDigits
Write a function `sumDigits(str)` that takes a string and returns the sum of all digits found in the string.

**Hint:** You can use `parseInt(char)` to convert a character to a number and check if it's a digit using `!isNaN(char)`.

**Example:**
```javascript
console.log(sumDigits("abc123")); // Output: 6 (1 + 2 + 3)
console.log(sumDigits("aa1bb2cc3")); // Output: 6
console.log(sumDigits("no digits")); // Output: 0
```

## Logic Exercises

### Exercise 10: LuckySum
Write a function `luckySum(a, b, c)` that returns the sum of three numbers. However, if any of the numbers is `13`, it does not count towards the sum and all numbers to its right are ignored.

**Example:**
```javascript
console.log(luckySum(1, 2, 3)); // Output: 6
console.log(luckySum(1, 2, 13)); // Output: 3
console.log(luckySum(1, 13, 3)); // Output: 1
console.log(luckySum(13, 2, 3)); // Output: 0
```

### Exercise 11: BlackJack
Write a function `blackJack(a, b)` that returns the value that is closest to 21 without going over. If both values go over 21, return 0.

**Example:**
```javascript
console.log(blackJack(19, 21)); // Output: 21
console.log(blackJack(22, 23)); // Output: 0
console.log(blackJack(18, 20)); // Output: 20
console.log(blackJack(21, 21)); // Output: 21
```

## Array Exercises

### Exercise 12: CountEvens
Write a function `countEvens(arr)` that counts the number of **even** integers in an array.

**Example:**
```javascript
console.log(countEvens([1, 2, 3, 4])); // Output: 2
console.log(countEvens([1, 3, 5]));    // Output: 0
console.log(countEvens([2, 4, 6]));    // Output: 3
```

### Exercise 13: BigDiff
Write a function `bigDiff(arr)` that returns the difference between the largest and smallest values in an array of integers.
**Example:**
```javascript
console.log(bigDiff([10, 3, 5, 6])); // Output: 7 (10 - 3)
console.log(bigDiff([7, 2, 10, 9])); // Output: 8 (10 - 2)
console.log(bigDiff([2, 10, 7, 2])); // Output: 8 (10 - 2)
```

### Exercise 14: CenteredAverage
Write a function `centeredAverage(arr)` that returns the "centered" average of an array of integers, which is the mean average of the values, excluding the largest and smallest values in the array.
**Example:**
```javascript
console.log(centeredAverage([1, 2, 3, 4, 100])); // Output: 3 = (2 + 3 + 4) / 3
console.log(centeredAverage([1, 1, 5, 5, 10, 8, 7])); // Output: 5
console.log(centeredAverage([-10, -4, -2, -4, -2, 0])); // Output: -3
```

### Exercise 15: Sum13
Write a function `sum13(arr)` that returns the sum of the numbers in the array, except ignore sections of numbers starting with a `13` and extending to the next number. Return `0` if the array is empty.

**Example:**
```javascript
console.log(sum13([1, 2, 2, 1])); // Output: 6
console.log(sum13([1, 2, 13, 2, 1, 13])); // Output: 4
console.log(sum13([13, 1, 2, 3, 4])); // Output: 9
console.log(sum13([])); // Output: 0
```

### Exercise 16: using map and filter
Write a function `squareEvens(arr)` that takes an array of integers and returns a new array containing the squares of only the even numbers from the original array. Use the `map` and `filter` methods.

**Example:**
```javascript
console.log(squareEvens([1, 2, 3, 4, 5])); // Output: [4, 16]
console.log(squareEvens([10, 15, 20])); // Output: [100, 400]
console.log(squareEvens([1, 3, 5])); // Output: []
```

### Exercise 17: RemoveDuplicates
Write a function `removeDuplicates(arr)` that takes an array and returns a new array with duplicates removed. Use the `filter`.

**Hint:** You can use `indexOf` to check if the current element's index is the same as its first occurrence index.

**Example:**
```javascript
console.log(removeDuplicates([1, 2, 2, 3, 4, 4])); // Output: [1, 2, 3, 4]
console.log(removeDuplicates(["apple", "banana", "apple"])); // Output: ["apple", "banana"]
console.log(removeDuplicates([])); // Output: []
```

### Exercise 18: using reduce
Write a function `productOfArray(arr)` that takes an array of numbers and returns the product of all the numbers in the array. Use the `reduce` method.

**Example:**
```javascript
console.log(productOfArray([1, 2, 3, 4])); // Output: 24 (1 * 2 * 3 * 4)
console.log(productOfArray([5, 6, 7])); // Output: 210 (5 * 6 * 7)
```

### Exercise 19: using forEach
Write a function `logElements(arr)` that takes an array and logs each element to the console using the `forEach` method.

**Example:**
```javascript
logElements(["apple", "banana", "cherry"]);
// Output:
// apple
// banana
// cherry
```

### Exercise 20: using map
Write a function `doubleValues(arr)` that takes an array of numbers and returns a new array with each value doubled. Use the `map` method.

**Example:**
```javascript
console.log(doubleValues([1, 2, 3])); // Output: [2, 4, 6]
console.log(doubleValues([5, 10, 15])); // Output: [10, 20, 30]
```

### Exercise 21: using filter
Write a function `filterGreaterThan(arr, threshold)` that takes an array of numbers and a threshold value, and returns a new array containing only the numbers that are greater than the threshold. Use the `filter` method.

**Example:**
```javascript
console.log(filterGreaterThan([1, 5, 10, 15], 7)); // Output: [10, 15]
console.log(filterGreaterThan([2, 4, 6, 8], 5)); // Output: [6, 8]
```

### Exercise 22: Sum greater than
Write a function `sumGreaterThan(arr, threshold)` that takes an array of numbers and a threshold value, and returns the sum of all numbers in the array that are greater than the threshold. Use the `filter` and `reduce` methods.

**Example:**
```javascript
console.log(sumGreaterThan([1, 5, 10, 15], 7)); // Output: 25 (10 + 15)
console.log(sumGreaterThan([2, 4, 6, 8], 5)); // Output: 14 (6 + 8)
```

## Object Exercises

### Exercise 23: CountProperties
Write a function `countProperties(obj)` that counts the number of properties in a given object.

**Hint:** You can use `Object.keys(obj)` to get an array of the object's own property names and then check its length.

**Example:**
```javascript
console.log(countProperties({a: 1, b: 2, c: 3})); // Output: 3
console.log(countProperties({name: "Alice", age: 30})); // Output: 2
console.log(countProperties({})); // Output: 0
```

### Exercise 24: GetPropertyValues
Write a function `getPropertyValues(obj)` that returns an array of all the property values of a given object.

**Hint:** You can use `Object.values(obj)` to get an array of the object's own property values.

**Example:**
```javascript
console.log(getPropertyValues({a: 1, b: 2, c: 3})); // Output: [1, 2, 3]
console.log(getPropertyValues({name: "Alice", age: 30})); // Output: ["Alice", 30]
console.log(getPropertyValues({})); // Output: []
```

## Typeof Exercises

### Exercise 25: TypeofArray
Write a function `typeofArray(arr)` that takes an array and returns a new array containing the data type of each element in the original array.

**Hint:** You can use the `typeof` operator to determine the type of each element.

**Example:**
```javascript
console.log(typeofArray([1, "two", true, null, undefined, {key: "value"}, [1, 2, 3]])); 
// Output: ["number", "string", "boolean", "object", "undefined", "object", "object"]
```

## Scope and Closure Exercises

### Exercise 26: VariableScope
What is the output of the following code? Explain why.

```javascript
if (true) {
    var x = 10;
    let y = 20;
}
console.log(x); // ?
console.log(y); // ?
```

### Exercise 27: FunctionScope
What is the output of the following code? Explain why.
```javascript
function testScope() {
    var a = 1;
    let b = 2;
    if (true) {
        var a = 3; // same variable!
        let b = 4; // different variable
        console.log(a); // ?
        console.log(b); // ?
    }
    console.log(a); // ?
    console.log(b); // ?
}
testScope();
```

### Exercise 28: Closure
What is the output of the following code? Explain why.

```javascript
function outer() {
    let count = 0;
    return function inner() {
        count++;
        return count;
    }
}
const counter = outer();
console.log(counter()); // ?
console.log(counter()); // ?
console.log(counter()); // ?
```
