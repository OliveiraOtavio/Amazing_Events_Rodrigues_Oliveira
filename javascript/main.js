/*   Previous/Next Pages Configuration   */

const h1 = document.querySelector("h1");
const h2 = document.querySelector("#actualpage");

h2.textContent = h1.textContent;
const previousBtn = document.getElementById("previous-page");
const nextBtn = document.getElementById("next-page");

const pageNames = [
  "index.html",
  "upcoming_events.html",
  "past_events.html",
  "contact.html",
  "stats.html",
];

const currentPath = window.location.pathname;
const currentPageIndex = pageNames.indexOf(currentPath.split("/").pop());

function previousPage() {
  if (currentPageIndex > 0) {
    window.location.href = pageNames[currentPageIndex - 1];
  }
}

function nextPage() {
  if (currentPageIndex < pageNames.length - 1) {
    window.location.href = pageNames[currentPageIndex + 1];
  }
}

previousBtn.addEventListener("click", previousPage);
nextBtn.addEventListener("click", nextPage);

/*   Hamburger Menu Configuration   */

const navbarToggler = document.querySelector(".navbar-toggler");
const navbarCollapse = document.querySelector(".navbar-collapse");

navbarToggler.addEventListener("click", () => {
  navbarCollapse.classList.toggle("show");
});

/*   Cards Generation Logic  */

// Fetch events from the API
export async function fetchEvents() {
  try {
    const response = await fetch(
      //'./script/amazing.json'  // Uncomment when the remote server is not working
      "https://mindhub-xj03.onrender.com/api/amazing"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return { events: [] };
  }
}

// HTML Cards Generation

export function generateCardsHTML(events) {
  let cardsHTML = "";
  events.forEach((item) => {
    // Replace single quotes with their HTML entity equivalent
    const itemString = JSON.stringify(item).replace(/'/g, "&#39;");
    cardsHTML += `
    <div class="card" id="card-body">          
    <h2>${item.name}</h2>         
        <img src="${item.image}" alt="${item.title}">
        <date>Date: ${item.date}</date>
        <price>Price:$ ${item.price}</price>
        <category>Category: ${item.category}</category>
        <place>Place: ${item.place}</place>
        <description>Description: ${item.description}</description>
        <button class="book-now-btn" data-event='${itemString}'>More Info</button>            
    </div>
    `;
  });
  return cardsHTML;
}

export function handleBookNowButtonClick(containerElement) {
  // Event Listener for "More Info" buttons
  containerElement.addEventListener("click", (event) => {
    if (event.target.classList.contains("book-now-btn")) {
      const eventData = JSON.parse(event.target.dataset.event);
      // Save the event data in localStorage
      localStorage.setItem("selectedEvent", JSON.stringify(eventData));
      // Redirect the user to details.html
      window.location.href = "./details.html";
    }
  });
}

/*   Checkboxes and Search COnfiguration  */

// main.js
export function showCheckboxCategories(
  data,
  container,
  checkboxContainer,
  searchForm,
  searchInput,
  isPastEvent
) {
  // Map events by category
  const categories = data.events.reduce((acc, event) => {
    if (!acc.includes(event.category)) {
      acc.push(event.category);
    }
    return acc;
  }, []);

  // Generate dynamic checkboxes
  categories.forEach((category) => {
    const div = document.createElement("div");
    div.classList.add("form-check", "form-check-inline");
    const input = document.createElement("input");
    input.classList.add("form-check-input");
    input.type = "checkbox";
    input.id = category;
    input.value = category;

    const label = document.createElement("label");
    label.classList.add("form-check-label");
    label.setAttribute("for", category);
    label.textContent = category;

    div.appendChild(input);
    div.appendChild(label);
    checkboxContainer.appendChild(div);

    // Event Listener for Checkboxes
    input.addEventListener("change", (event) => {
      // Map checked categories
      const selectedCategories = Array.from(
        checkboxContainer.querySelectorAll("input:checked")
      ).map((input) => input.value);

      const filteredEvents = data.events.filter((event) => {
        const eventDate = new Date(event.date);
        const currentDate = new Date();

        const isEventValid =
    isPastEvent === null
      ? true
      : isPastEvent
      ? eventDate < currentDate
      : eventDate >= currentDate;

        return (
          isEventValid &&
          (selectedCategories.length === 0 ||
            selectedCategories.includes(event.category) ||
            selectedCategories.includes("all"))
        );
      });

      container.innerHTML = generateCardsHTML(filteredEvents);
    });
    // Search function handler
    function handleSearch(searchTerm) {
      // Map selected categories
      const selectedCategories = Array.from(
        checkboxContainer.querySelectorAll("input:checked")
      ).map((input) => input.value);

      // Filter events by selected categories and search terms
      const filteredEvents = data.events.filter((event) => {
        const eventDate = new Date(event.date);
        const currentDate = new Date();
        const isEventValid =
        isPastEvent === null
          ? true
          : isPastEvent
          ? eventDate < currentDate
          : eventDate >= currentDate;

        const eventName = event.name.toLowerCase();
        const matchesSearchTerm = eventName.includes(searchTerm);
        const isCategorySelected =
          selectedCategories.length === 0 ||
          selectedCategories.includes(event.category) ||
          selectedCategories.includes("all");
        return matchesSearchTerm && isCategorySelected && isEventValid;
      });

      // If there are no events that match the search, display alert
      if (filteredEvents.length === 0) {
        container.innerHTML = '<p id="no-events">No events found.</p>';
        return;
      }

      // Update cards container
      const filteredCardsHTML = generateCardsHTML(filteredEvents);
      container.innerHTML = filteredCardsHTML;
    }

    // Handle search when the form is submitted
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const searchTerm = searchInput.value.toLowerCase().trim();
      handleSearch(searchTerm);
    });

    // Handle search when the input changes
    searchInput.addEventListener("input", function (event) {
      const searchTerm = event.target.value.toLowerCase().trim();
      handleSearch(searchTerm);
    });
  });
}
