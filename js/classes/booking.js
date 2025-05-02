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
        const response = await fetch("../../data/bookings.json");
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
      // User
      const users = new Users();
      const user = users.getUserById(String(booking.userId));
      booking.user = user;

      // Car
      const cars = new Cars();
      const car = cars.getCarById(String(booking.carId));

      // Check if return date is in the past
      const returnDate = new Date(booking.returnDate);
      const now = new Date();

      if (returnDate < now) {
        car.available = true;
        booking.status = "completed";
      } else {
        car.available = false;
      }

      booking.car = car;
    });

    return this.bookings;
  }

  getBookingDetails(user) {
    console.log(this.bookings);
    try {
      const userBookings = this.bookings.filter(
        (booking) => booking.userId == user?.id
      );

      if (!userBookings) {
        return null;
      }

      this.bookings.forEach((booking) => {
        // User
        const users = new Users();
        const user = users.getUserById(String(booking.userId));
        booking.user = user;

        // Car
        const cars = new Cars();
        const car = cars.getCarById(String(booking.carId));

        // Check if return date is in the past
        const returnDate = new Date(booking.returnDate);
        const now = new Date();

        if (returnDate < now) {
          car.available = true;
          booking.status = "completed";
        } else {
          car.available = false;
        }

        booking.car = car;
      });
      return userBookings;
    } catch (error) {
      console.error("Error fetching booking details:", error);
      throw error;
    }
  }

//make a booking object
buildBooking(carId, userId, pickupDate, returnDate, pricePerDay) {
  const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
  };
  
  const msPerDay = 1000 * 60 * 60 * 24;
  const numberOfDays = Math.ceil((returnDate - pickupDate) / msPerDay);
  const total = numberOfDays * pricePerDay;
  
  let lastBookingId = 0;
  if (this.bookings.length > 0) {
    const bookingIds = this.bookings.map(booking => {
        if (booking.booking_id) {
            return booking.booking_id;
        } else {
            return 0;
        }
    });

    lastBookingId = Math.max(...bookingIds);
}
  
  return {
      booking_id: lastBookingId + 1,
      carId,
      userId,
      pickupDate: pickupDate.toLocaleString('en-US', options),
      returnDate: returnDate.toLocaleString('en-US', options),
      numberOfDays,
      total,
      status: 'pending'
  };
}
}

export default Booking;
