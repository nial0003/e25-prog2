window.addEventListener("DOMContentLoaded", initApp);

function initApp() {
    initForm();
}

function initForm() {
    const form = document.querySelector("form");
    form.addEventListener("submit", handleSubmit);

    // Range value display logic
    const range = document.querySelector("#range");
    const rangeValue = document.querySelector("#rangeValue");
    
    if (range && rangeValue) {
        rangeValue.textContent = range.value;
        range.addEventListener("input", function() {
            rangeValue.textContent = range.value;
        }); 
    }
}

function handleSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData(event.target);
    console.log(Object.fromEntries(formData));
    for (const entry of formData) {
        const key = entry[0];
        const value = entry[1];
        console.log(key, value);
    }
}