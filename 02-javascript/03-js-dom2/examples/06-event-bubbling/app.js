// TODO: demo event bubbling
// TODO: demo event.target vs event.currentTarget
// TODO: demo event capturing
// TODO: demo stopPropagation()

const inner = document.querySelector('#inner');
const middle = document.querySelector('#middle');
const outer = document.querySelector('#outer');

// outer.addEventListener("click",handleClick);
// middle.addEventListener("click",handleClick);
// inner.addEventListener("click",handleClick);

// function handleClick(e) {
//     // e.stopPropagation();
//     e.target.style.backgroundColor = "orange";
//     console.log("target " + e.target.id);
//     console.log("current target " + e.currentTarget.id);
//     console.log("-------")
// }

const capture = false;

outer.addEventListener("click",handleClick,capture);
middle.addEventListener("click",handleClick,capture);
inner.addEventListener("click",handleClick,capture);
function handleClick(e) {
    // e.stopPropagation();
    // e.target.style.backgroundColor = "orange";
    console.log("target " + e.target.id);
    console.log("current target " + e.currentTarget.id);
    console.log("-------")
}