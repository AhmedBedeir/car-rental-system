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

  deleteCar(id) {
    this.cars = this.cars.filter((car) => car.id !== id);
    this.saveToLocalStorage();
  }

  // handle initial data loading
  async loadInitialData() {
    try {
      if (!localStorage.getItem("cars")) {
        const response = await fetch("../../data/cars.json");
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

  searchCars(searchText) {
    const text = searchText.trim().toLowerCase();
    if (!text) return this.cars;

    return this.cars.filter((car) => {
      return (
        car.brand.toLowerCase().includes(text) ||
        car.model.toLowerCase().includes(text) ||
        car.type.toLowerCase().includes(text)
      );
    });
  }

  overviewCarsNumbers() {
    const totalCars = this.cars.length;
    if (totalCars === 0) {
      return {
        totalCars: 0,
        availableCars: 0,
        bookedCars: 0,
        availableCarsPercentage: 0,
      };
    }
    const availableCars = this.cars.filter((car) => car.available).length;
    const bookedCars = totalCars - availableCars;
    const availableCarsPercentage = Math.round(
      (availableCars / totalCars) * 100
    );
    return {
      totalCars,
      availableCars,
      bookedCars,
      availableCarsPercentage,
    };
  }

  getOverview(dataArray, key) {
    const items = dataArray.map((value) => {
      const count = this.cars.filter((car) => car[key] === value).length;
      return { [key]: value, count };
    });
    const labels = items.map((item) => item[key]);
    const data = items.map((item) => item.count);
    return { items, labels, data };
  }

  overViewCarsModels() {
    return this.getOverview(this.carsModels, "model");
  }

  overViewCarsBrands() {
    return this.getOverview(this.carsBrands, "brand");
  }

  overViewCarsTypes() {
    return this.getOverview(this.carsTypes, "type");
  }
}

export default Cars;
