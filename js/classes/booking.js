import Cars from "./Cars.js";
import Users from "./Users.js";

class Booking {
  constructor(customer, car, startDate, endDate) {
    this.customer = customer;
    this.car = car;
    this.startDate = startDate;
    this.endDate = endDate;
  }
  async getBookingDetails(userId) {
    try {
      const booking = await fetch(`../data/bookings.json`);
      const data = await booking.json();

      const userBookings = data.bookings.find(
        (booking) => booking.userId === userId
      );

      if (!userBookings) {
        return null;
      }

      const users = new Users();
      const user = await users.getUserById(String(userBookings.userId));
      userBookings.user = user;

      const cars = new Cars();
      const car = await cars.getCarById(String(userBookings.userId));
      userBookings.car = car;
      return userBookings;
    } catch (error) {
      console.error("Error fetching booking details:", error);
      throw error;
    }
  }
}

export default Booking;
