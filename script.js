'use strict'
let myLibrary = [];

function Book(title, author, numPages, uuid) {
    if (!new.target) {
        throw Error('You must use new operator to call as a constructor');
    }
    this.title = title;
    this.author = author;
    this.pages = numPages;
    this.uuid = uuid;
}

function addBookToLibrary(title, author, numPages) {
    const uuid = crypto.randomUUID();
    const newBook = new Book(title, author, numPages, uuid);
    
    myLibrary.push(newBook);
}

addBookToLibrary('The Hobbit', 'J.R.R. Tolkien', 295);