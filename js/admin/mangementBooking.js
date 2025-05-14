import Booking from "../classes/booking.js";
import Cars from "../classes/Cars.js";

const bookingList = new Booking();

await bookingList.ready;

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
  const now = new Date();
  const returnDate = booking.returnDate ? new Date(booking.returnDate) : null;
  const isBookingCompleted = returnDate && returnDate <= now;
  const isFinalState = ["completed", "cancelled"].includes(booking.status);

  for (const option of status_options) {
    const isSelected = booking.status === option.value;

    let shouldDisable = false;

    if (isFinalState) {
      shouldDisable = option.value !== booking.status;
    } else if (option.value === "completed") {
      shouldDisable = !isBookingCompleted;
    } else if (booking.status === "confirmed" && option.value === "pending") {
      shouldDisable = true;
    } else if (booking.status === "pending" && option.value === "completed") {
      shouldDisable = true;
    }

    optionsContainer += `
      <option value="${option.value}" 
              ${isSelected ? "selected" : ""}
              ${shouldDisable ? "disabled" : ""}>
        ${option.label}
      </option>
    `;
  }

  return `
    <select class="status-select ${booking.status}" 
            data-booking-id="${booking.booking_id}"
            onchange="updateStatus(${booking.booking_id}, this.value)"
            ${isFinalState ? "disabled" : ""}>
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

  const now = new Date();
  const returnDate = booking.returnDate ? new Date(booking.returnDate) : null;

  if (newStatus === "completed" && (!returnDate || returnDate > now)) {
    alert("Cannot complete the booking before the return date.");
    return false;
  }

  if (newStatus === "cancelled") {
    booking.car.available = true;
    booking.pickupDate = null;
    booking.returnDate = null;
  } else if (
    newStatus === "completed" ||
    booking.pickupDate === null ||
    booking.returnDate === null ||
    returnDate < now
  ) {
    booking.car.available = true;
  } else if (newStatus === "confirmed") {
    booking.car.available = false;
  }
  const cars = new Cars();
  const car = cars.getCarById(String(booking.carId));
  car.available = false;
  console.log(car);
  cars.saveToLocalStorage();

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

  return true;
};

window.updateStatus = updateStatus;

displayBookings();
