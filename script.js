'use strict'

let myLibrary = [];

// book object constructor
function Book(title, author, numPages, uuid) {
    if (!new.target) {
        throw Error('You must use new operator to call as a constructor');
    }
    this.title = title;
    this.author = author;
    this.pages = numPages;
    this.uuid = uuid;
}

Book.prototype.remove = function() {
    let bookIndex = myLibrary.indexOf(this);
    myLibrary.splice(bookIndex, 1);
};

function addBookToLibrary(title, author, numPages) {
    const uuid = crypto.randomUUID();
    const newBook = new Book(title, author, numPages, uuid);
    
    myLibrary.push(newBook);
}

