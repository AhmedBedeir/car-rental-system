import Booking from "../classes/booking.js";

export const getBookingDetails = async (userId) => {
  return await new Booking().getBookingDetails(userId);
};
