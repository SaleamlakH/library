'use strict'

let myLibrary = [];
const booksList = document.querySelector('.books-list');
const bookCardTemplate = document.querySelector('.book-card.template');
const addBtn = document.querySelector('.add-book');
const dialog = document.querySelector('dialog');
const form = document.querySelector('form');
const cancelBtn = document.querySelector('#cancel-button');
const inputs = document.querySelectorAll('form input');
const livePreview = document.querySelector('.form-live-preview');
const bookCover = livePreview.querySelector('.book-cover');
const [bookTitle, bookAuthor, bookPages] = livePreview.querySelectorAll('.book-cover > div');

addBtn.addEventListener('click', () => dialog.showModal());
form.addEventListener('submit', addBookToLibrary);
cancelBtn.addEventListener('click', () => {
    resetDialog();
    dialog.close()
});
inputs.forEach(input => {
    input.addEventListener('input', updateTemplateReview);
});

// book object constructor
function Book(title, author, numPages) {
    if (!new.target) {
        throw Error('You must use new operator to call as a constructor');
    }

    const uuid = crypto.randomUUID();
    
    this.title = title;
    this.author = author;
    this.pages = numPages;
    this.read = false;

    Object.defineProperty(this, 'bookId', {
        get() {
            return uuid;
        }
    });
}

Book.prototype.remove = function() {
    let bookIndex = myLibrary.indexOf(this);
    myLibrary.splice(bookIndex, 1);
};

Book.prototype.setReadStatus = function() {
    this.read = this.read ? false : true;
}

function addBookToLibrary(event) {
    const formData = Array.from(new FormData(form));

    // convert two dimensional array into a key and value object;
    const data = formData.reduce((book, [key, value]) => {
        book[key] = value;
        return book;
    }, {});

    const newBook = new Book(data.book_title, data.book_author, data.book_pages);
    myLibrary.push(newBook);
    
    event.preventDefault();
    showBook(newBook);
    resetDialog();
    dialog.close();
}

function showBook(book) {
    const cloneTemplate = bookCardTemplate.cloneNode(true);
    const actionBtnsContainer = cloneTemplate.querySelector('.actions');
    
    // Populating the cover before clone
    bookTitle.textContent = book.title;
    bookAuthor.textContent = book.author;
    bookPages.textContent = `${book.pages} pages`;
    
    const cloneBookCover = bookCover.cloneNode(true);
    
    cloneTemplate.classList.remove('template');
    cloneTemplate.dataset.id = book.bookId;
    cloneTemplate.insertBefore(cloneBookCover, actionBtnsContainer);
    booksList.insertBefore(cloneTemplate, bookCardTemplate);
}

function updateTemplateReview(event) {
    const targetInput = event.target.getAttribute('id');
    const value = event.target.value;

    switch (targetInput) {
        case 'book-title':
            bookTitle.textContent = value;
            break;
        case 'book-author':
            bookAuthor.textContent = value;
            break;
        case 'book-pages':
            bookPages.textContent = `${value} pages`;
    }
}

function resetDialog() {
    form.reset();
    bookTitle.textContent = '';
    bookAuthor.textContent = '';
    bookPages.textContent = '';
}