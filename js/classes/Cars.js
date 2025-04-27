import { carBrands, carModels, carTypes } from "../constants.js";

class Cars {
  constructor() {
    this.cars = [];
    this.carsModels = carModels;
    this.carsBrands = carBrands;
    this.carsTypes = carTypes;
    this.ready = this.loadInitialData();
  }

  saveToLocalStorage() {
    localStorage.setItem("cars", JSON.stringify(this.cars));
  }

  // handle initial data loading
  async loadInitialData() {
    try {
      if (!localStorage.getItem("cars")) {
        const response = await fetch("../data/cars.json");
        const data = await response.json();
        this.cars = data;
        this.saveToLocalStorage();
      } else {
        this.cars = JSON.parse(localStorage.getItem("cars"));
      }
    } catch (error) {
      console.error("Error loading initial car data:", error);
    }
  }

  getAllCars() {
    return this.cars;
  }

  getCarById(id) {
    return this.cars.find((car) => car.id === id);
  }

  filterCars({ type, minPrice, maxPrice, available, model, brand }) {
    return this.cars.filter((car) => {
      let matchesFilter = true;

      if (type && type !== "all") {
        matchesFilter = matchesFilter && car.type === type;
      }

      if (model && model !== "all") {
        matchesFilter = matchesFilter && car.model === model;
      }

      if (brand && brand !== "all") {
        matchesFilter = matchesFilter && car.brand === brand;
      }

      if (minPrice !== undefined && minPrice !== null) {
        matchesFilter = matchesFilter && car.pricePerDay >= minPrice;
      }

      if (maxPrice !== undefined && maxPrice !== null) {
        matchesFilter = matchesFilter && car.pricePerDay <= maxPrice;
      }

      if (available !== undefined) {
        matchesFilter = matchesFilter && car.available === available;
      }

      return matchesFilter;
    });
  }
}

export default Cars;
