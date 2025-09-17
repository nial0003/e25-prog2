
// The callback is a function passed as an argument to another function
function callbackExample(callback) {
    const event = {
        msg: "Hello from global callbackExample!"
    };
    callback(event);
}


document.callbackExample = callbackExample; // Expose to global scope for testing
