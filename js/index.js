import Cars from "./classes/Cars.js";
import Users from "./classes/Users.js";

const cars = new Cars();
await cars.ready;
// console.log(cars.getAllCars());

const users = new Users();
await users.ready;
// console.log(users.getUsers());
