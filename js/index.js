import Cars from "./classes/Cars.js";
import Users from "./classes/Users.js";
import { implementDarkMode } from "./dark-mode.js";
import { initFooter } from "./footer.js";
import { initNav } from "./navbar.js";

const cars = new Cars();
await cars.ready;
// console.log(cars.getAllCars());

const users = new Users();
await users.ready;
// console.log(users.getUsers());

initNav();

initFooter();
implementDarkMode();
