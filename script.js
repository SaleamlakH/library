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

function ActionButton(button, book, action) {    
    this.button = button;
    this.action = action;
    this.bookCard;

    Object.defineProperty(this, 'book', {
        get() {
            return book;
        }
    });
}

ActionButton.prototype.handleClick = function() {
    switch (this.action) {
        case 'read':
            this.book.setReadStatus();
            this.button.classList.toggle('read');
            break;
        case 'delete':
            // the remove methods are not identical
            // the first is built in node method which removes
            this.bookCard.remove();
            this.book.remove();
            break;
        case 'edit':
            this.openDialogForEditing();
    }
}

ActionButton.prototype.attachClickEventListener = function() {
    if (this.button) {
        this.button.addEventListener('click', () => {
            this.handleClick();
        });
    }
}

ActionButton.prototype.openDialogForEditing = function () {
    const {title, author, pages} = this.book;

    // fill template with book content
    bookTitle.textContent = title;
    bookAuthor.textContent = author;
    bookPages.textContent = pages;

    // fill the form elements with the respective book value
    form.querySelector('#book-title').value = title;
    form.querySelector('#book-author').value = author;
    form.querySelector('#book-pages').value = pages;

    dialog.showModal();
}

function addBookToLibrary(event) {
    const {title, author, pages} = getInputValue();
    const newBook = new Book(title, author, pages);
    const clonedCard = showBook(newBook);
    
    setupBookCardActions(newBook, clonedCard);
    myLibrary.push(newBook);
    event.preventDefault();
    resetDialog();
    dialog.close();
}

function getInputValue() {
    const formData = Array.from(new FormData(form));

    // convert two dimensional array into a key and value object;
    const data = formData.reduce((book, [key, value]) => {
        book[key.split('_')[1]] = value;
        return book;
    }, {});

    return data;
}

function setupBookCardActions(book, bookCard) {
    const actionBtns = bookCard.querySelectorAll('.actions button');
    
    for (const button of actionBtns) {
        let action = button.classList.value.split('-').at(-1);
        let actionBtn;
        
        action = (action === 'status') ? 'read' : action;
        actionBtn = new ActionButton(button, book, action);
        actionBtn.bookCard = bookCard;
        actionBtn.attachClickEventListener();
    };
};

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

    return cloneTemplate;
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

// add sample books to make UI and feature development easier
(function createSampleBooks() {
    const book1 = new Book('The Hobbit', 'J.R.R. Tolkien', '295');
    const book2 = new Book('Atomic Habits', 'James Clear', '295');

    myLibrary.push(book1, book2);
    myLibrary.forEach(book => {
        let clonedCard = showBook(book);
        setupBookCardActions(book, clonedCard);
    });
    resetDialog();
})();