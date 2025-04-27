const cars = JSON.parse(localStorage.getItem("cars"));
console.log(cars);

function extractDetails(){
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('car_id');
    const car = cars.find(c => c.id === carId);
    console.log(car);
    //Update the page with car details
    if (car) {
        document.getElementById("car-name").textContent = `${car.brand} ${car.model}`;
        document.getElementById("price").textContent = `$${car.pricePerDay}/day`;
        
        // Main image
        document.getElementById("main-car-img").src = car.images[0];
        document.getElementById("main-car-img").alt = `${car.brand} ${car.model}`;
        
        // Other images
        const otherImagesContainer = document.getElementById("other-images-container");
        otherImagesContainer.innerHTML = "";
        for (let i = 1; i < car.images.length; i++) {
            const img = document.createElement("img");
            img.className = "other-imgs";
            img.src = car.images[i];
            img.alt = `${car.brand} ${car.model} - image ${i + 1}`;
            otherImagesContainer.appendChild(img);
        }
        
        const featureColumnsContainer = document.getElementById("feature-columns");
        featureColumnsContainer.innerHTML = "";
        
        // divide features into groups of 3
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
        
        
    } else {
        document.getElementById("car-name").textContent = "Car not found";
    }
}

extractDetails();