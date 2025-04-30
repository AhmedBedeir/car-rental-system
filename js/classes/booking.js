import Cars from "./Cars.js";
import Users from "./Users.js";

class Booking {
  constructor() {
    this.bookings = [];
    this.ready = this.loadBookings();
  }

  saveToLocalStorage() {
    localStorage.setItem("bookings", JSON.stringify(this.bookings));
  }
  // load bookings
  async loadBookings() {
    const storedBookings = localStorage.getItem("bookings");
    if (storedBookings) {
      this.bookings = JSON.parse(storedBookings);
    } else {
      // If not, fetch from JSON file and store in localStorage
      try {
        const response = await fetch("../data/bookings.json");
        if (!response.ok) {
          throw new Error("Failed to fetch bookings data");
        }
        const data = await response.json();
        this.bookings = data.bookings;
        this.saveToLocalStorage();
      } catch (error) {
        console.error("Error loading bookings data:", error);
      }
    }
  }

  getBookings() {
    this.bookings.forEach((booking) => {
      //user
      const users = new Users();
      const user = users.getUserById(String(booking.userId));
      booking.user = user;
      // Car
      const cars = new Cars();
      const car = cars.getCarById(String(booking.carId));
      booking.car = car;
    });

    return this.bookings;
  }

  getBookingDetails(userId) {
    try {
      const userBookings = this.bookings.filter(
        (booking) => booking.userId == userId
      );

      if (!userBookings) {
        return null;
      }

      const users = new Users();
      const cars = new Cars();

      userBookings.forEach((booking) => {
        //user
        const user = users.getUserById(String(booking.userId));
        booking.user = user;
        // Car
        const car = cars.getCarById(String(booking.carId));
        booking.car = car;
      });

      return userBookings;
    } catch (error) {
      console.error("Error fetching booking details:", error);
      throw error;
    }
  }
}

export default Booking;
