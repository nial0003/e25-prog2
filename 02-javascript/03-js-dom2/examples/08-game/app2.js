// State variables
let noOfCliks = 0;
let maxClicksPerSecond = 0;
const clickTimestamps = [];

// Rolling window in milliseconds (e.g., 1000 ms = 1 second)
const ROLLING_WINDOW = 1000;

document.addEventListener("DOMContentLoaded", initGame);

function initGame() {
    loadMaxClicks();
    document.querySelector("#clickMe").addEventListener("click", handleClick);
}

function handleClick() {
    noOfCliks++;
    clickTimestamps.push(Date.now());
    calculateClicksPerSecond();
    document.querySelector("#totalClicks").textContent = noOfCliks;
}

function calculateClicksPerSecond() {
    const now = Date.now();
    while (clickTimestamps.length && now - clickTimestamps[0] > ROLLING_WINDOW) {
        clickTimestamps.shift();
    }
    const clicksPerSecond = clickTimestamps.length;
    const cpsElem = document.querySelector("#clicksPerSecond");
    cpsElem.textContent = clicksPerSecond;

    updateClicksPerSecondColor(cpsElem, clicksPerSecond, maxClicksPerSecond);

    maxClicksPerSecond = Math.max(maxClicksPerSecond, clicksPerSecond);
    persistMaxClicks();
    document.querySelector("#maxClicksPerSecond").textContent = maxClicksPerSecond;
}

function updateClicksPerSecondColor(element, current, max) {
    if (current > max) {
        element.style.color = "green";
    } else {
        element.style.color = "red";
    }
}

function persistMaxClicks() {
    localStorage.setItem("maxClicksPerSecond", maxClicksPerSecond);
}

function loadMaxClicks() {
    const storedMax = localStorage.getItem("maxClicksPerSecond");
    if (storedMax) {
        maxClicksPerSecond = parseInt(storedMax);
    }
    document.querySelector("#maxClicksPerSecond").textContent = maxClicksPerSecond;
}

const storage = {
    item: "maxClicksPerSecond",
    get: function() {
        const storedMax = localStorage.getItem(this.item);
        if (storedMax) {
            maxClicksPerSecond = parseInt(storedMax);
        }
        return maxClicksPerSecond;
        // document.querySelector("#maxClicksPerSecond").textContent = maxClicksPerSecond;
    },
    save: function(maxClicksPerSecond) {
        localStorage.setItem(this.item, maxClicksPerSecond);
    }
};

console.log(storage.get());