let state = JSON.parse(localStorage.getItem("state")) || [];
let addedCategories = JSON.parse(localStorage.getItem("categories")) || [];
let modyfiedState = JSON.parse(localStorage.getItem("modyfiedState")) || [];
let flag = true;

const form = document.querySelector("form");
const formInputs = document.querySelectorAll(".form__input");
const filterInputs = document.querySelectorAll(".filter__input");
const inputNewCategory = document.querySelector(".input__new__category");
const selectsCategory = document.querySelectorAll(".select__category");
const table = document.querySelector(".table__data");
const totalParagraph = document.querySelector(".total");
const totalCategoryParagraph = document.querySelector(".total__category");
const modal = document.querySelector(".modal");
const modalInputs = document.querySelectorAll(".modal__input");
const modalEditButton = document.querySelector(".button__edit");
const pdfDataDiv = document.querySelector(".pdfData");

// MANAGING STATE
const addBook = (e) => {
  const newId = state.length ? state[state.length - 1].id + 1 : 0;
  e.preventDefault();
  let newBook = {};
  ["title", "author", "category", "priority"].forEach((item, i) => {
    newBook = { ...newBook, [item]: formInputs[i].value };
  });
  newBook = { ...newBook, id: newId };

  if (formInputs[0].value === "" || formInputs[1].value === "") {
    [formInputs[0], formInputs[1]].forEach((input) => {
      input.value === "" ? input.classList.add("disabled") : null;
    });
  } else {
    state.push(newBook);
    filterBooks(modyfiedState);
    [formInputs[0], formInputs[1]].forEach((input) => {
      input.classList.remove("disabled");
      input.value = "";
    });
    formInputs[2].value = "criminal";
    formInputs[3].value = 1;
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
  ["title", "author", "category", "priority"].forEach((item, i) => {
    modalInputs[i].value = itemData[item];
  });
  modalEditButton.dataset.currentId = itemData.id;
};

const editBook = (e) => {
  const currentId = parseInt(e.dataset.currentId);
  const indexInState = state.map((item) => item.id).indexOf(currentId);

  if (modalInputs[0].value === "" || modalInputs[1].value === "") {
    [modalInputs[0], modalInputs[1]].forEach((input) => {
      input.value === "" ? input.classList.add("disabled") : null;
    });
  } else {
    ["title", "author", "category", "priority"].forEach((item, i) => {
      state[indexInState][item] = modalInputs[i].value;
    });
    filterBooks(modyfiedState);
    modal.classList.remove("open");
  }
};

const sortBooks = (kind) => {
  const helper = (a, b) =>
    a[kind].toLowerCase() > b[kind].toLowerCase() ? 1 : -1;
  if (kind === "priority") {
    if (flag) {
      modyfiedState.sort((a, b) => a.priority - b.priority);
    } else modyfiedState.sort((a, b) => a.priority - b.priority).reverse();
  } else {
    if (flag) {
      modyfiedState.sort((a, b) => helper(a, b));
    } else modyfiedState.sort((a, b) => helper(a, b)).reverse();
  }
  flag = !flag;
  console.log(modyfiedState);
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

// RENDER
const renderBooks = (stateToRender) => {
  localStorage.setItem("state", JSON.stringify(state));
  localStorage.setItem("modyfiedState", JSON.stringify(modyfiedState));
  table.innerHTML = ``;
  table.innerHTML = stateToRender
    .map(
      (book) => `
      <div
        class="table__item draggable"
        draggable="true"
        ondragstart="onDragStart(event);"
        ondrop="onDrop(event);"
        data-id=${book.id}
      >
        <p>${book.title}</p>
        <p>${book.author}</p>
        <p>${book.category}</p>
        <p>${book.priority}</p>
        <button class="button button__delete button__table" type="button" data-id=${book.id} onClick="deleteBook(this)"}>-</button>
        <button class="button button__edit button__table" type="button" data-id=${book.id} onClick="openModal(this)"}>Edit</button>
      </div>
  `
    )
    .join("");
  countTotalRecords(state);
};

// ADDING CATEGORY
const addCategory = (e) => {
  e.preventDefault();
  if (inputNewCategory.value !== "") {
    selectsCategory.forEach((select) => {
      const newOption = document.createElement("option");
      newOption.value = inputNewCategory.value.toLowerCase();
      newOption.innerHTML = inputNewCategory.value;
      select.appendChild(newOption);
    });
    inputNewCategory.classList.remove("disabled");
    addedCategories.push(inputNewCategory.value);
    localStorage.setItem("categories", JSON.stringify(addedCategories));
  } else inputNewCategory.classList.add("disabled");
  inputNewCategory.value = "";
};

const initialAddNewCategories = () => {
  selectsCategory.forEach((select) => {
    addedCategories.forEach((cat) => {
      const newOption = document.createElement("option");
      newOption.value = cat.toLowerCase();
      newOption.innerHTML = cat;
      select.appendChild(newOption);
    });
  });
};

//COUNTING RECORDS
const countTotalRecords = (state) => {
  totalParagraph.innerHTML = `Total records ${state.length}`;
};
const countCategoryRecords = (newState) => {
  if (newState.length !== state.length) {
    totalCategoryParagraph.innerHTML = `Total records after filter ${newState.length}`;
  } else totalCategoryParagraph.innerHTML = "";
};

// EXPORT TO FILE
const pdfExport = () => {
  table.innerHTML = modyfiedState
    .map(
      (book) => `
    <div class="pdf__item">
      <p>${book.title}</p>
      <p>${book.author}</p>
      <p>${book.category}</p>
      <p>${book.priority}</p>
    </div>
`
    )
    .join("");
  window.print();
  setTimeout(() => window.location.assign("/"), 1000);
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

// DRAG AND DROP
const onDragStart = (event) => {
  event.dataTransfer.setData("text/plain", event.target.dataset.id);
};
const onDragOver = (event) => {
  event.preventDefault();
};
const onDrop = (event) => {
  const idDraggedElement = parseInt(event.dataTransfer.getData("text"));
  const idTarget = parseInt(event.currentTarget.dataset.id);
  const indexOfDragged = modyfiedState
    .map((item) => item.id)
    .indexOf(idDraggedElement);
  const indexOfTarget = modyfiedState.map((item) => item.id).indexOf(idTarget);
  const draggedItem = modyfiedState[indexOfDragged];

  if (indexOfTarget < indexOfDragged) {
    modyfiedState.splice(indexOfTarget, 0, draggedItem);
    modyfiedState.splice(indexOfDragged + 1, 1);
  } else {
    modyfiedState.splice(indexOfTarget + 1, 0, draggedItem);
    modyfiedState.splice(indexOfDragged, 1);
  }

  event.dataTransfer.clearData();
  renderBooks(modyfiedState);
};

// INITIAL
if (!pdfDataDiv) {
  initialAddNewCategories();
  filterBooks();
  form.addEventListener("submit", addBook);
  filterInputs.forEach((input) =>
    input.addEventListener("change", filterBooks)
  );
  modal.addEventListener("click", (e) => {
    if (e.target.dataset.layer) {
      [modalInputs[0], modalInputs[1]].forEach((input) =>
        input.classList.remove("disabled")
      );
      modal.classList.remove("open");
    }
  });
} else pdfExport();
