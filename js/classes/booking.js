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
    const booking = await fetch(`../data/bookings.json`);
    const data = await booking.json();
    this.bookings = data.bookings;

    try {
      if (!localStorage.getItem("bookings")) {
        const booking = await fetch(`../data/bookings.json`);
        const data = await booking.json();
        this.bookings = data.bookings;
        this.saveToLocalStorage();
      } else {
        this.bookings = JSON.parse(localStorage.getItem("bookings"));
      }
    } catch (error) {
      console.error("Error loading initial booking data:", error);
    }
  }

  getBookings() {
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
