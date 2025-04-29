export default function showCards(cars, carsContainer) {
  carsContainer.innerHTML = "";
  if (cars.length === 0) {
    carsContainer.innerHTML = `
      <div id="noCars">
    <h2>No cars matched your search.</h2>
    <p>Try adjusting your search/filter for better results!</p>
    <img
      src="../assets/noCar.svg"
      alt="no cars"
      width="150"
      height="150"
    />
    </div>
    `;
  }

  cars.forEach((car) => {
    const col = document.createElement("div");
    col.className = " col-md-6 col-lg-4";

    let availabilitySpan =
      car.available === true
        ? `<span id="available"><i class="bi bi-check-circle me-1"></i> Available</span>`
        : `<span id="booked"><i class="bi bi-x-circle"></i> Booked</span>`;

    col.innerHTML = `
          <div class="car-card">
            <img src="${car.images[0]}" alt="${car.brand} ${car.model}">
            ${availabilitySpan}
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
      
              <a href="carDetails.html?car_id=${
                car.id
              }" class="car-card-btn">View Details</a>
            </div>
          </div>
        `;

    carsContainer.appendChild(col);
  });
}
