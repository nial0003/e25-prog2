// TODO: Use a submit event to retrieve the form.
const formEl = document.querySelector("#item-form");

formEl.addEventListener("submit",handleSubmit);

function handleSubmit(e) {
    e.preventDefault();
    console.log(e);
    console.log("FORM SUBMITTED");
    const formData = new FormData(e.target);
    console.log(formData.get("item"));
    e.target.reset();
    // const input = document.querySelector("#item-input");
    // console.log(input.value)
}

// document.querySelector("button").addEventListener("click",handleClick);

// function handleClick(e) {
//     console.log(e);
//     console.log(e.target.closest("form"))
//     const formData = new FormData(e.target.closest("form"));
//     console.log(formData.get("item"));
//     e.target.closest("form").reset();
// }


// TODO: Show different default behaviour of a form submit button