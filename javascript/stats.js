// Function to fetch events from the API
async function fetchData() {
  try {
    const response = await fetch(
      "https://mindhub-xj03.onrender.com/api/amazing"
    );
    // const response = await fetchData('../javascript/amazing.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
  }
}

// Calculates the maximum and minimum attendance percentages and maximum capacity for the given events
function findAttendanceStats(events) {
  let maxAttendance = 0;
  let minAttendance = 100;
  let maxCapacity = 0;
  let maxAttendanceEvent = "";
  let minAttendanceEvent = "";
  let maxCapacityEvent = "";

  events.forEach((event) => {
    const attendancePercentage = (event.assistance / event.capacity) * 100;

    if (attendancePercentage > maxAttendance) {
      maxAttendance = attendancePercentage;
      maxAttendanceEvent = `${event.name} (${attendancePercentage.toFixed(
        2
      )}%)`;
    }

    if (attendancePercentage < minAttendance) {
      minAttendance = attendancePercentage;
      minAttendanceEvent = `${event.name} (${attendancePercentage.toFixed(
        2
      )}%)`;
    }

    if (event.capacity > maxCapacity) {
      maxCapacity = event.capacity;
      maxCapacityEvent = `${event.name} (${event.capacity})`;
    }
  });

  return { maxAttendanceEvent, minAttendanceEvent, maxCapacityEvent };
}

// Updates an HTML table with the attendance statistics obtained from findAttendanceStats
function actualizarTabla(data) {
  const attendanceStats = findAttendanceStats(data.events);

  const firstTd = document.querySelector(
    "#stats-table tr:nth-child(3) td:nth-child(1)"
  );
  firstTd.textContent = attendanceStats.maxAttendanceEvent;

  const secondTd = document.querySelector(
    "#stats-table tr:nth-child(3) td:nth-child(2)"
  );
  secondTd.textContent = attendanceStats.minAttendanceEvent;

  const thirdTd = document.querySelector(
    "#stats-table tr:nth-child(3) td:nth-child(3)"
  );
  thirdTd.textContent = attendanceStats.maxCapacityEvent;
}

// Filters events based on whether they are past or future events and calculates total revenue, attendance, and capacity by category, updating an HTML table with the calculated statistics
function mostrarCategorias(data, isPast) {
  const currentDate = new Date(data.currentDate);

  const filteredEvents = data.events.filter((event) => {
    const eventDate = new Date(event.date);
    return isPast ? eventDate < currentDate : eventDate > currentDate;
  });

  const categories = filteredEvents.reduce((acc, event) => {
    if (!acc.includes(event.category)) {
      acc.push(event.category);
    }
    return acc;
  }, []);

  const totalPricesAndAttendanceByCategory = filteredEvents.reduce(
    (acc, event) => {
      if (!acc[event.category]) {
        acc[event.category] = {
          totalPrice: 0,
          totalAttendance: 0,
          totalEstimate: 0,
        };
      }

      const attendance = event.assistance || event.estimate || 0;
      acc[event.category].totalPrice += event.price * attendance;
      acc[event.category][isPast ? "totalAttendance" : "totalEstimate"] +=
        attendance;

      return acc;
    },
    {}
  );

  const totalCapacityByCategory = filteredEvents.reduce((acc, event) => {
    if (!acc[event.category]) {
      acc[event.category] = 0;
    }
    acc[event.category] += event.capacity;
    return acc;
  }, {});

  const tableBody = document.querySelector("#stats-table tbody");
  const table = document.querySelector("#stats-table");
  const startingRow =
    document.querySelector(isPast ? "#past-table" : "#upcoming-table")
      .parentNode.rowIndex + 2;

  categories.forEach((category, index) => {
    const row = startingRow + index;
    const newRow = table.insertRow(row);
    const categoryCell = newRow.insertCell(0);
    categoryCell.textContent = category;
    const revenueCell = newRow.insertCell(1);
    revenueCell.textContent = `$${totalPricesAndAttendanceByCategory[category].totalPrice}`;
    const attendancePercentage = (
      (totalPricesAndAttendanceByCategory[category][
        isPast ? "totalAttendance" : "totalEstimate"
      ] /
        totalCapacityByCategory[category]) *
      100
    ).toFixed(2);
    const attendanceCell = newRow.insertCell(2);
    attendanceCell.textContent = `${attendancePercentage}%`;
  });
}

// Executes fetchData, actualizarTabla, and mostrarCategorias when the window is loaded
async function executeOnLoad() {
  const data = await fetchData();

  if (data) {
    actualizarTabla(data);
    mostrarCategorias(data, true); // For past events
    mostrarCategorias(data, false); // For future events
  }
}

// Adds an event listener to call the executeOnLoad function when the window is loaded
window.addEventListener("load", executeOnLoad);
