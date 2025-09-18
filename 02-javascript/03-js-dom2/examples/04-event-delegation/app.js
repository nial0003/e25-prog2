// window.addEventListener("load", initApp);
// function initApp() {
//   console.log("DOM is fully loaded");
// }

// TODO: add a new item to the ul
// TODO: Add an event listener to li
// TODO: Add event delegation to ul


document.querySelector("#item-form").addEventListener("submit",handleSubmit);
document.querySelector("#item-list").addEventListener("click",handleItemClick);

function handleSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const item = formData.get("item");
  const quantity = formData.get("quantity");
  e.target.reset();
  addToList(item,quantity);
}

let id = 1;

function addToList(item,quantity) {

  const ul = document.querySelector("#item-list");
  // <li>Apples <span class="quantity">5</span></li>

  const html = /* html */ `
    <li data-id=${id++}>${item} <span class="quantity">${quantity}</span></li>
  `;

  ul.insertAdjacentHTML("beforeend",html);
  ul.lastElementChild.addEventListener("click",handleItemClick);

}

function handleItemClick(e) {
  console.log(e.target.closest("li").getAttribute("data-id"));

  console.log(e.currentTarget);
}
