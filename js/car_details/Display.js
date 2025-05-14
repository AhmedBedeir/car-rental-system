// Extract car details from URL
export function extractDisplayDetails() {
  const car = getSelectedCar();

  if (car) {
    updateNamePrice(car);
    updateImgs(car);
    updateFeatures(car);
    updateDescription(car);
  } else {
    carNotFoundRedirect();
  }
}

//Get car
export function getSelectedCar() {
  const carId = new URLSearchParams(window.location.search).get("car_id");
  return window.carsClass.getCarById(carId);
}

// car name and price
function updateNamePrice(car) {
  document.title = `${car.brand} ${car.model}`;
  document.getElementById("car-name").innerHTML = `${car.brand} ${car.model}`;
  document.getElementById("price").innerHTML = `$${car.pricePerDay}/day`;
}

//car images
function updateImgs(car) {
  document.getElementById("main-car-img").src = car.images[0];
  document.getElementById("main-car-img").alt = `${car.brand} ${car.model}`;

  const otherImagesContainer = document.getElementById(
    "other-images-container"
  );
  otherImagesContainer.innerHTML = "";
  for (let i = 1; i < car.images.length; i++) {
    const img = document.createElement("img");
    img.className = "other-imgs";
    img.src = car.images[i];
    img.alt = `${car.brand} ${car.model} - image ${i + 1}`;
    otherImagesContainer.appendChild(img);
  }
}

// car features
function updateFeatures(car) {
  const featureColumnsContainer = document.getElementById("feature-columns");
  featureColumnsContainer.innerHTML = "";

  for (let i = 0; i < car.features.length; i += 3) {
    const column = document.createElement("div");
    column.className = "col-12 col-md-4 d-flex flex-column gap-2";

    for (let j = i; j < i + 3 && j < car.features.length; j++) {
      const item = document.createElement("div");
      item.className = "car-equips d-flex align-items-center";
      item.innerHTML = `
            <i class="bi bi-check-circle-fill me-2"></i>
            <p class="mb-0">${car.features[j]}</p>
        `;
      column.appendChild(item);
    }

    featureColumnsContainer.appendChild(column);
  }
}

//car description
function updateDescription(car) {
  document.getElementById("car-description").innerHTML = car.description;
}

//going to the url directly or no available car id
export function carNotFoundRedirect() {
  document.querySelector("main").innerHTML = `
        <div id="car-not-found" class="d-flex flex-column justify-content-center align-items-center text-center w-100" style="height: 100vh;">
            <div>
                <img src="../assets/noCar.svg" alt="Car not found" class="img-fluid" style="max-width: 300px;">
                <h2 class="mt-3">Car not found</h2>
                <p id="redirect-msg" class="mt-2 fs-5">Redirecting you to the home page in 3...</p>
            </div>
        </div>
    `;

  let count = 4;
  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      document.getElementById(
        "redirect-msg"
      ).textContent = `Redirecting you to the home page in ${count}...`;
    } else {
      clearInterval(interval);
      window.location.href = "../index.html";
    }
  }, 1000);
}
