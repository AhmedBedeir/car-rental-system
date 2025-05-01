import Booking from "./classes/booking.js";
import Users from "./classes/Users.js";

let bookings = [];
let currentNumber = 0;

/* Get Booking Details */
const getBookingDetails = async () => {
  const data = new Booking();
  const dataUser = new Users();
  const userId = dataUser.currentUser;
  await data.ready;
  return data.getBookingDetails(userId);
};

/* Get Bookings */
const getBookings = async () => {
  try {
    bookings = await getBookingDetails();
    console.log(bookings);

    if (bookings.length === 0) {
      document.querySelector("#booking").classList.add("d-none");
      document.querySelector(".booking-empty-state").classList.remove("d-none");
      console.log("No bookings found");

      return;
    }

    if (bookings.length > 1) {
      createButtons();
    }

    displayBooking(currentNumber);
  } catch (error) {
    console.error("Error fetching booking details:", error);
  }
};

/* Display Booking */
const displayBooking = (index) => {
  const booking = bookings[index];

  if (!booking) return;

  // Display car status
  const statusElement = document.querySelector("#booking .badge");
  statusElement.innerHTML = booking.status;
  statusElement.className = "badge"; // Reset classes
  if (booking.status === "pending") {
    statusElement.classList.add("pending");
  } else if (booking.status === "confirmed") {
    statusElement.classList.add("confirmed");
  }

  // Display car image
  let carImage = booking?.car?.imageCover || booking?.car?.images?.[0];
  document.querySelector(".card-img").innerHTML = carImage
    ? `<figure>
         <img src="${carImage}" alt="Car Image" />
         <figcaption>
           <h5>${booking.car.brand} ${booking.car.model}</h5>
           <span>${booking.car.type} ${booking.car.year}</span>
         </figcaption>
       </figure>`
    : "No image available";

  // Display dates
  document.querySelector(".pick-up-date").innerHTML = booking.pickupDate;
  document.querySelector(".return-date").innerHTML = booking.returnDate;

  // Display customer info
  document.querySelector(".customer-name").innerHTML =
    booking?.user?.name || "N/A";
  document.querySelector(".customer-email").innerHTML =
    booking?.user?.email || "N/A";
  document.querySelector(".customer-phone").innerHTML =
    booking?.user?.phone || "N/A";

  // Display payment summary

  const total = (booking?.car?.pricePerDay || 0) * (booking?.numberOfDays || 0);

  document.querySelector("#booking .daily-rate span").innerHTML =
    booking?.car.pricePerDay || "N/A";
  document.querySelector("#booking .total span").innerHTML = total || "N/A";
  document.querySelector("#booking .num-days span").innerHTML =
    booking?.numberOfDays || "N/A";
};

/* Create Buttons */
const createButtons = () => {
  const btnsContainer = document.querySelector("#booking .btns");
  btnsContainer.innerHTML = "";

  // Create Previous Button
  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.addEventListener("click", handlePrevious);
  btnsContainer.appendChild(prevButton);

  // Create Index Buttons
  bookings.forEach((_, index) => {
    const indexButton = document.createElement("button");
    indexButton.textContent = index + 1;
    indexButton.classList.add("index-btn");

    indexButton.addEventListener("click", () => handleIndexClick(index));
    btnsContainer.appendChild(indexButton);
  });

  // Make First Button Active
  document.querySelector(".btns .index-btn")?.classList.add("active");

  // Create Next Button
  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.addEventListener("click", handleNext);
  btnsContainer.appendChild(nextButton);
};

/* Handle Buttons */
const handlePrevious = () => {
  if (currentNumber > 0) {
    currentNumber--;
    updateActiveButton();
    displayBooking(currentNumber);
  }
};

/* Handle Buttons */
const handleNext = () => {
  if (currentNumber < bookings.length - 1) {
    currentNumber++;
    updateActiveButton();
    displayBooking(currentNumber);
  }
};

/* Handle Buttons */
const handleIndexClick = (index) => {
  currentNumber = index;
  updateActiveButton();
  displayBooking(currentNumber);
};

/* Update Active Button */
const updateActiveButton = () => {
  const allIndexButtons = document.querySelectorAll(".btns .index-btn");

  allIndexButtons.forEach((btn, idx) => {
    btn.classList.toggle("active", idx === currentNumber);
  });
};

getBookings();
