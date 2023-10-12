
const baseUrl = 'http://localhost:3000';
const quoteForm = document.getElementById('quote-form');
const newQuoteInput = document.getElementById('new-quote');
const authorInput = document.getElementById('quote-author');
const quoteList = document.getElementById('quote-list');
const sortButton = document.getElementById('sort-button');
let isSorted = false;

// Function to fetch and render quotes
function fetchAndRenderQuotes() {
  fetch(`${baseUrl}/quotes?_embed=likes${isSorted ? '&_sort=author' : ''}`)
    .then((response) => response.json())
    .then((quotes) => {
      quoteList.innerHTML = ''; // Clear the quote list

      quotes.forEach((quote) => {
        const quoteCard = document.createElement('li');
        quoteCard.className = 'quote-card';
        quoteCard.innerHTML = `
          <blockquote class="blockquote">
            <p class="mb-0">${quote.quoteText}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success like-btn' data-id="${quote.id}">Likes: <span>${quote.likes.length}</span></button>
            <button class='btn-danger delete-btn' data-id="${quote.id}">Delete</button>
          </blockquote>
        `;

        // Event listener for like button
        const likeButton = quoteCard.querySelector('.like-btn');
        likeButton.addEventListener('click', (event) => likeQuote(event));

        // Event listener for delete button
        const deleteButton = quoteCard.querySelector('.delete-btn');
        deleteButton.addEventListener('click', (event) => deleteQuote(event));

        quoteList.appendChild(quoteCard);
      });
    });
}

// Event listener for sorting button
sortButton.addEventListener('click', () => {
  isSorted = !isSorted;
  sortButton.textContent = isSorted ? 'Unsort' : 'Sort by Author';
  fetchAndRenderQuotes();
});

// Event listener for submitting the quote form
quoteForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const newQuote = newQuoteInput.value;
  const author = authorInput.value;

  if (newQuote && author) {
    addNewQuote(newQuote, author);
    newQuoteInput.value = '';
    authorInput.value = '';
  }
});

// Function to add a new quote
function addNewQuote(quoteText, author) {
  fetch(`${baseUrl}/quotes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quoteText,
      author,
    }),
  })
    .then(() => fetchAndRenderQuotes());
}

// Function to like a quote
function likeQuote(event) {
  const quoteId = event.target.getAttribute('data-id');

  fetch(`${baseUrl}/likes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quoteId: parseInt(quoteId),
    }),
  })
    .then(() => fetchAndRenderQuotes());
}

// Function to delete a quote
function deleteQuote(event) {
  const quoteId = event.target.getAttribute('data-id');

  fetch(`${baseUrl}/quotes/${quoteId}`, {
    method: 'DELETE',
  })
    .then(() => fetchAndRenderQuotes());
}

// Initial fetch and render when the page loads
fetchAndRenderQuotes();


