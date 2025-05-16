document.addEventListener("DOMContentLoaded", () => {
  const backgroundImages = [
    "    assets/hero_section/hero-bg.jpg",
    "assets/hero_section/bg_3.jpg",
    "assets/hero_section/bg_2.jpg",
    "assets/hero_section/bg_1.jpg",
  ];

  // Catch elements
  const heroBackground = document.getElementById("heroBackground");
  const sliderDots = document.getElementById("sliderDots");
  const prevButton = document.getElementById("prevSlide");
  const nextButton = document.getElementById("nextSlide");

  let currentSlide = 0;
  let slideInterval;

  const displaySlider = () => {
    updateBackground();

    createDots();

    startSlideshow();

    prevButton.addEventListener("click", prevSlide);
    nextButton.addEventListener("click", nextSlide);
  };

  // Create navigation dots
  const createDots = () => {
    sliderDots.innerHTML = "";

    backgroundImages.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.classList.add("slider-dot");
      if (index === currentSlide) {
        dot.classList.add("active");
      }

      dot.addEventListener("click", () => {
        currentSlide = index;
        updateSlider();
      });

      sliderDots.appendChild(dot);
    });
  };

  const updateBackground = () => {
    heroBackground.style.background = `url('${backgroundImages[currentSlide]}')`;
    heroBackground.style.backgroundSize = "cover";
    heroBackground.style.backgroundPosition = "center";
    updateActiveDot();
  };

  // Update active dot
  const updateActiveDot = () => {
    const dots = sliderDots.querySelectorAll(".slider-dot");

    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  };

  // Start  slideshow
  const startSlideshow = () => {
    // Clear any existing interval
    if (slideInterval) {
      clearInterval(slideInterval);
    }

    slideInterval = setInterval(() => {
      nextSlide();
    }, 5000);
  };

  // Go to next slide
  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % backgroundImages.length;
    updateSlider();
  };

  // Go to previous slide
  const prevSlide = () => {
    currentSlide =
      (currentSlide - 1 + backgroundImages.length) % backgroundImages.length;
    updateSlider();
  };

  const updateSlider = () => {
    updateBackground();
    startSlideshow();
  };

  displaySlider();
});
