import { data } from "./data.js";

function hasProperty(event, property) {
  return event.hasOwnProperty(property) && event[property];
}

/* Cards Generation - Selected Card */

function generateDetailsHTML(eventData, currentDate) {
  const hasAssistance = hasProperty(eventData, "assistance");
  const hasEstimate = hasProperty(eventData, "estimate");
  const eventDate = new Date(eventData.date);
  const isEventPast = eventDate <= currentDate;
  const detailsHTML = `
    <div class="big-card-body" id="detail-card-body">
      <h2>${eventData.name}</h2>
      <img src="${eventData.image}" alt="${eventData.title}">
      <date>Date: ${eventData.date}</date>
      <price>Price: $${eventData.price}</price>
      <category>Category: ${eventData.category}</category>
      <place>Place: ${eventData.place}</place>
      <capacity>Capacity: ${eventData.capacity}</capacity>
      <div>${
        hasAssistance
          ? `<assistance>Assistance: ${eventData.assistance}</assistance>`
          : ""
      }</div>
      ${
        hasEstimate
          ? `<estimate>Estimate: ${eventData.estimate}</estimate>`
          : ""
      }
      <description>${eventData.description}</description>
      ${
        isEventPast
          ? `<button type="button" class="btn btn-secondary" disabled id="event-has-passed">Sorry, this event has passed</button>`
          : `<button type="button" class="btn btn-primary" id="buy-tickets-button" onClick="alert('Sorry, we are still working on this feature!')">Buy Tickets</button>`
      }
    </div>
  `;

  return detailsHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  // Get event data from selected event on localStorage //
  const eventData = JSON.parse(localStorage.getItem("selectedEvent"));

  // Get current date of event //
  const currentDate = new Date(data.currentDate);

  // Display Detail Card with the corresponding button based on the event date //
  const container = document.querySelector("#detail-card-container");
  container.innerHTML = generateDetailsHTML(eventData, currentDate);
});
