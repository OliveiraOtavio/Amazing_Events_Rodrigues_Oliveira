import {
  generateCardsHTML,
  handleBookNowButtonClick,
  showCheckboxCategories,
} from "./main.js";

// Asynchronous function to load event cards
async function loadCards() {
  // Fetch event data from the API
  const data = await fetch("https://mindhub-xj03.onrender.com/api/amazing");
  const eventData = await data.json();

  // Generate cards by calling the generateCardsHTML() function and passing the events as a parameter
  const container = document.querySelector("#cards-container");
  const cardsHTML = generateCardsHTML(eventData.events);
  container.innerHTML = cardsHTML;

  // DOM elements for the checkbox, search form, and search input
  const indexContainer = document.querySelector("#cards-container");
  const checkboxContainer = document.getElementById("checkbox");
  const searchForm = document.querySelector("#search form");
  const searchInput = document.querySelector('#search input[type="search"]');

  // Call the showCheckboxCategories() function to display categories and handle user interactions
  showCheckboxCategories(
    eventData,
    indexContainer,
    checkboxContainer,
    searchForm,
    searchInput,
    null // to be able to select all events, upcoming or past.
  );

  // Call the handleBookNowButtonClick() function to handle the "More Info" button clicks
  const buttonContainer = document.querySelector("#cards-container");
  handleBookNowButtonClick(buttonContainer);
}

// Call the loadCards() function to load the event cards when the page is loaded
loadCards();
