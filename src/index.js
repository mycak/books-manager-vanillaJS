let state = JSON.parse(localStorage.getItem("state")) || [];
let addedCategories = JSON.parse(localStorage.getItem("categories")) || [];
let modyfiedState = [];
let flag = true;
const form = document.querySelector("form");
const formTitleInput = document.querySelector(".form__title");
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
    priority: document.getElementById("priority").value,
    id: newId,
  };
  if (newBook.title === "") {
    formTitleInput.classList.add("disabled");
  } else {
    state.push(newBook);
    filterBooks(modyfiedState);
    formTitleInput.classList.remove("disabled");
    document.getElementById("title").value = "";
    document.getElementById("category").value = "criminal";
    document.getElementById("priority").value = 1;
  }
};

const deleteBook = (item) => {
  const newState = state.filter(
    (book) => book.id !== parseInt(item.dataset.id)
  );
  state = newState;
  filterBooks(modyfiedState);
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
  filterBooks(modyfiedState);
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
  if (kind === "title") {
    if (flag) {
      modyfiedState.sort((a, b) =>
        a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
      );
    } else
      modyfiedState
        .sort((a, b) =>
          a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
        )
        .reverse();
  }
  flag = !flag;
  renderBooks(modyfiedState);
};

const filterBooks = (e) => {
  modyfiedState = [...state];
  filterInputs.forEach((input) => {
    const kind = input.dataset.kind;
    const value = input.value;
    if (value !== 0 && value !== "0") {
      modyfiedState = modyfiedState.filter((item) => item[kind] === value);
    }
  });
  countCategoryRecords(modyfiedState);
  renderBooks(modyfiedState);
};

const renderBooks = (stateToRender) => {
  localStorage.setItem("state", JSON.stringify(state));
  table.innerHTML = ``;
  table.innerHTML = stateToRender
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
  countTotalRecords(state);
};

const addCategory = (e) => {
  e.preventDefault();
  const name = document.querySelector(".input__new__category");
  if (name.value !== "") {
    const selects = document.querySelectorAll(".select__category");
    selects.forEach((select) => {
      const newOption = document.createElement("option");
      newOption.value = name.value.toLowerCase();
      newOption.innerHTML = name.value;
      select.appendChild(newOption);
    });
    name.classList.remove("disabled");
    addedCategories.push(name.value);
    localStorage.setItem("categories", JSON.stringify(addedCategories));
  } else name.classList.add("disabled");
  name.value = "";
  console.log(addedCategories);
};

const initialAddNewCategories = () => {
  const selects = document.querySelectorAll(".select__category");
  selects.forEach((select) => {
    addedCategories.forEach((cat) => {
      const newOption = document.createElement("option");
      newOption.value = cat.toLowerCase();
      newOption.innerHTML = cat;
      select.appendChild(newOption);
    });
  });
};

const countTotalRecords = (state) => {
  totalParagraph.innerHTML = `Total records ${state.length}`;
};
const countCategoryRecords = (newState) => {
  if (newState.length !== state.length) {
    totalCategoryParagraph.innerHTML = `Total records after filter ${newState.length}`;
  } else totalCategoryParagraph.innerHTML = "";
};

const csvExport = () => {
  const rows = document.querySelectorAll(".table__item");
  const rowsdata = Array.from(rows).map((row) => {
    return [
      row.children[0].innerHTML,
      row.children[1].innerHTML,
      row.children[2].innerHTML,
    ];
  });
  let csvContent =
    "data:text/csv;charset=utf-8," +
    rowsdata.map((e) => e.join(",")).join("\n");
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "books.csv");
  document.body.appendChild(link);

  link.click();
};

initialAddNewCategories();
filterBooks();

form.addEventListener("submit", addBook);
filterInputs.forEach((input) => input.addEventListener("change", filterBooks));
modal.addEventListener("click", (e) =>
  e.target.dataset.layer ? modal.classList.remove("open") : null
);
