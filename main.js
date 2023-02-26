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

  