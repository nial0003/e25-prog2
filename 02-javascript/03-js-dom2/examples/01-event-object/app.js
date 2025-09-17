
// TODO: Show the event object
document.querySelector("#event-button").addEventListener("click", handleClick);

function handleClick(e) {
    console.log(e);
    console.log("clicked")
}

document.callbackExample(log);

function log(event) {
    console.log("HELLO");
}

// TODO: Create a callback function and pass it to callbackExample


