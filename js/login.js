import Users from "./classes/Users.js";

const usersManager = new Users();
await usersManager.ready;

// Form display management
function switchForm(form) {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const loginBtn = document.querySelector(".switch-btn:nth-child(1)");
  const signupBtn = document.querySelector(".switch-btn:nth-child(2)");

  if (form === "login" || form === undefined) {
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
    loginBtn.classList.add("active");
    signupBtn.classList.remove("active");
  } else {
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
    signupBtn.classList.add("active");
    loginBtn.classList.remove("active");
  }
}
window.switchForm = switchForm;

// Alert function using SweetAlert2
async function showAlert(type, message) {
  const alertConfig = {
    title: type === "error" ? "Error" : "Success",
    text: message,
    icon: type === "error" ? "error" : "success",
    timer: type === "error" ? 5000 : 3000,
    timerProgressBar: true,
    showConfirmButton: type === "error",
    confirmButtonColor: "#3085d6",
    position: "top-end",
    toast: true,
    // background: "var(--background-color)",
    // color: "var(--text-color)",
  };

  await Swal.fire(alertConfig);
}

// Validation functions
function validateUsername(username) {
  if (!username.trim()) return "";
  if (username.length < 4) return "Username must be at least 4 characters";
  return "";
}

function validatePassword(password) {
  if (!password.trim()) return "";
  if (password.length < 8) return "Password must be at least 8 characters";
  return "";
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return "";
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return "";
}

function validatePhone(phone) {
  const phoneRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  if (!phone.trim()) return "";
  if (!phoneRegex.test(phone)) return "Please enter a valid phone number";
  return "";
}

function validateName(name) {
  if (!name.trim()) return "";
  return "";
}

function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword.trim()) return "";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
}

// Show error messages under fields only on blur
function showFieldError(fieldId, errorMessage) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(`${fieldId}-error`);

  // Check if elements exist before trying to manipulate them
  if (!field || !errorElement) {
    console.warn(`Field or error element not found for: ${fieldId}`);
    return;
  }

  if (errorMessage) {
    field.classList.add("is-invalid");
    errorElement.textContent = errorMessage;
    errorElement.style.display = "block";
  } else {
    field.classList.remove("is-invalid");
    errorElement.style.display = "none";
  }
}
// Setup validation on blur
function setupBlurValidation() {
  // Get all form fields
  const fields = [
    "login-username",
    "login-password",
    "signup-name",
    "signup-username",
    "signup-email",
    "signup-phone",
    "signup-password",
    "signup-confirm",
  ];

  // Add blur event to each field
  fields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    field.addEventListener("blur", () => {
      let error = "";
      const value = field.value.trim();

      // Validate based on field type
      switch (fieldId) {
        case "login-username":
        case "signup-username":
          error = validateUsername(value);
          break;
        case "login-password":
        case "signup-password":
          error = validatePassword(value);
          break;
        case "signup-email":
          error = validateEmail(value);
          break;
        case "signup-phone":
          error = validatePhone(value);
          break;
        case "signup-name":
          error = validateName(value);
          break;
        case "signup-confirm":
          const password = document.getElementById("signup-password").value;
          error = validateConfirmPassword(password, value);
          break;
      }

      // Only show error if field has content
      if (value) {
        showFieldError(fieldId, error);
      } else {
        showFieldError(fieldId, "");
      }
    });
  });

  // Special real-time check for password matching
  const signupPassword = document.getElementById("signup-password");
  const signupConfirm = document.getElementById("signup-confirm");

  signupPassword.addEventListener("input", () => {
    if (signupConfirm.value.trim()) {
      showFieldError(
        "signup-confirm",
        validateConfirmPassword(signupPassword.value, signupConfirm.value)
      );
    }
  });

  signupConfirm.addEventListener("input", () => {
    if (signupPassword.value.trim()) {
      showFieldError(
        "signup-confirm",
        validateConfirmPassword(signupPassword.value, signupConfirm.value)
      );
    }
  });
}

