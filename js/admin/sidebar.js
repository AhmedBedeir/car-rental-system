import Users from "../classes/Users.js";
const users = new Users();
await users.ready;
document.addEventListener("DOMContentLoaded", function () {
  // Sidebar toggle functionality
  const sidebar = document.getElementById("sidebar");
  const content = document.getElementById("dashboard-content");
  const sidebarCollapse = document.getElementById("sidebarCollapse");
  const logoutButton = document.querySelector(".btn-logout");
  logoutButton.addEventListener("click", function () {
    if (confirm("Are you sure you want to log out?")) {
      users.logout();
      window.location.href = "../../index.html";
    }
  });
  // Toggle sidebar on button click
  sidebarCollapse.addEventListener("click", function () {
    sidebar.classList.toggle("active");
    content.classList.toggle("active");
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", function (event) {
    const isMobile = window.innerWidth < 768;
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnToggleButton = sidebarCollapse.contains(event.target);

    if (
      isMobile &&
      !isClickInsideSidebar &&
      !isClickOnToggleButton &&
      sidebar.classList.contains("active")
    ) {
      sidebar.classList.remove("active");
    }
  });
});
