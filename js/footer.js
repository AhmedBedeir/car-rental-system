const footer = `
<footer class="footer  py-4">
  <div class="container-xxl">
    <!-- Contact Row -->
    <div class="row g-4 mb-4">
      <!-- Logo Section -->
      <div class="col-md-3 d-flex align-items-center">
        <div class="footer-brand">
          <img src="../assets/LogoPurple.svg" alt="Car Rental Logo" style="width: var(--logo-width);;padding:5px;border-radius:var(--border-radius);" />
        </div>
      </div>

      <!-- Address Section -->
      <div class="col-md-3">
        <div class="d-flex align-items-center h-100">
          <i class="bi bi-geo-alt-fill fs-4 me-3" style="color: var(--secondary-color);"></i>
          <div>
            <p class="mb-0 fw-bold">Address</p>
            <p class="mb-0 ">123 Main Street, Cairo</p>
          </div>
        </div>
      </div>

      <!-- Email Section -->
      <div class="col-md-3">
        <div class="d-flex align-items-center h-100">
          <i class="bi bi-envelope-fill fs-4 me-3" style="color: var(--secondary-color);"></i>
          <div>
            <p class="mb-0 fw-bold">Email</p>
            <p class="mb-0 ">info@carental.com</p>
          </div>
        </div>
      </div>

      <!-- Phone Section -->
      <div class="col-md-3">
        <div class="d-flex align-items-center h-100">
          <i class="bi bi-telephone-fill fs-4 me-3" style="color: var(--secondary-color);"></i>
          <div>
            <p class="mb-0 fw-bold">Contact</p>
            <p class="mb-0 ">+200108034761</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Links Row -->
    <div class="row g-4 mb-4">
      <!-- Social Media Column -->
      <div class="col-lg-3 col-md-6">
        <h3 class="h5 mb-3">Follow Us</h3>
        <p class=" mb-3">
          Follow our journey and stay updated with our latest fleet additions,
          special offers, and travel tips from the road
        </p>
        <div class="social-icons">
          <a href="#" class="text-white me-3" aria-label="Facebook"><i class="bi bi-facebook fs-5"></i></a>
          <a href="#" class="text-white me-3" aria-label="Twitter"><i class="bi bi-twitter-x fs-5"></i></a>
          <a href="#" class="text-white me-3" aria-label="Instagram"><i class="bi bi-instagram fs-5"></i></a>
          <a href="#" class="text-white" aria-label="YouTube"><i class="bi bi-youtube fs-5"></i></a>
        </div>
      </div>

      <!-- Popular Cars Column -->
      <div class="col-lg-3 col-md-6">
        <h3 class="h5 mb-3">Popular</h3>
        <ul class="list-unstyled">
          <li class="mb-2"><a href="#" class=" text-decoration-none hover-text-primary">Toyota Camry</a></li>
          <li class="mb-2"><a href="#" class=" text-decoration-none hover-text-primary">Honda Accord</a></li>
          <li class="mb-2"><a href="#" class=" text-decoration-none hover-text-primary">Ford F-150</a></li>
          <li class="mb-2"><a href="#" class=" text-decoration-none hover-text-primary">Chevrolet Silverado</a></li>
          <li><a href="#" class=" text-decoration-none hover-text-primary">Nissan Rogue</a></li>
        </ul>
      </div>

      <!-- Useful Links Column -->
      <div class="col-lg-3 col-md-6">
        <h3 class="h5 mb-3">Useful Links</h3>
        <ul class="list-unstyled">
          <li class="mb-2"><a href="../index.html" class=" text-decoration-none hover-text-primary">Home</a></li>
          <li class="mb-2"><a href="#" class=" text-decoration-none hover-text-primary">About Us</a></li>
          <li class="mb-2"><a href="#" class=" text-decoration-none hover-text-primary">Services</a></li>
          <li class="mb-2"><a href="../pages/contactUs.html" class=" text-decoration-none hover-text-primary">Contact</a></li>
          <li><a href="#" class=" text-decoration-none hover-text-primary">Privacy Policy</a></li>
        </ul>
      </div>

      <!-- Car Types Column -->
      <div class="col-lg-3 col-md-6">
        <h3 class="h5 mb-3">Cars</h3>
        <ul class="list-unstyled">
          <li class="mb-2"><a href="#" class=" text-decoration-none hover-text-primary">Sedan</a></li>
          <li class="mb-2"><a href="#" class=" text-decoration-none hover-text-primary">SUV</a></li>
          <li class="mb-2"><a href="#" class=" text-decoration-none hover-text-primary">Coupe</a></li>
          <li class="mb-2"><a href="#" class=" text-decoration-none hover-text-primary">Convertible</a></li>
          <li><a href="#" class=" text-decoration-none hover-text-primary">Pickup Truck</a></li>
        </ul>
      </div>
    </div>

    <!-- Copyright Section -->
    <div class="text-center py-3 border-top border-secondary">
      <p class="mb-0 ">&copy; ${new Date().getFullYear()} Car Rental. All rights reserved.</p>
    </div>
  </div>
</footer>
  `;

export const initFooter = () => {
  document.addEventListener("DOMContentLoaded", () => {
    const footerContainer = document.querySelector(".footer-container");
    if (footerContainer) {
      footerContainer.innerHTML = footer;
    }
  });
};