// Form submission handlers
async function handleLogin(e) {
  e.preventDefault();

  const formData = {
    username: document.getElementById("login-username")?.value.trim() || "",
    password: document.getElementById("login-password")?.value.trim() || "",
  };

  const requiredFields = [
    { id: "login-username", value: formData.username, name: "Username" },
    { id: "login-password", value: formData.password, name: "Password" },
  ];

  const emptyFields = requiredFields.filter((field) => !field.value);

  if (emptyFields.length > 0) {
    emptyFields.forEach((field) => {
      showFieldError(field.id, `${field.name} is required`);
    });

    await showAlert("error", "Please fill in all required fields");
    return;
  }

  const errors = {
    username: validateUsername(formData.username),
    password: validatePassword(formData.password),
  };

  Object.keys(errors).forEach((field) => {
    if (errors[field]) {
      showFieldError(`login-${field}`, errors[field]);
    }
  });

  if (Object.values(errors).some((error) => error)) {
    await showAlert("error", "Please fix the errors in the form");
    return;
  }

  const result = usersManager.login(formData.username, formData.password);

  if (result.success) {
    await Swal.fire({
      title: "Login Successful!",
      text: result.message,
      icon: "success",
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
      willClose: () => {
        window.location.href =
          result.user.role === "admin"
            ? "../pages/admin/admin.html"
            : "../index.html";
      },
    });
  } else {
    await showAlert("error", result.message);
  }
}

async function handleSignup(e) {
  e.preventDefault();

  const formData = {
    name: document.getElementById("signup-name")?.value.trim() || "",
    username: document.getElementById("signup-username")?.value.trim() || "",
    email: document.getElementById("signup-email")?.value.trim() || "",
    phone: document.getElementById("signup-phone")?.value.trim() || "",
    password: document.getElementById("signup-password")?.value.trim() || "",
    confirmPassword:
      document.getElementById("signup-confirm")?.value.trim() || "",
  };

  const requiredFields = [
    { id: "signup-name", value: formData.name, name: "Full Name" },
    { id: "signup-username", value: formData.username, name: "Username" },
    { id: "signup-email", value: formData.email, name: "Email" },
    { id: "signup-phone", value: formData.phone, name: "Phone" },
    { id: "signup-password", value: formData.password, name: "Password" },
    {
      id: "signup-confirm",
      value: formData.confirmPassword,
      name: "Confirm Password",
    },
  ];

  const emptyFields = requiredFields.filter((field) => !field.value);

  if (emptyFields.length > 0) {
    emptyFields.forEach((field) => {
      showFieldError(field.id, `${field.name} is required`);
    });

    await showAlert("error", "Please fill in all required fields");
    return;
  }

  const errors = {
    username: validateUsername(formData.username),
    email: validateEmail(formData.email),
    phone: validatePhone(formData.phone),
    password: validatePassword(formData.password),
    confirmPassword: validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    ),
  };

  Object.keys(errors).forEach((field) => {
    if (errors[field]) {
      showFieldError(`signup-${field}`, errors[field]);
    }
  });

  if (Object.values(errors).some((error) => error)) {
    await showAlert("error", "Please fix the errors in the form");
    return;
  }

  try {
    const result = usersManager.register(
      formData.username,
      formData.email,
      formData.password,
      formData.phone,
      formData.name
    );

    if (result.success) {
      await showAlert("success", result.message);
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1500);
    } else {
      await showAlert("error", result.message);
    }
  } catch (error) {
    console.error("Registration error:", error);
    await showAlert(
      "error",
      "An unexpected error occurred during registration"
    );
  }
}
document.addEventListener("DOMContentLoaded", () => {
  // Only setup validation if forms exist
  const loginForm = document.getElementById("login-form-element");
  const signupForm = document.getElementById("signup-form-element");

  if (loginForm) {
    setupBlurValidation();
    loginForm.addEventListener("submit", handleLogin);
  }

  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup);
  }

  const fields = [
    "login-username",
    "login-password",
    "signup-name",
    "signup-username",
    "signup-email",
    "signup-phone",
    "signup-password",
    "signup-confirm",
  ].filter((id) => document.getElementById(id));

  fields.forEach((fieldId) => {
    if (!document.getElementById(`${fieldId}-error`)) {
      const errorElement = document.createElement("div");
      errorElement.id = `${fieldId}-error`;
      errorElement.className = "invalid-feedback";
      errorElement.style.display = "none";
      document.getElementById(fieldId).parentNode.appendChild(errorElement);
    }
  });

  switchForm("login");
});
