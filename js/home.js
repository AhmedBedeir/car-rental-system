import Cars from "./classes/Cars.js";
import Users from "./classes/Users.js";
import showCards from "./helpers.js";

const cars = new Cars();
await cars.ready;

const users = new Users();
await users.ready;

const carsContainer = document.getElementById("car-cards-container");
const carDetailsPath = "./pages/carDetails.html";

showCards(cars.getAllCars().slice(0, 6), carsContainer, carDetailsPath);
