import Cars from "../classes/Cars.js";

const carsClass = new Cars();
await carsClass.ready;
const cars = carsClass.getAllCars();
const carsTableBody = document.getElementById("cars-data");

showCars(cars);

//Show Cars In Table
function showCars(cars) {
  carsTableBody.innerHTML = "";

  function listFeatures(arr) {
    return arr.map((li) => `<li>${li}</li>`).join("");
  }

  cars.forEach((car) => {
    const row = document.createElement("tr");
    row.innerHTML = ` <td>${car.id}</td>
        <td class="bold bigger">${car.brand}</td>
        <td class="bold">${car.model}</td>
        <td class="bold">${car.type}</td>
        <td><span class="bold">${car.pricePerDay}</span> / Day</td>
        <td>${
          car.available
            ? `<span class="bg-success text-white px-3 py-1 rounded">Available</span>`
            : `<span class="bg-danger text-white px-3 py-1 rounded">Booked</span>`
        }</td>
        <td>
         ${listFeatures(car.features)}</td>
        <td>
        <div>
        <button class="update-btn btn btn-warning" ${
          car.available ? "" : "disabled"
        }>
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="delete-btn btn btn-danger" ${
          car.available ? "" : "disabled"
        }>
          <i class="bi bi-trash-fill"></i>
        </button>

        </div>
        </td>`;
    carsTableBody.appendChild(row);

    //Update Button
    const updateBtn = row.querySelector(".update-btn");

    //Delete Button Functionality
    const deleteBtn = row.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", async () => {
      //Show Confirm
      const confirmed = confirm(
        `Are you sure you want to delete ${car.brand} ${car.model}?`
      );
      if (confirmed) {
        await reRenderAfterAction(carsClass.deleteCar(car.id));
      }
    });
  });
}

//Rerender Cars After Action
async function reRenderAfterAction(actionFunction) {
  await actionFunction;
  const updatedCars = carsClass.getAllCars();
  showCars(updatedCars);
}
