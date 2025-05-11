import { getSelectedCar } from "./Display.js";
import { showToast } from "./uiHelpers.js";

//Check car is available for booking
export function checkCarAvailability() {
  // const car = getSelectedCar();
  // const carId = car.id;
  // if (car.available === false) {
  //   displayUnavailableMessage();
  //   hideBookingElements();
  //   return;
  // }
  // const allBookings = window.bookingClass.getBookings();
  // const today = new Date();
  // const activeBooking = allBookings.find((booking) => {
  //   if (!booking || booking.carId !== carId) return false;
  //   try {
  //     const returnDate = new Date(booking.returnDate);
  //     const isFutureBooking = returnDate >= today;
  //     return isFutureBooking;
  //     // && booking.status === "confirmed"; // Only block confirmed bookings
  //   } catch {
  //     return false;
  //   }
  // });
  // if (activeBooking) {
  //   displayUnavailableMessage(activeBooking);
  //   hideBookingElements();
  // }
}

export function displayUnavailableMessage(
  booking,
  targetSelector = ".booking-msg"
) {
  try {
    // Clear existing alerts first to avoid UI issues
    clearExistingAlerts();

    // Create and configure the alert container
    const alertContainer = createAlertContainer();

    // Generate appropriate message content
    const messageContent = generateUnavailableMessage(booking);
    alertContainer.innerHTML = messageContent;

    // Display the message in the target container
    displayMessage(alertContainer, targetSelector);
  } catch (error) {
    console.error("Failed to display unavailable message:", error);
    displayFallbackMessage(targetSelector);
  }
}

// Helper functions

function clearExistingAlerts() {
  const existingAlerts = document.querySelectorAll(".alert.alert-warning");
  existingAlerts.forEach((alert) => alert.remove());
}

function createAlertContainer() {
  const container = document.createElement("div");
  container.className = "alert alert-warning mt-3";
  container.role = "alert";
  return container;
}

function generateUnavailableMessage(booking) {
  if (!booking || !booking.returnDate) {
    return getMaintenanceMessage();
  }

  try {
    return getBookingMessage(booking.returnDate);
  } catch (error) {
    console.error("Invalid return date format:", error);
    return getGenericUnavailableMessage();
  }
}

function getBookingMessage(returnDateString) {
  const returnDate = new Date(returnDateString);
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return `
    <h4 class="alert-heading">Car Currently Booked</h4>
    <p>This vehicle will be available after:</p>
    <div class="fw-bold mb-2">
      ${returnDate.toLocaleDateString("en-US", options)}
    </div>
    <p>Please check back after this date to rent again.</p>
  `;
}

function getGenericUnavailableMessage() {
  return `
    <h4 class="alert-heading">Vehicle Unavailable</h4>
    <p>This car is currently booked by another user.</p>
  `;
}

function getMaintenanceMessage() {
  return `
    <h4 class="alert-heading">Vehicle Unavailable</h4>
    <p>This car is temporarily out of service for maintenance.</p>
    <p class="mb-0">Please check back later or contact support.</p>
  `;
}

function displayMessage(alertElement, targetSelector) {
  const targetContainer = document.querySelector(targetSelector);
  if (!targetContainer) {
    throw new Error(`Target container not found: ${targetSelector}`);
  }
  targetContainer.innerHTML = "";
  targetContainer.appendChild(alertElement);
}

function displayFallbackMessage(targetSelector) {
  const targetContainer = document.querySelector(targetSelector);
  if (targetContainer) {
    targetContainer.innerHTML = `
      <div class="alert alert-danger mt-3" role="alert">
        <h4 class="alert-heading">Error</h4>
        <p>Unable to display availability information.</p>
        <p class="mb-0">Please try again later.</p>
      </div>
    `;
  }
}

//Hide elements when car is unavailable
export function hideBookingElements() {
  const calendarElement = document.getElementById("calendar");
  const calendarContainer = document.querySelector(".booking-calendar");
  if (calendarElement) {
    calendarElement.style.display = "none";
  }

  if (calendarContainer) {
    calendarContainer.style.display = "none";
  }

  const loginSignup = document.getElementById("login-signup");
  const loginSignupContainer = document.querySelector(".auth-form-container");
  if (loginSignup) {
    loginSignup.style.display = "none";
  }

  if (loginSignupContainer) {
    loginSignupContainer.style.display = "none";
  }

  const rentBtn = document.getElementById("rent-btn");
  if (rentBtn) {
    rentBtn.style.display = "none";
  }
}

//(make button ready to handle booking after auth)
export function setupBookingSystem() {
  const rentButton = document.getElementById("rent-btn");

  rentButton.removeEventListener("click", handleBooking);
  rentButton.addEventListener("click", handleBooking);
}

