// TODO: Make an event fire once

document.querySelector("#fire-once").addEventListener("click",handleClick);
document.querySelector("#fire-once").addEventListener("click",handleClick2);


function handleClick(e) {
    console.log("I have been clicked");
    document.querySelector("#fire-once").removeEventListener("click",handleClick)
}

function handleClick2(e) {
    console.log("I have been clicked 2");
}