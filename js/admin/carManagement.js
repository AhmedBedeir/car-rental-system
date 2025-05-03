import Cars from "../classes/Cars.js";

const carsClass = new Cars();
await carsClass.ready;

//function to show the data for the select 
function populateSelectOptions(selectId, optionsArray) {

  const select = document.getElementById(selectId);
  optionsArray.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

populateSelectOptions("brand", carsClass.carsBrands);
populateSelectOptions("model", carsClass.carsModels);
populateSelectOptions("type", carsClass.carsTypes);



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
        <td>${car.available
        ? `<span class="bg-success text-white px-3 py-1 rounded">Available</span>`
        : `<span class="bg-danger text-white px-3 py-1 rounded">Booked</span>`
      }</td>
        <td>
         ${listFeatures(car.features)}</td>
        <td>
        <div>
        <button class="update-btn btn btn-warning" data-bs-toggle="modal" data-bs-target="#exampleModal" ${car.available ? "" : "disabled"
      }>
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="delete-btn btn btn-danger" ${car.available ? "" : "disabled"
      }>
          <i class="bi bi-trash-fill"></i>
        </button>

        </div>
        </td>`;
    carsTableBody.appendChild(row);

    //update button
    const updateBtn = row.querySelector(".update-btn");
    updateBtn.addEventListener("click", () => {

      document.getElementById("car-id").value = car.id;
      document.getElementById("brand").value = car.brand;
      document.getElementById("model").value = car.model;
      document.getElementById("type").value = car.type;
      document.getElementById("pricePerDay").value = car.pricePerDay;
      document.getElementById("features").value = car.features;

      document.querySelector(".modal-title").textContent = "Update Car";
    });

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

//modal form for update and create
const modalForm = document.getElementById("update-form");
modalForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("car-id").value;
  const brand = document.getElementById("brand").value.trim();
  const model = document.getElementById("model").value.trim();
  const type = document.getElementById("type").value.trim();
  const pricePerDay = parseFloat(document.getElementById("pricePerDay").value);
  const features = document.getElementById("features").value
    .split(",")
    .map(f => f.trim())
    .filter(Boolean);

  // Updated Validation
  if (!brand || brand === "Select Brand" ||
    !model || model === "Select Model" ||
    !type || type === "Select Type" ||
    isNaN(pricePerDay) ||
    features.length === 0) {
    alert("All fields must be filled out correctly.");
    return;
  }

  if (id) {
    // Update
    await reRenderAfterAction(
      carsClass.updateCar(id, { brand, model, type, pricePerDay, features })
    );
  } else {
    // Add new car

    // create new id 
    const lastCarId=parseInt(cars[cars.length-1].id);
    console.log(typeof(lastCarId))
    // Set new ID as max + 1
    const newCar = {
      id: (lastCarId+1).toString(),
      brand,
      model,
      type,
      pricePerDay,
      features,
      available: true,
    };

    await reRenderAfterAction(carsClass.addCar(newCar));
  }

  // Close the modal after action completes
  const modalEl = document.getElementById("exampleModal");
  const modalInstance = bootstrap.Modal.getInstance(modalEl);
  modalInstance.hide();
});


const addCarBtn = document.getElementById("add-car-btn");
addCarBtn.addEventListener("click", () => {
  document.getElementById("car-id").value = "";
  document.getElementById("brand").value = "";
  document.getElementById("model").value = "";
  document.getElementById("type").value = "";
  document.getElementById("pricePerDay").value = "";
  document.getElementById("features").value = "";

  // Change modal title
  document.querySelector(".modal-title").textContent = "Add Car";
});


//Rerender Cars After Action
async function reRenderAfterAction(actionFunction) {
  await actionFunction;
  const updatedCars = carsClass.getAllCars();
  showCars(updatedCars);
}
