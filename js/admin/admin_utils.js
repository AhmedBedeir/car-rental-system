/* =============== Form validation =============== */
export const validateForm = (
  brand,
  model,
  type,
  pricePerDay,
  features,
  images
) => {
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
};

/* =============== Function SweetAlert =============== */
export const showAlert = async (
  icon,
  title,
  text,
  confirmButtonText = "OK"
) => {
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
