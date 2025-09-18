const MIN = 1;
const MAX = 100;
let secretNumber;
let attempts;

// DOM elements to be used:
const guessForm = document.querySelector("#guessForm");
const guessInput = document.querySelector("#guessInput");
const feedback = document.querySelector("#feedback");
const attemptsDisplay = document.querySelector("#attempts");
const restartBtn = document.querySelector("#restartBtn");

window.addEventListener("DOMContentLoaded", initGame);

// TODO
function initGame() {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    console.log(randomNumber);
}