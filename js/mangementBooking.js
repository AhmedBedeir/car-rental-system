import Booking from "./classes/booking.js";

const bookingList = new Booking();

await bookingList.ready;

const bookings = bookingList.getBookings();

const bookingTableBody = document.getElementById("booking-data");

// Status options for the dropdown

const status_options = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

// Single booking

const bookingRow = (booking) => {
  return `
    <tr>
      <td>${booking.booking_id}</td>
      <td>
        <div class="user-info">
          <span class="name">${booking.user.name}</span>
          <span class="username">@${booking.user.username}</span>
        </div>
      </td>
      <td>
        <div class="car-info">
          <span class="model">${booking.car.brand} ${booking.car.model}</span>
          <span class="details">${booking.car.year} • ${booking.car.type}</span>
        </div>
      </td>
      <td>${booking.pickupDate}</td>
      <td>${booking.returnDate}</td>
      <td>${booking.numberOfDays}</td>
      <td>$${booking.total}</td>
      <td>
        ${statusDropdown(booking)}
      </td>
    </tr>
  `;
};

/* Status dropdown */

const statusDropdown = (booking) => {
  let optionsContainer = "";

  for (const option of status_options) {
    optionsContainer += `
      <option value="${option.value}" 
              ${booking.status === option.value ? "selected" : ""}>
        ${option.label}
      </option>
    `;
  }

  return `
    <select class="status-select ${booking.status}" 
                data-booking-id="${booking.booking_id}"
            onchange="updateStatus(${booking.booking_id}, this.value)">
      ${optionsContainer}
    </select>
  `;
};

/* Display all bookings */
const displayBookings = () => {
  bookingTableBody.innerHTML = "";

  bookings.forEach((booking) => {
    const row = bookingRow(booking);
    bookingTableBody.innerHTML += row;
  });
};

/* Function to update booking status */

/*

    - get booking from local storage
    - convert string to object
    - find booking by id
    - update status
    - save to local storage
    - update dropdown

*/
const updateStatus = (bookingId, newStatus) => {
  const bookingsStr = localStorage.getItem("bookings");
  if (!bookingsStr) {
    console.error("No bookings found in localStorage");
    return;
  }

  const bookings = JSON.parse(bookingsStr);

  const booking = bookings.find((b) => b.booking_id === bookingId);

  if (!booking) {
    console.error(`Booking with ID ${bookingId} not found`);
    return;
  }

  booking.status = newStatus;

  localStorage.setItem("bookings", JSON.stringify(bookings));

  const selectElement = document.querySelector(
    `select[data-booking-id="${bookingId}"]`
  );

  if (selectElement) {
    selectElement.className = `status-select ${newStatus}`;
    selectElement.value = newStatus;
  }

  console.log(`Successfully updated booking`);
};

window.updateStatus = updateStatus;

displayBookings();
