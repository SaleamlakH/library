'use strict'

let myLibrary = [];
const addBtn = document.querySelector('.add-book');
const dialog = document.querySelector('dialog');
const inputs = document.querySelectorAll('form input');
const livePreview = document.querySelector('.form-live-preview');
const [bookTitle, bookAuthor, bookPages] = livePreview.querySelectorAll('.book-cover > div');

addBtn.addEventListener('click', () => dialog.showModal());
inputs.forEach(input => {
    input.addEventListener('input', updateTemplateReview);
});

// book object constructor
function Book(title, author, numPages, uuid) {
    if (!new.target) {
        throw Error('You must use new operator to call as a constructor');
    }
    this.title = title;
    this.author = author;
    this.pages = numPages;
    this.read = false;
    this.uuid = uuid;
}

Book.prototype.remove = function() {
    let bookIndex = myLibrary.indexOf(this);
    myLibrary.splice(bookIndex, 1);
};

Book.prototype.setReadStatus = function() {
    this.read = this.read ? false : true;
}

function addBookToLibrary(title, author, numPages) {
    const uuid = crypto.randomUUID();
    const newBook = new Book(title, author, numPages, uuid);
    
    myLibrary.push(newBook);
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