'use strict'

let myLibrary = [];
const addBtn = document.querySelector('.add-book');
const dialog = document.querySelector('dialog');

addBtn.addEventListener('click', () => dialog.showModal());

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