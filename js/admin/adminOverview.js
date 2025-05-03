import Cars from "../classes/Cars.js";
import Booking from "../classes/booking.js";
import { overviewCard } from "../helpers.js";

const cars = new Cars();
const booking = new Booking();
await cars.ready;
await booking.ready;

// OVERVIEW CARS
const overviewCarsNumbers = cars.overviewCarsNumbers();
const overViewCarsBrands = cars.overViewCarsBrands();
const overViewCarsModels = cars.overViewCarsModels();

// OVERVIEW BOOKINGS
const overViewBookingsNumbers = booking.overViewNumbers();
const overViewAnalysis = booking.overViewAnalysis();

const cardsContainer = document.getElementById("cards-container");
const carBrandsChart = document.getElementById("brandsChart");
const carModelsChart = document.getElementById("modelsChart");
const bookingStatusesChart = document.getElementById("bookingChart");

const overViewCardsData = [
  {
    icon: `<i class="fa-solid fa-car"></i>`,
    title: "Total Cars",
    value: overviewCarsNumbers.totalCars,
    small: `${overviewCarsNumbers.bookedCars} currently booked`,
  },
  {
    icon: `<i class="fa-solid fa-car-side"></i>`,
    title: "Available Cars",
    value: overviewCarsNumbers.availableCars,
    small: `${overviewCarsNumbers.availableCarsPercentage}% available`,
  },
  {
    icon: `<i class="fa-solid fa-bookmark"></i>`,
    title: "Total Bookings",
    value: overViewBookingsNumbers.totalBookings,
    small: `${overViewBookingsNumbers.pendingBookings} pending bookings`,
  },
  {
    icon: `<i class="fa fa-calendar-check"></i>`,
    title: "Active Bookings",
    value: overViewBookingsNumbers.activeBookings,
    small: `${overViewBookingsNumbers.endingBookings} ending bookings`,
  },
];

overViewCardsData.forEach((card) => {
  cardsContainer.insertAdjacentHTML("beforeend", overviewCard(card));
});

const backgroundColors = [
  "rgb(255, 99, 132)",
  "rgb(54, 162, 235)",
  "rgb(255, 205, 86)",
  "rgb(153, 102, 255)",
  "rgb(255, 159, 64)",
  "rgb(75, 192, 192)",
];
// FR first Chart
new Chart(carBrandsChart, {
  type: "pie",
  data: {
    labels: overViewCarsBrands.labels,
    datasets: [
      {
        label: "Number of Cars",
        data: overViewCarsBrands.data,
        backgroundColor: backgroundColors,
        hoverOffset: 4,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Cars by Brand",
      },
    },
  },
});

// FR Second Chart
new Chart(carModelsChart, {
  type: "doughnut",
  data: {
    labels: overViewCarsModels.labels,
    datasets: [
      {
        label: "Number of Cars",
        data: overViewCarsModels.data,
        backgroundColor: backgroundColors,
        hoverOffset: 4,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Cars by Model",
      },
    },
  },
});

// SR First Chart
new Chart(bookingStatusesChart, {
  type: "bar",
  data: {
    labels: Object.keys(overViewAnalysis),
    datasets: [
      {
        label: "Number of Bookings",
        data: Object.values(overViewAnalysis),
        backgroundColor: backgroundColors,
        hoverOffset: 4,
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Booking Statuses",
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  },
});
