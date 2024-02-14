// variable to contain list books
let bookShelf = [];
let bookEditId = "";

// objecct function to create book
function craateBook(id, title, author, year, isComplete) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.year = parseInt(year);
  this.isComplete = isComplete;
}

// add book method
function addBook() {
  bookShelf = JSON.parse(localStorage.getItem("bookShelf")) || [];
  const id = new Date().getTime();
  const book = new craateBook(
    id,
    title.value,
    author.value,
    parseInt(year.value),
    isComplete.checked
  );
  bookShelf.push(book);
  localStorage.setItem("bookShelf", JSON.stringify(bookShelf));
}

// display books
const listBooks = (title, author, year, isComplete) => {
  return `
  <article class="book_item">
  <h3><span class="value">${title}</span></h3>
  <p>Penulis: <span class="value">${author}</span></p>
  <p>Tahun: <span class="value">${year}</span></p>
  
  <div class="action">
  <button class="green">${
    isComplete ? "Belum selesai di Baca" : "Selesai di baca"
  }</button>
  <button class="red">Hapus buku</button>
  <button class="blue">Edit</button>
  </div>
  </article>
  `;
};

// load bookshelf method
function loadBookShelf(books = null) {
  if (books) {
    bookShelf = books;
  } else {
    bookShelf = JSON.parse(localStorage.getItem("bookShelf")) || [];
  }
  const completeBooks = bookShelf.filter((book) => book.isComplete === true);
  const incompleteBooks = bookShelf.filter((book) => book.isComplete === false);

  document.getElementById("incompleteBookshelfList").innerHTML = incompleteBooks
    .map((book) =>
      listBooks(book.title, book.author, book.year, book.isComplete)
    )
    .join("");
  document.getElementById("completeBookshelfList").innerHTML = completeBooks
    .map((book) =>
      listBooks(book.title, book.author, book.year, book.isComplete)
    )
    .join("");
}

// delete book method
function dropBook(bookId) {
  const bookIndex = bookShelf.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    bookShelf.splice(bookIndex, 1);
    localStorage.setItem("bookShelf", JSON.stringify(bookShelf));
    loadBookShelf();
  }
}

// search book method
function searchBook() {
  bookShelf = JSON.parse(localStorage.getItem("bookShelf")) || [];
  const search = document.getElementById("searchBookTitle").value;
  const books = bookShelf.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );
  loadBookShelf(books);
}

// mark book method
function markBook(bookId) {
  bookShelf = bookShelf.map((book) => {
    if (book.id === bookId) {
      book.isComplete = !book.isComplete;
    }
    return book;
  });
  localStorage.setItem("bookShelf", JSON.stringify(bookShelf));
  loadBookShelf();
}

// update book method
function editBook(bookId, title, author, year) {
  bookShelf = bookShelf.map((book) => {
    if (book.id === bookId) {
      book.title = title;
      book.author = author;
      book.year = parseInt(year);
    }
    return book;
  });
  localStorage.setItem("bookShelf", JSON.stringify(bookShelf));
  loadBookShelf();
}

// input display
function inputDisplay() {
  const label = document.querySelectorAll("#inputBook .input label");
  label.forEach((item) =>
    item.addEventListener("input", function (event) {
      console.log("Input value:", event.target.value);
      // Lakukan sesuatu dengan nilai input
    })
  );
}

// form
const inputForm = document.getElementById("inputBook");
const searchBookForm = document.getElementById("searchBook");

// input form
const title = document.getElementById("inputBookTitle");
const author = document.getElementById("inputBookAuthor");
const year = document.getElementById("inputBookYear");
const isComplete = document.getElementById("inputBookIsComplete");
// button
const bookShelfList = document.querySelectorAll(".book_shelf");
document.addEventListener("DOMContentLoaded", () => {
  // event listener
  document.addEventListener("load", loadBookShelf());
  inputForm.addEventListener("submit", (e) => {
    addBook();
  });
  isComplete.addEventListener("click", () => {
    document.getElementsByClassName("rak")[0].innerText = isComplete.checked
      ? "sudah selesai dibaca"
      : "belum selesai dibaca";
  });

  bookShelfList.forEach((el) => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      const target = e.target;
      const card = target.closest(".book_item");
      if (target.classList.contains("green")) {
        const detail = card.getElementsByClassName("value");
        const book = bookShelf.find(
          (book) =>
            book.title === detail[0].innerText &&
            book.author === detail[1].innerText &&
            book.year === parseInt(detail[2].innerText)
        );
        markBook(book.id);
      } else if (target.classList.contains("red")) {
        const detail = card.getElementsByClassName("value");
        const book = bookShelf.find(
          (book) =>
            book.title === detail[0].innerText &&
            book.author === detail[1].innerText &&
            book.year === parseInt(detail[2].innerText)
        );
        const konfirmasi = confirm("apalah anda yakin akan menghapus?");
        e.preventDefault();
        if (konfirmasi) dropBook(book.id);
      } else if (target.classList.contains("blue")) {
        const detail = card.getElementsByClassName("value");
        const book = bookShelf.find(
          (book) =>
            book.title === detail[0].innerText &&
            book.author === detail[1].innerText &&
            book.year === parseInt(detail[2].innerText)
        );
        const action = card.getElementsByClassName("action")[0];
        const saveButton = `<button class="edit save"> simpan </button>`;
        const cancelButton = `<button class="edit cancel"> batal </button>`;

        for (item of detail) {
          item.innerHTML = `<input type="text" class="editInput" value="${item.innerText}">`;
        }
        bookEditId = book.id;
        action.innerHTML = saveButton + cancelButton;
      } else if (target.classList.contains("save")) {
        const detail = card.getElementsByClassName("editInput");
        editBook(bookEditId, detail[0].value, detail[1].value, detail[2].value);
      } else if (target.classList.contains("cancel")) {
        loadBookShelf();
      }
    });
  });

  searchBookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchBook();
  });
});
