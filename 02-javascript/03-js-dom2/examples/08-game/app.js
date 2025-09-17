// State variables
let noOfCliks = 0;
let maxCps = 0;

const arr = [];

// ROLLING_WINDOW
const ROLLING_WINDOW = 1000;

// TODO: Track the number of clicks
// TODO: Track clicks pr second (cps) - use a rolling window
// TODO: Track max cps
// TODO: (Extra) Persist max cps in localStorage

const btn = document.querySelector("#clickMe");
const totalClicksEl = document.querySelector("#totalClicks");
const clicksPerSecond = document.querySelector("#clicksPerSecond");
const maxClicksPerSecond = document.querySelector("#maxClicksPerSecond");

btn.addEventListener("click",handleClick);

const fromStorage = localStorage.getItem("maxCPS");

if (fromStorage) {
    maxClicksPerSecond.textContent = fromStorage;
}

function handleClick(event) {
    const now = Date.now();

    console.log("clicked");
    totalClicksEl.textContent = ++noOfCliks;
    arr.push(now);
    console.log(arr.length);
    while(now -  arr[0] > ROLLING_WINDOW) {
        arr.shift();
    }
    clicksPerSecond.textContent = arr.length;
    if (maxCps < arr.length) {
        maxCps = arr.length;
        maxClicksPerSecond.textContent = maxCps;
        localStorage.setItem("maxCPS",maxCps);
    }
}

