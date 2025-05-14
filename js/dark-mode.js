export const implementDarkMode = () => {
  const enableDarkMode = () => {
    document.body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "dark");
    document.querySelector(".dark-icon")?.classList.add("d-none");
    document.querySelector(".light-icon")?.classList.remove("d-none");
  };

  const disableDarkMode = () => {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "light");
    document.querySelector(".dark-icon").classList.remove("d-none");
    document.querySelector(".light-icon").classList.add("d-none");
  };

  const darkModeToggle = document.getElementById("dark-mode-toggle");

  const savedMode = localStorage.getItem("darkMode");

  if (savedMode === "dark") {
    enableDarkMode();
  }

  const toggleDarkMode = () => {
    document.body.classList.contains("dark-mode")
      ? disableDarkMode()
      : enableDarkMode();
  };

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", toggleDarkMode);
  }
};
