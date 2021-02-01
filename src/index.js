let state = JSON.parse(localStorage.getItem("state")) || [];
let modyfiedState = [];
let flag = true;
const form = document.querySelector("form");
const table = document.querySelector(".table__data");
const modal = document.querySelector(".modal");
const totalParagraph = document.querySelector(".total");
const totalCategoryParagraph = document.querySelector(".total__category");
const filterInputs = document.querySelectorAll(".filter__input");

const addBook = (e) => {
  const newId = state.length ? state[state.length - 1].id + 1 : 0;
  e.preventDefault();
  const newBook = {
    title: document.getElementById("title").value,
    category: document.getElementById("category").value,
    priority: parseInt(document.getElementById("priority").value),
    id: newId,
  };
  state.push(newBook);
  renderBooks(state);
};

const deleteBook = (item) => {
  const newState = state.filter(
    (book) => book.id !== parseInt(item.dataset.id)
  );
  state = newState;
  renderBooks(state);
};

const openModal = (e) => {
  const itemData = state.filter(
    (item) => item.id === parseInt(e.dataset.id)
  )[0];
  modal.classList.add("open");
  document.getElementById("modal-title").value = itemData.title;
  document.getElementById("modal-category").value = itemData.category;
  document.getElementById("modal-priority").value = itemData.priority;
  document.querySelector(".button__edit").dataset.currentId = itemData.id;
};

const editBook = (e) => {
  const currentId = parseInt(e.dataset.currentId);
  const indexInState = state.map((item) => item.id).indexOf(currentId);
  state[indexInState].title = document.getElementById("modal-title").value;
  state[indexInState].category = document.getElementById(
    "modal-category"
  ).value;
  state[indexInState].priority = document.getElementById(
    "modal-priority"
  ).value;
  renderBooks(state);
};

const sortBooks = (kind) => {
  if (kind === "prior") {
    if (flag) {
      modyfiedState.sort((a, b) => a.priority - b.priority);
    } else modyfiedState.sort((a, b) => a.priority - b.priority).reverse();
  }
  if (kind === "cat") {
    if (flag) {
      modyfiedState.sort((a, b) => (a.category > b.category ? 1 : -1));
    } else
      modyfiedState
        .sort((a, b) => (a.category > b.category ? 1 : -1))
        .reverse();
  }
  flag = !flag;
  renderBooks(modyfiedState);
};

const filterBooks = (e) => {
  modyfiedState = [...state];
  filterInputs.forEach((input) => {
    const kind = input.dataset.kind;
    const value = kind === "priority" ? parseInt(input.value) : input.value;
    if (value !== "all" && value !== 0) {
      modyfiedState = modyfiedState.filter((item) => item[kind] === value);
    }
  });
  countCategoryRecords(modyfiedState);
  renderBooks(modyfiedState);
};

const renderBooks = (stateTorender) => {
  localStorage.setItem("state", JSON.stringify(state));
  table.innerHTML = ``;
  table.innerHTML = stateTorender
    .map(
      (book) => `
      <div class="table__item" data-id=${book.id}>
        <p>${book.title}</p>
        <p>${book.category}</p>
        <p>${book.priority}</p>
        <button type="button" data-id=${book.id} onClick="deleteBook(this)"}>Delete</button>
        <button type="button" data-id=${book.id} onClick="openModal(this)"}>Edit</button>
      </div>
  `
    )
    .join("");
  modyfiedState = [...state];
  countTotalRecords(state);
};

const countTotalRecords = (state) => {
  totalParagraph.innerHTML = `Total records ${state.length}`;
};
const countCategoryRecords = (newState) => {
  totalCategoryParagraph.innerHTML = `Total records after filter ${newState.length}`;
};

renderBooks(state);
form.addEventListener("submit", addBook);
filterInputs.forEach((input) => input.addEventListener("change", filterBooks));
modal.addEventListener("click", (e) =>
  e.target.dataset.layer ? modal.classList.remove("open") : null
);
