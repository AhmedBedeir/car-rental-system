// export function showCards(cars, carsContainer, carDetailsPath) {
//   carsContainer.innerHTML = "";

//   if (cars.length === 0) {
//     carsContainer.innerHTML = `
//       <div class="col-12 text-center py-5">
//         <div class="no-cars-found p-4">
//           <img src="../assets/noCar.svg" alt="No cars found" class="mb-4" width="150" height="150">
//           <h3 class="mb-3">No cars matched your search.</h3>
//           <p class="text-muted mb-0">Try adjusting your search/filter for better results!</p>
//         </div>
//       </div>
//     `;
//     return;
//   }

//   cars.forEach((car) => {
//     const col = document.createElement("div");
//     col.className = "col-12 col-md-6 col-lg-4 mb-4";

//     const availabilityClass = car.available ? "bg-success" : "bg-danger";
//     const availabilityIcon = car.available ? "bi-check-circle" : "bi-x-circle";
//     const availabilityText = car.available ? "Available" : "Booked";

//     col.innerHTML = `
//       <div class="card h-100 shadow-sm border-0 overflow-hidden">
//         <div class="position-relative">
//           <img src="${car.images[0]}" class="card-img-top" alt="${car.brand} ${
//       car.model
//     }" style="height: 200px; object-fit: cover;">
//           <span class="position-absolute top-0 end-0 m-2 badge ${availabilityClass}">
//             <i class="bi ${availabilityIcon} me-1"></i> ${availabilityText}
//           </span>
//         </div>

//         <div class="card-body">
//           <div class="d-flex justify-content-between align-items-center mb-2">
//             <h5 class="card-title mb-0 fw-bold">${car.brand} ${car.model}</h5>
//             <span class="text-primary fw-bold">$${
//               car.pricePerDay
//             } <small class="text-muted">/day</small></span>
//           </div>

//           <p class="text-muted mb-3">${car.type}

//           <div class="car-features mb-3">
//             ${car.features
//               .slice(0, 3)
//               .map(
//                 (f) => `
//               <div class="d-flex align-items-center mb-2">
//                 <i class="bi bi-check-circle text-success me-2"></i>
//                 <small>${f}</small>
//               </div>
//             `
//               )
//               .join("")}
//           </div>

//           <a href="${carDetailsPath}?car_id=${
//       car.id
//     }" class="btn btn-outline-primary w-100 mt-auto">
//             View Details <i class="bi bi-arrow-right ms-2"></i>
//           </a>
//         </div>
//       </div>
//     `;

//     carsContainer.appendChild(col);
//   });
// }

// export function overviewCard({ icon, title, value, small }) {
//   return `
//     <div class="col-12 col-md-6 col-lg-3 mb-4">
//       <div class="card h-100 border-0 shadow-sm text-center p-4">
//         <div class="icon-wrapper bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
//           ${icon}
//         </div>
//         <p class="text-muted mb-1">${title}</p>
//         <h3 class="fw-bold mb-2">${value}</h3>
//         <small class="text-muted d-block">${small}</small>
//       </div>
//     </div>
//   `;
// }

export function showCards(cars, carsContainer, carDetailsPath) {
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
                } <small class="">/ day</small></span>
              </div>
              <p class="mb-3">${car.type}</p>
      
              <div class="car-card-features">
                ${car.features
                  .map(
                    (f) =>
                      `<div><i class="bi bi-check-circle me-1"></i> ${f}</div>`
                  )
                  .join("")}
              </div>
      
              <a href="${carDetailsPath}?car_id=${
      car.id
    }" class="car-card-btn">View Details</a>
            </div>
          </div>
        `;

    carsContainer.appendChild(col);
  });
}

//function to get the data for the select
export function populateSelectOptions(selectId, optionsArray) {
  const select = document.getElementById(selectId);
  optionsArray.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}
export function overviewCard({ icon, title, value, small }) {
  const card = `
  <div class="col-md-6 col-lg-3">
    <div class="item p-3">
      <div class="icon d-flex justify-content-center align-items-center">               
        ${icon}
      </div>
      <p class="title">${title}</p>
      <h2>${value}</h2>
      <p class="small mt-1">${small}</p>
    </div>
  </div>
  `;
  return card;
}
