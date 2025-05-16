import Cars from "../classes/Cars.js";

const carsClass = new Cars();
await carsClass.ready;

const cars = carsClass.getAllCars();
const carsTableBody = document.getElementById("cars-data");

showCars(cars);

// Function SweetAlert
const showAlert = async (icon, title, text, confirmButtonText = "OK") => {
  await Swal.fire({
    icon,
    title,
    text,
    confirmButtonText,
    customClass: {
      confirmButton: "btn btn-primary",
    },
  });
};

// Function  select options
function populateSelectOptions(selectId, optionsArray) {
  const select = document.getElementById(selectId);
  select.innerHTML = '<option value="">Select Option</option>';
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

// Show Cars In Table
function showCars(cars) {
  carsTableBody.innerHTML = "";

  function listFeatures(arr) {
    return arr.map((li) => `<li>${li}</li>`).join("");
  }

  function displayImages(images) {
    if (!images || images.length === 0) {
      return '<span class="text-muted">No images</span>';
    }
    return images
      .map(
        (img) => `
      <img src="${img}" class="car-thumbnail" lazy="loading" style="object-fit: cover; width: 50px; height: 50px; border-radius: 5px" alt="Car image">
    `
      )
      .join("");
  }

  cars.forEach((car) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${car.id}</td>
      <td class="bold bigger">${car.brand}</td>
      <td class="bold">${car.model}</td>
      <td class="bold">${car.type}</td>
      <td><span class="bold">${car.pricePerDay}</span> / Day</td>
      <td>
        ${
          car.available
            ? `<span class="bg-success text-white px-3 py-1 rounded">Available</span>`
            : `<span class="bg-danger text-white px-3 py-1 rounded">Booked</span>`
        }
      </td>
      <td>${listFeatures(car.features)}</td>
      <td class="car-images">${displayImages(car.images)}</td>
      <td>
        <div class="d-flex gap-2">
          <button class="update-btn btn btn-warning" data-bs-toggle="modal" data-bs-target="#exampleModal" ${
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
      </td>
    `;

    carsTableBody.appendChild(row);

    // Handle update car
    const updateBtn = row.querySelector(".update-btn");
    updateBtn.addEventListener("click", () => {
      document.getElementById("car-id").value = car.id;
      document.getElementById("brand").value = car.brand;
      document.getElementById("model").value = car.model;
      document.getElementById("type").value = car.type;
      document.getElementById("pricePerDay").value = car.pricePerDay;
      document.getElementById("features").value = car.features.join(", ");

      const imagesPreview = document.getElementById("images-preview");
      imagesPreview.innerHTML = displayImages(car.images);
      imageArr = [...car.images];

      document.querySelector(".modal-title").textContent = "Update Car";
    });

    // Delete Car
    const deleteBtn = row.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", async () => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You are about to delete ${car.brand} ${car.model}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        try {
          await carsClass.deleteCar(car.id);
          await showAlert("success", "Deleted!", "The car has been deleted.");
          const updatedCars = carsClass.getAllCars();
          showCars(updatedCars);
        } catch (error) {
          await showAlert("error", "Error", "Failed to delete the car.");
        }
      }
    });
  });
}

// handling Image
let imageArr = [];
const inputImages = document.getElementById("images-upload");
const imagesPreview = document.getElementById("images-preview");

if (inputImages && imagesPreview) {
  inputImages.addEventListener("change", function () {
    imagesPreview.innerHTML = "";
    imageArr = [];

    const files = inputImages.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.match("image.*")) {
        showAlert("error", "Invalid File", "Only image files are allowed");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        showAlert("error", "File Too Large", "Image must be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.className = "img-thumbnail m-2";
        img.style.maxHeight = "150px";
        imagesPreview.appendChild(img);
        imageArr.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  });
}

// Form validation
function validateForm(brand, model, type, pricePerDay, features, images) {
  const errors = [];

  if (!brand || brand === "Select Brand") {
    errors.push("Please select a brand");
    document.getElementById("brand").classList.add("is-invalid");
  } else {
    document.getElementById("brand").classList.remove("is-invalid");
  }

  if (!model || model === "Select Model") {
    errors.push("Please select a model");
    document.getElementById("model").classList.add("is-invalid");
  } else {
    document.getElementById("model").classList.remove("is-invalid");
  }

  if (!type || type === "Select Type") {
    errors.push("Please select a type");
    document.getElementById("type").classList.add("is-invalid");
  } else {
    document.getElementById("type").classList.remove("is-invalid");
  }

  if (isNaN(pricePerDay)) {
    errors.push("Please enter a valid price");
    document.getElementById("pricePerDay").classList.add("is-invalid");
  } else {
    document.getElementById("pricePerDay").classList.remove("is-invalid");
  }

  if (!features || features.length === 0) {
    errors.push("Please enter at least one feature");
    document.getElementById("features").classList.add("is-invalid");
  } else {
    document.getElementById("features").classList.remove("is-invalid");
  }

  if (!images || images.length === 0) {
    errors.push("Please upload at least one image");
    document.getElementById("images-upload").classList.add("is-invalid");
  } else {
    document.getElementById("images-upload").classList.remove("is-invalid");
  }

  return errors;
}

// Modal form submission
const modalForm = document.getElementById("update-form");
modalForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("car-id").value;
  const brand = document.getElementById("brand").value.trim();
  const model = document.getElementById("model").value.trim();
  const type = document.getElementById("type").value.trim();
  const pricePerDay = parseFloat(document.getElementById("pricePerDay").value);
  const features = document
    .getElementById("features")
    .value.split(",")
    .map((f) => f.trim())
    .filter(Boolean);
  const images = imageArr.length > 0 ? imageArr : [];

  // Validate form
  const errors = validateForm(
    brand,
    model,
    type,
    pricePerDay,
    features,
    images
  );
  if (errors.length > 0) {
    await showAlert("error", "Validation Error", errors.join("<br>"));
    return;
  }
  console.log(images);
  try {
    if (id) {
      // Update existing car
      await carsClass.updateCar(id, {
        brand,
        model,
        type,
        pricePerDay,
        features,
        images,
      });
      await showAlert("success", "Success", "Car updated successfully");
    } else {
      // Add new car
      const lastCarId = parseInt(cars[cars.length - 1].id);
      const newCar = {
        id: (lastCarId + 1).toString(),
        brand,
        model,
        type,
        pricePerDay,
        features,
        available: true,
        images,
      };
      await carsClass.addCar(newCar);
      await showAlert("success", "Success", "New car added successfully");
    }

    // Refresh cars list and close modal
    const updatedCars = carsClass.getAllCars();
    showCars(updatedCars);

    const modalEl = document.getElementById("exampleModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    // Reset form if adding new car
    if (!id) {
      modalForm.reset();
      imagesPreview.innerHTML = "";
      imageArr = [];
    }
  } catch (error) {
    console.error("Error:", error);
    await showAlert("error", "Error", "An error occurred. Please try again.");
  }
});

// Add car button
const addCarBtn = document.getElementById("add-car-btn");
addCarBtn.addEventListener("click", () => {
  document.getElementById("car-id").value = "";
  document.getElementById("brand").value = "";
  document.getElementById("model").value = "";
  document.getElementById("type").value = "";
  document.getElementById("pricePerDay").value = "";
  document.getElementById("features").value = "";
  document.getElementById("images-preview").innerHTML = "";
  document.getElementById("images-upload").value = "";
  imageArr = [];

  // Remove validation classes
  [
    "brand",
    "model",
    "type",
    "pricePerDay",
    "features",
    "images-upload",
  ].forEach((id) => {
    document.getElementById(id).classList.remove("is-invalid");
  });

  document.querySelector(".modal-title").textContent = "Add Car";
});
