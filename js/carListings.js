import Cars from "./classes/Cars.js";
import { showCards } from "./helpers.js";

const carsClass = new Cars();
await carsClass.ready;
const cars = carsClass.getAllCars();

const carsContainer = document.getElementById("car-cards-container");
const typesFilter = document.getElementById("typeFilter");
const brandsFilter = document.getElementById("brandFilter");
const minPriceFilter = document.getElementById("minPriceFilter");
const maxPriceFilter = document.getElementById("maxPriceFilter");
const availableFilter = document.getElementById("availableFilter");
const brands = carsClass.carsBrands;
const types = carsClass.carsTypes;
const searchInput = document.getElementById("searchInput");
const carDetailsPath = "./carDetails.html";

// Fill DropDowns
brands.forEach((brand) => {
  const option = document.createElement("option");
  option.value = brand;
  option.innerHTML = brand;
  brandsFilter.appendChild(option);
});

types.forEach((type) => {
  const option = document.createElement("option");
  option.value = type;
  option.innerHTML = type;
  typesFilter.appendChild(option);
});

showCards(cars, carsContainer, carDetailsPath);

//Filter Functionality

//Filter
document.getElementById("filter-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const brand = brandsFilter.value;
  const type = typesFilter.value;
  const minPrice = minPriceFilter.value;
  console.log(availableFilter.checked);
  const available =
    availableFilter.checked === true
      ? true
      : undefined
      ? Number(minPriceFilter.value)
      : undefined;
  const maxPrice = maxPriceFilter.value
    ? Number(maxPriceFilter.value)
    : undefined;

  const filteredCars = carsClass.filterCars({
    type,
    minPrice,
    maxPrice,
    available,
    brand,
  });

  showCards(filteredCars, carsContainer, carDetailsPath);
});

//Reset
document.getElementById("reset-filter").addEventListener("click", () => {
  brandsFilter.value = "all";
  typesFilter.value = "all";
  minPriceFilter.value = undefined;
  maxPriceFilter.value = undefined;
  availableFilter.checked = false;

  showCards(cars, carsContainer, carDetailsPath);
});

//Search Functionality
searchInput.addEventListener("input", () => {
  const searchText = searchInput.value;
  const searchedCars = carsClass.searchCars(searchText);

  showCards(searchedCars, carsContainer, carDetailsPath);
});
