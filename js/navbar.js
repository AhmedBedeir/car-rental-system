import Users from "./classes/Users.js";

const users = new Users();
let currentUser = null;
const currentPath = window.location.pathname;

const links = [
  { name: "Home", href: "../index.html" },
  { name: "About Us", href: "../pages/about.html" },
  { name: "Cars", href: "../pages/carListings.html" },
  { name: "Contact Us", href: "../pages/contactUs.html" },
];

const authButtons = `
  <a href="../pages/login.html" class="btn btn-outline-custom">
    <i class="fa-solid fa-arrow-right-to-bracket me-2"></i>Login
  </a>
  <a href="../pages/login.html" class="btn btn-custom">
    <i class="fa-solid fa-user-plus me-2"></i>Sign Up
  </a>
`;

const logoutButton = `
  <button id="logout" class="btn btn-outline-danger">
    <i class="fa-solid fa-arrow-right-from-bracket me-2"></i>Logout
  </button>
`;

const bookingsButton = `
  <a href="../pages/bookings.html" class="btn btn-outline-custom">
    <i class="fa-solid fa-bookmark me-2"></i>Bookings
  </a>
`;

const adminDashboardButton = `
  <a href="../pages/admin/admin.html" class="btn btn-outline-custom">
    <i class="fa-solid fa-user-tie me-2"></i>Admin Dashboard
  </a>
`;

async function initializeUser() {
  try {
    await users.ready;
    currentUser = users.getCurrentUser();
    renderNavbar();
  } catch (error) {
    console.error("Failed to initialize user:", error);
    renderNavbar();
  }
}

function renderNavbar() {
  const navContainer = document.querySelector(".nav-container");
  if (!navContainer) return;

  navContainer.innerHTML = generateNavbarHTML();
  setupEventListeners();
}

function generateNavbarHTML() {
  const isActive = (href) => currentPath.endsWith(href.replace("../", "/"));

  return `
    <nav class="navbar fixed-top navbar-expand-lg bg-body-tertiary px-3">
      <div class="container-xxl">
        <a class="navbar-brand" href="/">
          <div style="width: var(--logo-width); background-color: var(--surface-color); padding: 5px; border-radius: var(--border-radius);">
            <img class="img-fluid" src="../assets/LogoPurple.svg" alt="Company Logo"/>
          </div>
        </a>
        
        <button class="navbar-toggler border-0" type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
          
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
            ${links
              .map(
                (link) => `
              <li class="nav-item">
                <a class="nav-link ${isActive(link.href) ? "active" : ""}" 
                   href="${link.href}">${link.name}</a>
              </li>
            `
              )
              .join("")}
          </ul>
          
          <div class="d-lg-flex flex-column flex-lg-row align-items-lg-center gap-3 left-group">
            <button id="dark-mode-toggle" class="btn p-2 border-0" aria-label="Toggle dark mode">
              <i class="fas fa-moon fs-4 dark-icon text-secondary"></i>
              <i class="fas fa-sun fs-4 text-warning light-icon d-none"></i>
            </button>
            <div class="d-flex flex-lg-row gap-lg-3 gap-2">
              ${currentUser?.role === "customer" ? bookingsButton : ""}
              ${currentUser?.role === "admin" ? adminDashboardButton : ""}
              ${currentUser ? logoutButton : authButtons}
            </div>
          </div>
        </div>
      </div>
    </nav>
  `;
}

function setupEventListeners() {
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }

  DarkMode.init();
}

function handleLogout(e) {
  e.preventDefault();

  Swal.fire({
    title: "Logout Confirmation",
    text: "Are you sure you want to log out?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, log out",
    cancelButtonText: "Cancel",
    backdrop: true,
    allowOutsideClick: false,
    allowEscapeKey: true,
    allowEnterKey: false,
    focusConfirm: false,
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      logout();

      Swal.fire({
        title: "Logged Out!",
        text: "You have been successfully logged out.",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  });
}
function logout() {
  users.logout();
  window.location.href = "../index.html";
}

const DarkMode = {
  init() {
    this.toggle = document.getElementById("dark-mode-toggle");
    if (!this.toggle) return;

    this.loadMode();
    this.toggle.addEventListener("click", () => this.toggleMode());
  },

  loadMode() {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "dark") this.enable();
  },

  enable() {
    document.body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "dark");
    document.querySelector(".dark-icon")?.classList.add("d-none");
    document.querySelector(".light-icon")?.classList.remove("d-none");
  },

  disable() {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "light");
    document.querySelector(".dark-icon")?.classList.remove("d-none");
    document.querySelector(".light-icon")?.classList.add("d-none");
  },

  toggleMode() {
    document.body.classList.contains("dark-mode")
      ? this.disable()
      : this.enable();
  },
};

export const initNav = () => {
  document.addEventListener("DOMContentLoaded", initializeUser);
};
