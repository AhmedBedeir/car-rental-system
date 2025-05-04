import Users from "./classes/Users.js";

const usersManager = new Users();
await usersManager.ready;

// Functions to handle form displays
function switchForm(form) {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const loginBtn = document.querySelector(".switch-btn:nth-child(1)");
  const signupBtn = document.querySelector(".switch-btn:nth-child(2)");
  const loginAlert = document.getElementById("login-alert");
  const signupAlert = document.getElementById("signup-alert");

  // Reset alerts
  loginAlert.style.display = "none";
  signupAlert.style.display = "none";

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

// Function to show alert messages
function showAlert(type, message, formType) {
  const alertElement = document.getElementById(`${formType}-alert`);
  alertElement.textContent = message;
  type = type === "error" ? "danger" : type;
  alertElement.className = `alert alert-${type}`;
  alertElement.style.display = "block";
  // Auto hide after 5 seconds
  setTimeout(() => {
    alertElement.style.display = "none";
  }, 5000);
}

// Handle Login Form Submission
document
  .getElementById("login-form-element")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!username || !password) {
      showAlert("error", "Please fill in all fields", "login");
      return;
    }

    const result = usersManager.login(username, password);

    if (result.success) {
      showAlert("success", result.message, "login");

      // Redirect to index after successful login
      setTimeout(() => {
        if (result.user.role === "admin") {
          window.location.href = "../pages/admin/admin.html";
        } else {
          window.location.href = "../index.html";
        }
      }, 1500);
    } else {
      showAlert("error", result.message, "login");
    }
  });

// Handle Signup Form Submission
document
  .getElementById("signup-form-element")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("signup-name").value.trim();
    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const phone = document.getElementById("signup-phone").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const confirmPassword = document
      .getElementById("signup-confirm")
      .value.trim();

    // validation
    if (
      !name ||
      !username ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      showAlert("error", "Please fill in all fields", "signup");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("error", "Passwords do not match", "signup");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert("error", "Please enter a valid email address", "signup");
      return;
    }

    // Phone validation - basic check for minimum length
    if (phone.replace(/[^0-9]/g, "").length < 10) {
      showAlert("error", "Please enter a valid phone number", "signup");
      return;
    }
    // Password strength check
    if (password.length < 8) {
      showAlert(
        "error",
        "Password must be at least 8 characters long",
        "signup"
      );
      return;
    }

    // Register the user
    const result = usersManager.register(
      username,
      email,
      password,
      phone,
      name
    );

    if (result.success) {
      showAlert("success", result.message, "signup");

      // Redirect to index after successful registration
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1500);
    } else {
      showAlert("error", result.message, "signup");
    }
  });
