class Cars {
  constructor() {
    this.cars = [];
    this.loadInitialData(); // Load data when class is instantiated
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
        this.cars = data.cars;
        this.saveToLocalStorage();
      } else {
        this.cars = JSON.parse(localStorage.getItem("cars"));
      }
    } catch (error) {
      console.error("Error loading initial car data:", error);
    }
  }

  async getAllCars() {
    if (this.cars.length === 0 && !localStorage.getItem("cars")) {
      await this.loadInitialData();
    }
    return this.cars;
  }
}

export default Cars;
