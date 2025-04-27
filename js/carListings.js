import Cars from "./classes/Cars.js";

const carsClass = new Cars();
await carsClass.ready;
const cars = carsClass.getAllCars();

const carsContainer = document.getElementById("car-cards-container");
const typesFilter = document.getElementById("typeFilter");
const brandsFilter = document.getElementById("brandFilter");
const minPriceFilter = document.getElementById("minPriceFilter");
const maxPriceFilter = document.getElementById("maxPriceFilter");
const brands = carsClass.carsBrands;
const types = carsClass.carsTypes;

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

showCards(cars);

//Filter Functionality

//Filter
document.getElementById("filter-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const brand = brandsFilter.value;
  const type = typesFilter.value;
  const minPrice = minPriceFilter.value
    ? Number(minPriceFilter.value)
    : undefined;
  const maxPrice = maxPriceFilter.value
    ? Number(maxPriceFilter.value)
    : undefined;

  const filteredCars = carsClass.filterCars({
    type,
    minPrice,
    maxPrice,
    brand,
  });
  showCards(filteredCars);
});

//Reset
document.getElementById("reset-filter").addEventListener("click", () => {
  brandsFilter.value = "all";
  typesFilter.value = "all";
  minPriceFilter.value = undefined;
  maxPriceFilter.value = undefined;
  showCards(cars);
});

//////////////////////////////

function showCards(cars) {
  carsContainer.innerHTML = "";

  cars.forEach((car) => {
    const col = document.createElement("div");
    col.className = "col-sm-1 col-md-6 col-lg-4";

    col.innerHTML = `
        <div class="car-card">
          <img src="${car.images[0]}" alt="${car.brand} ${car.model}">
          <div class="car-card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="car-card-title mb-0">${car.brand}</h5>
              <span class="car-card-price">$${
                car.pricePerDay
              } <small class="text-muted">/ day</small></span>
            </div>
            <p class="text-muted mb-3">${car.type}</p>
    
            <div class="car-card-features">
              ${car.features
                .map(
                  (f) =>
                    `<div><i class="bi bi-check-circle me-1"></i> ${f}</div>`
                )
                .join("")}
            </div>
    
            <a href="#" class="car-card-btn">View Details</a>
          </div>
        </div>
      `;

    carsContainer.appendChild(col);
  });
}
