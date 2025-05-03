import Users from "./classes/Users.js";

const users = new Users();
await users.ready;
const currentUser = users.getCurrentUser();
function logout() {
  users.logout();
  window.location.href = "../index.html";
}

// const navContainer = document.querySelector(".nav-container");

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

const navbar = `
    <nav class="navbar sticky-top navbar-expand-lg bg-body-tertiary mb-3 px-3 nav-container">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <div style="width: var(--logo-width);">
            <img class="img-fluid" src="../assets/logo.svg" />
          </div>
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="../index.html" >Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="../pages/carListings.html">Cars</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">About Us</a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="../pages/contactUs.html">Contact Us</a>
            </li>
          </ul>
          <div class="d-flex">
            <div class="d-flex flex-column flex-lg-row gap-lg-3 gap-2 justify-content-center justify-content-lg-end mt-3 mt-lg-0 w-100">
              ${
                currentUser && currentUser.role === "customer"
                  ? bookingsButton
                  : ""
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
document.addEventListener("DOMContentLoaded", () => {
  document.body.insertAdjacentHTML("afterbegin", navbar);
  const logoutButton = document.getElementById("logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      const confirmLogout = confirm(
        "Are you sure you want to log out? You will be redirected to the home page."
      );
      if (confirmLogout) {
        logout();
      }
    });
  }
});

