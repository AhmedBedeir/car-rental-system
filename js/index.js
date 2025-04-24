import Cars from "./Cars.js";

async function loadAllCars() {
  const cars = new Cars();
  const allCars = await cars.getAllCars();
  console.log(allCars);
}
loadAllCars();
