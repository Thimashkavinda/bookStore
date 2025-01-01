let books = [
    { title: "Book 1", author: "Author 1", rating: 0 },
    { title: "Book 2", author: "Author 2", rating: 0 },
];

function renderBooks() {
    const bookList = document.querySelector('.book-list');
    bookList.innerHTML = '';
    books.forEach((book, index) => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');
        bookItem.innerHTML = `
            <p>Book #${index + 1}</p>
            <p>${book.title}</p>
            <p>${book.author}</p>
            <div class="stars" data-index="${index}">
                ${renderStars(book.rating)}
            </div>
            <button class="details-btn" data-index="${index}">Details</button>
        `;
        bookList.appendChild(bookItem);
    });
    handleStarRating();
    setupDetailsModal();
}

function renderStars(rating) {
    let starsHTML = '';
    for (let i = 0; i < 5; i++) {
        starsHTML += i < rating ? '<i class="fa fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
    }
    return starsHTML;
}

function handleStarRating() {
    const stars = document.querySelectorAll('.stars i');
    stars.forEach((star) => {
        star.addEventListener('click', (e) => {
            const parent = star.parentElement;
            const index = parseInt(parent.dataset.index);
            const starIndex = Array.from(parent.children).indexOf(star);
            books[index].rating = starIndex + 1;
            localStorage.setItem('books', JSON.stringify(books));
            renderBooks();
        });
    });
}

function addBook(title, author) {
    books.push({ title, author, rating: 0 });
    localStorage.setItem('books', JSON.stringify(books));
    renderBooks();
}

function setupDetailsModal() {
    const modal = document.querySelector('.modal');
    const modalContent = modal.querySelector('.modal-content');
    const detailsButtons = document.querySelectorAll('.details-btn');

    detailsButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const index = btn.dataset.index;
            const book = books[index];
            modalContent.innerHTML = `
                <h2>${book.title}</h2>
                <p>Author: ${book.author}</p>
                <p>Rating: ${book.rating} Stars</p>
                <button class="close-btn">Close</button>
            `;
            modal.style.display = 'block';
            modal.querySelector('.close-btn').addEventListener('click', () => {
                modal.style.display = 'none';
            });
        });
    });
}

function loadBooks() {
    const storedBooks = JSON.parse(localStorage.getItem('books'));
    if (storedBooks) {
        books = storedBooks;
    }
    renderBooks();
}

document.querySelector('.add-book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = e.target.elements['title'].value;
    const author = e.target.elements['author'].value;
    addBook(title, author);
    e.target.reset();
});

document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    handleSearch();
});

function handleSearch() {
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase();
        const bookItems = document.querySelectorAll('.book-item');
        bookItems.forEach((book) => {
            const title = book.querySelector('p:nth-child(2)').textContent.toLowerCase();
            const author = book.querySelector('p:nth-child(3)').textContent.toLowerCase();
            if (title.includes(searchValue) || author.includes(searchValue)) {
                book.style.display = 'block';
            } else {
                book.style.display = 'none';
            }
        });
    });
}
