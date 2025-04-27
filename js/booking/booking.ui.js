import { getBookingDetails } from "./booking.controller.js";

export const getBooking = async () => {
  const bookings = await getBookingDetails(2);
  console.log(bookings);
  await displayImageCar(bookings);
};

const displayImageCar = async (bookings) => {
  let carImage = await bookings?.car.imageCover;
  if (!carImage) {
    carImage = bookings.car.images[0];
    document.querySelector(".card-img").innerHTML = `<figure>
            <img src="${carImage}" alt="Car Image" />
            <figcaption>
              <h5>${bookings.car.brand} ${bookings.car.model}</h5>
              <span>${bookings.car.type} ${bookings.car.year}</span>
            </figcaption>
          </figure>`;
  } else {
    console.log("Car image is not available");
  }
};
