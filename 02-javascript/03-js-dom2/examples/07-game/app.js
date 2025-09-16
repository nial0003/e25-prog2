// State variables
let noOfCliks = 0;
let maxCps = 0;
const clickTimestamps = [];

// Rolling window in milliseconds (e.g., 1000 ms = 1 second)
const ROLLING_WINDOW = 1000;

// TODO
document.addEventListener("DOMContentLoaded", initGame);

function initGame() {
    const maxCpsLocalStorage = localStorage.getItem("maxCps");
    if (maxCpsLocalStorage) {
        maxClicksPerSecond = maxCpsLocalStorage;
    } else {
        localStorage.setItem("maxCps",maxClicksPerSecond)
    }
    document.querySelector("#maxClicksPerSecond").textContent = maxClicksPerSecond;
    document.querySelector("#clickMe").addEventListener("click",handleClick);
}

function handleClick() {
    document.querySelector("#totalClicks").textContent = ++noOfCliks;
    const now = Date.now();
    clickTimestamps.push(now);
    while(now - clickTimestamps[0] > ROLLING_WINDOW) {
        clickTimestamps.shift();
    }
    document.querySelector("#clicksPerSecond").textContent = clickTimestamps.length;
    if (clickTimestamps.length) {
        maxClicksPerSecond = maxClicksPerSecond<clickTimestamps.length ? clickTimestamps.length : maxClicksPerSecond;
        window.localStorage.setItem("maxCps",maxClicksPerSecond);
    }
    document.querySelector("#maxClicksPerSecond").textContent = maxClicksPerSecond;
}