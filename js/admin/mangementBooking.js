import Booking from "../classes/booking.js";

const bookingList = new Booking();

await bookingList.ready;

console.log(bookingList);
const bookings = bookingList.getBookings();

const bookingTableBody = document.getElementById("booking-data");

// Status options for the dropdown

const status_options = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
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
                    <span class="model">${
                      booking.car.available
                        ? "Available"
                        : "Booked or Unavailable"
                    } </span>

        </div>
      </td>
      <td>${booking.pickupDate}</td>
      <td>${booking.returnDate}</td>
      <td>${booking.numberOfDays}</td>
      <td>$${booking.car.pricePerDay * booking.numberOfDays}</td>
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
  console.log(bookingList);
  const booking = bookingList.bookings.find((b) => b.booking_id === bookingId);

  if (!booking) {
    console.error(`Booking with ID ${bookingId} not found`);
    return false;
  }

  // if (newStatus === "cancelled") {
  //   booking.car.available = true;
  //   booking.pickupDate = null;
  //   booking.returnDate = null;
  // } else if (newStatus === "completed") {
  //   booking.car.available = true;
  // }
  if (newStatus === "cancelled") {
    booking.car.available = true;
    booking.pickupDate = null;
    booking.returnDate = null;
  } else if (
    newStatus === "completed" ||
    booking.pickupDate === null ||
    booking.returnDate === null
  ) {
    booking.car.available = true;
  }

  booking.status = newStatus;

  try {
    localStorage.setItem("bookings", JSON.stringify(bookingList.bookings));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
    return false;
  }

  const selectElement = document.querySelector(
    `select[data-booking-id="${bookingId}"]`
  );

  if (selectElement) {
    selectElement.className = `status-select ${newStatus}`;
    selectElement.value = newStatus;
  }
  console.log(selectElement);

  return true;
};

window.updateStatus = updateStatus;

displayBookings();
