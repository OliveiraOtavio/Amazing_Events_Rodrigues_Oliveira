import {
  generateCardsHTML,
  handleBookNowButtonClick,
  showCheckboxCategories,
} from "./main.js";

async function loadCards() {
  const data = await fetch("https://mindhub-xj03.onrender.com/api/amazing");
  const eventData = await data.json();

  // Filter out events that are in the future
  const futureEvents = eventData.events.filter(
    (event) => new Date(event.date) > new Date()
  );

  // Generate cards by calling the generateCardsHTML() function and passing the future events as a parameter
  const container = document.querySelector("#cards-container");

  // Cards Generation - Upcoming Events
  const cardsHTML = generateCardsHTML(futureEvents);
  container.innerHTML = cardsHTML;

  // DOM elements for the checkbox, search form, and search input
  const upcomingEventsContainer = document.querySelector("#cards-container");
  const checkboxContainer = document.getElementById("checkbox");
  const searchForm = document.querySelector("#search form");
  const searchInput = document.querySelector('#search input[type="search"]');

  // Call the showCheckboxCategories() function to display categories and handle user interactions
  showCheckboxCategories(
    eventData,
    upcomingEventsContainer,
    checkboxContainer,
    searchForm,
    searchInput
  );

  // Call the handleBookNowButtonClick() function to handle the "More Info" button clicks
  const buttonContainer = document.querySelector("#cards-container");
  handleBookNowButtonClick(buttonContainer);
}

// Call the loadCards() function to load the event cards when the page is loaded
loadCards();
