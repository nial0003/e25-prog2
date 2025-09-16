// Event bubbling example in JavaScript

// Function to log the event target and current target
function logEvent(event) {
    console.log("Triggered by event on " + event.target.id)
    console.log("Triggered by event on current target " + event.currentTarget.id)
}

// Note: The stopPropagation() method is used here to prevent the event from bubbling up further.


// Setting only one event listener on the outermost element to
// get the specific target that was clicked
// document.querySelector('#outer').addEventListener('click', logEvent,true);
// document.querySelector('#middle').addEventListener('click', logEvent,true);
// document.querySelector('#inner').addEventListener('click', logEvent,true);
document.querySelector('#outer').addEventListener('click', (e) => {console.log("Outer clicked");});
document.querySelector('#middle').addEventListener('click', (e) => {console.log("Middle clicked");});
document.querySelector('#inner').addEventListener('click', (e) => {console.log("Inner clicked");});