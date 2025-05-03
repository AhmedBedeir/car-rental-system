import Users from "./classes/Users.js";

const users = new Users();
await users.ready;
const currentUser = users.getCurrentUser();
function logout() {
  users.logout();
  window.location.href = "../index.html";
}

// const navContainer = document.querySelector(".nav-container");
const archiveButtons = `
<div class="d-flex flex-column flex-lg-row gap-2 justify-content-center justify-content-lg-end mt-3 mt-lg-0 w-100">
  <button class="btn btn-custom">Log In</button>
  <button class="btn btn-custom">Sign Up</button>
</div>`;
const authButtons = `
<a href="../pages/login.html" class="btn btn-outline-custom"><i class="fa-solid fa-arrow-right-to-bracket me-2"></i>Login</a>
<a href="../pages/login.html" class="btn btn-custom"><i class="fa-solid fa-user-plus me-2"></i>Sign Up</a>
`;
const logoutButton = `
<button href="#" id="logout" class="btn btn-outline-danger"><i class="fa-solid fa-arrow-right-from-bracket me-2"></i>Logout</button>`;
const bookingsButton = `
<a href="../pages/bookings.html" class="btn btn-outline-custom"><i class="fa-solid fa-bookmark me-2"></i>Bookings</a>`;
const adminDashboardButton = `
<a href="../pages/admin/admin.html" class="btn btn-outline-custom"><i class="fa-solid fa-user-tie me-2"></i>Admin Dashboard</a>`;

const links = [
  { name: "Home", href: "../index.html" },
  { name: "Cars", href: "../pages/carListings.html" },
  { name: "About Us", href: "../pages/about.html" },
  { name: "Contact Us", href: "../pages/contactUs.html" },
];

const currentPath = window.location.pathname;

const navbar = `
<nav class="navbar sticky-top navbar-expand-lg bg-body-tertiary px-3">
  <div class="container-xxl">
    <a class="navbar-brand" href="/">
      <div style="width: var(--logo-width); background-color: var(--surface-color); padding: 5px; border-radius: var(--border-radius);">
        <img class="img-fluid" src="../assets/logo.svg" />
      </div>
    </a>
    
    <span class="navbar-toggler-icon navbar-toggler" type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"></span>
      
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
        ${links
          .map(
            (link) => `
          <li class="nav-item">
            <a class="nav-link ${
              currentPath.endsWith(link.href.replace("../", "/"))
                ? "active"
                : ""
            }" 
               href="${link.href}">${link.name}</a>
          </li>
        `
          )
          .join("")}
      </ul>
      
      <div class="d-flex align-items-center gap-3">
        <!-- Dark mode toggle button -->
        <button id="dark-mode-toggle" class="btn p-2 border-0" >
          <i class="fas fa-moon fs-4 dark-icon text-secondary "></i>
          <i class="fas fa-sun fs-4 text-warning light-icon d-none"></i>
        </button>
        
        <div class="d-flex flex-column flex-lg-row gap-lg-3 gap-2">
          ${
            currentUser && currentUser.role === "customer" ? bookingsButton : ""
          }
          ${
            currentUser && currentUser.role === "admin"
              ? adminDashboardButton
              : ""
          }
          ${currentUser ? logoutButton : authButtons}
        </div>
      </div>
    </div>
  </div>
</nav>
`;

export const initNav = () => {
  document.addEventListener("DOMContentLoaded", () => {
    const navContainer = document.querySelector(".nav-container");
    if (navContainer) {
      navContainer.innerHTML = navbar;

      implementDarkMode();

      const logoutBtn = document.getElementById("logout");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
          e.preventDefault();
          if (confirm("Are you sure you want to log out?")) {
            logout();
          }
        });
      }
    }
  });
};

const implementDarkMode = () => {
  const darkModeToggle = document.getElementById("dark-mode-toggle");

  const savedMode = localStorage.getItem("darkMode");

  if (savedMode === "dark") {
    enableDarkMode();
  }

  darkModeToggle.addEventListener("click", toggleDarkMode);
  if (darkModeToggle) {
  }

  const toggleDarkMode = () => {
    document.body.classList.contains("dark-mode")
      ? disableDarkMode()
      : enableDarkMode();
  };

  const enableDarkMode = () => {
    document.body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "dark");
    document.querySelector(".dark-icon").classList.add("d-none");
    document.querySelector(".light-icon").classList.remove("d-none");
  };

  const disableDarkMode = () => {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "light");
    document.querySelector(".dark-icon").classList.remove("d-none");
    document.querySelector(".light-icon").classList.add("d-none");
  };
};
