import { data } from "./data.js";

const currentDate = new Date(data.currentDate);

const container = document.querySelector("#cards-container");

let cardsHTML = "";

for (let i = 0; i < data.events.length; i++) {
  const item = data.events[i];

  const eventDate = new Date(item.date);

  if (eventDate < currentDate) {
    cardsHTML += `
      <div class="card" id="card-body">
        <h2>${item.name}</h2>
        <img src="${item.image}" alt="${item.title}">
        <date>Date: ${item.date}</date>
        <price>Price: $${item.price}</price>
        <category>Category: ${item.category}</category>
        <place>Place: ${item.place}</place>
        <description>${item.description}</description>
        <button>Book Now</button>
      </div>
    `;
  }
}

container.innerHTML = cardsHTML;
