function getSelectedCar() {
  const carId = new URLSearchParams(window.location.search).get("car_id");
  return carId;
}

let calendar;

document.addEventListener("DOMContentLoaded", () => {
  let disabledDates = [];
  try {
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    disabledDates = processBookings(bookings);
    console.log("Disabled Dates:", disabledDates);
  } catch (e) {
    console.error("Error loading bookings:", e);
  }

  const { Calendar } = window.VanillaCalendarPro;
  calendar = new Calendar("#calendar", {
    dateMin: "today",
    selectedTheme: "light",
    selectionTimeMode: 12,
    selectionDatesMode: "multiple-ranged",
    disableDates: disabledDates,

    onClickDate(self, date) {
      const disabled = self.settings?.disabledDates || [];
      if (disabled.includes(date)) {
        console.warn("this date is disabled:", date);
        return false;
      }
      console.log("Date clicked:", date);
    },

    onInit(self) {
      setTimeout(() => {
        document
          .querySelectorAll(".vanilla-calendar-day--booked")
          .forEach((el) => {
            el.style.pointerEvents = "none";
            el.style.cursor = "not-allowed";
          });
      }, 200);
    },
  });

  calendar.init();
});

function processBookings(bookings) {
  if (!Array.isArray(bookings)) return [];

  const singleBook = bookings.find(
    (booking) => booking.carId === getSelectedCar()
  );
  const dates = new Set();

  if (singleBook.carId !== getSelectedCar()) return;

  try {
    if (!singleBook.pickupDate || !singleBook.returnDate) return;
    const start = parseCustomDate(singleBook.pickupDate);
    const end = parseCustomDate(singleBook.returnDate);
    let current = new Date(start);

    while (current <= end) {
      dates.add(formatDate(current));
      current.setDate(current.getDate() + 1);
    }
  } catch (e) {
    console.warn("Error processing singleBook:", singleBook, e);
  }

  return Array.from(dates).sort();
}

function parseCustomDate(dateStr) {
  const [datePart, timePart] = dateStr.split(", ");
  const [month, day, year] = datePart.split("/").map(Number);
  const [time, period] = timePart.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return new Date(year, month - 1, day, hours, minutes);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
