document.addEventListener("DOMContentLoaded", function () {
  // Sidebar toggle functionality
  const sidebar = document.getElementById("sidebar");
  const content = document.getElementById("dashboard-content");
  const sidebarCollapse = document.getElementById("sidebarCollapse");

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
