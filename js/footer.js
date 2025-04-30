const footer = `
  <div class="footer-contact-row">
    <!-- Logo Section -->
    <div class="footer-brand">
      <div class="main-logo" style="width: var(--logo-width);">
        <img src="../assets/logo.svg" alt="CAREANT Logo" class="img-fluid marker" />
      </div>
    </div>

    <!-- Address Section -->
    <div class="footer-contact-item">
      <i class="bi bi-geo-alt-fill footer-icon"></i>
      <div class="contact-text">
        <p class="footer-label">Address</p>
        <p>123 Main Street, Cairo</p>
      </div>
    </div>

    <!-- Email Section -->
    <div class="footer-contact-item">
      <i class="bi bi-envelope-fill footer-icon"></i>
      <div class="contact-text">
        <p class="footer-label">Email</p>
        <p>info@carental.com</p>
      </div>
    </div>

    <!-- Phone Section -->
    <div class="footer-contact-item">
      <i class="bi bi-telephone-fill footer-icon"></i>
      <div class="contact-text">
        <p class="footer-label">Contact</p>
        <p>+20 123 456 789</p>
      </div>
    </div>
  </div>

  <!-- Second Section: Links -->
  <div class="footer-links-row">
    <!-- Social Media Column -->
    <div class="footer-links-column">
      <h3 class="links-heading">Follow Us</h3>
      <p class="links-description">
        Follow our journey and stay updated with our latest fleet additions,
        special offers, and travel tips from the road
      </p>
      <div class="social-icons">
        <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
        <a href="#" aria-label="Twitter"><i class="bi bi-twitter"></i></a>
        <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
        <a href="#" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
      </div>
    </div>

    <!-- Popular Cars Column -->
    <div class="footer-links-column">
      <h3 class="links-heading">Popular</h3>
      <ul class="footer-link-list">
        <li>Toyota Camry</li>
        <li>Honda Accord</li>
        <li>Ford F-150</li>
        <li>Chevrolet Silverado</li>
        <li>Nissan Rogue</li>
      </ul>
    </div>

    <!-- Useful Links Column -->
    <div class="footer-links-column">
      <h3 class="links-heading">Useful Links</h3>
      <ul class="footer-link-list">
        <li><a href="#">Home</a></li>
        <li><a href="#">About Us</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Contact</a></li>
        <li><a href="#">Privacy Policy</a></li>
      </ul>
    </div>

    <!-- Car Types Column -->
    <div class="footer-links-column">
      <h3 class="links-heading">Cars</h3>
      <ul class="footer-link-list">
        <li>Sedan</li>
        <li>SUV</li>
        <li>Coupe</li>
        <li>Convertible</li>
        <li>Pickup Truck</li>
      </ul>
    </div>
  </div>

  <!-- Copyright Section -->
  <div class="footer-copyright">
    <p>&copy; 2025 CAREANT Luxury Rentals. All rights reserved.</p>
  </div>
`;
document.addEventListener("DOMContentLoaded", () => {
  footerContainer = document.querySelector(".footer-container");
  if (footerContainer) {
    footerContainer.innerHTML = footer;
  }
});