// Handle booking
export function handleBooking() {
  const currentUser = window.usersClass.getCurrentUser();
  if (!currentUser) {
    return showToast("Please log in to rent a car", "danger");
  }

  const car = getSelectedCar();
  if (!car) {
    window.carNotFoundRedirect();
  }

  const [pickupDate, returnDate] = getSortedSelectedDates();
  if (!pickupDate || !returnDate) {
    return showToast("Please select pickup and return dates", "warning");
  }

  if (isCarAlreadyBooked(car.id, pickupDate, returnDate)) {
    return showToast(
      "This car is already booked for the selected dates. Please choose another time.",
      "danger"
    );
  }
  if (isSameDay(pickupDate, returnDate)) {
    return showToast(
      "Pickup and return dates cannot be the same day",
      "warning"
    );
  }

  if (isDuplicateBooking(car.id, pickupDate, returnDate)) {
    return showToast(
      "You already have a booking for this car during these dates",
      "warning"
    );
  }

  const totalAmount = calculateTotalAmount(
    pickupDate,
    returnDate,
    car.pricePerDay
  );
  const booking = window.bookingClass.buildBooking(
    car.id,
    currentUser.id,
    pickupDate,
    returnDate,
    car.pricePerDay
  );

  bookingClass.bookings.push(booking);
  bookingClass.saveToLocalStorage();
  checkCarAvailability();
  showToast(`Booking successful! Total: $${totalAmount}`, "success");
}

// دالة جديدة للتحقق من وجود حجز للسيارة في نفس الفترة
function isCarAlreadyBooked(carId, pickupDate, returnDate) {
  const existingBookings = bookingClass.bookings.filter(
    (booking) => booking.carId === carId
  );

  return existingBookings.some((booking) => {
    const bookedPickup = new Date(booking.pickupDate);
    const bookedReturn = new Date(booking.returnDate);
    const newPickup = new Date(pickupDate);
    const newReturn = new Date(returnDate);

    // تحقق إذا كانت الفترات متداخلة
    return (
      (newPickup >= bookedPickup && newPickup <= bookedReturn) ||
      (newReturn >= bookedPickup && newReturn <= bookedReturn) ||
      (newPickup <= bookedPickup && newReturn >= bookedReturn)
    );
  });
}

//Get dates and sort
export function getSortedSelectedDates() {
  if (
    !calendar ||
    !calendar.context ||
    !calendar.context.selectedDates ||
    calendar.context.selectedDates.length < 2
  ) {
    return [];
  }
  try {
    const dates = calendar.context.selectedDates
      .map((dateStr) => {
        if (!dateStr || typeof dateStr !== "string") {
          return null;
        }

        const [year, month, day] = dateStr.split("-");
        const dateObj = new Date(year, month - 1, day);

        if (isNaN(dateObj.getTime())) {
          return null;
        }

        const selectedTime = calendar.context.selectedTime;

        // Parse 12-hour time (e.g., "04:00 PM") into 24-hour format
        //  to send to booking object
        if (typeof selectedTime === "string") {
          const [time, period] = selectedTime.split(" ");
          let [hours, minutes] = time.split(":").map(Number);

          if (period === "PM" && hours !== 12) {
            hours += 12; // Convert PM to 24-hour (except 12 PM)
          } else if (period === "AM" && hours === 12) {
            hours = 0; // 12 AM becomes 00:00
          }

          dateObj.setHours(hours, minutes, 0, 0);
        } else {
          // Default to 00:00 if time is not returned for whatever reason
          dateObj.setHours(0, 0, 0, 0);
        }

        return dateObj;
      })
      .filter((date) => date !== null);

    return dates.sort((a, b) => a - b);
  } catch (error) {
    console.error("Error processing dates:", error);
    return [];
  }
}

//Check dates are the same
export function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

//Check for duplicate booking for these cars
export function isDuplicateBooking(carId, pickupDate, returnDate) {
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  const currentUser = window.usersClass.getCurrentUser();

  return bookings.some((booking) => {
    if (booking.carId !== carId || booking.userId !== currentUser.id) {
      return false;
    }

    const existingPickup = new Date(booking.pickupDate);
    const existingReturn = new Date(booking.returnDate);

    // Check for date overlap
    return (
      // New booking starts during an existing booking
      (pickupDate >= existingPickup && pickupDate <= existingReturn) ||
      // New booking ends during an existing booking
      (returnDate >= existingPickup && returnDate <= existingReturn) ||
      // New booking encompasses an existing booking
      (pickupDate <= existingPickup && returnDate >= existingReturn)
    );
  });
}

//Calculate the total amount for booking
export function calculateTotalAmount(startDate, endDate, pricePerDay) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const durationDays = Math.ceil((endDate - startDate) / msPerDay);
  return durationDays * pricePerDay;
}
