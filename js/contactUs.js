document.addEventListener("DOMContentLoaded", function () {
    // Regular expressions for validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{11}$/;
  
    // Real-time validation for each field
    document.getElementById("name").addEventListener("input", function () {
      const nameField = this;
      if (nameField.value.trim() === "") {
        nameField.classList.add("is-invalid");
        nameField.classList.remove("is-valid");
      } else {
        nameField.classList.add("is-valid");
        nameField.classList.remove("is-invalid");
      }
    });
  
    document.getElementById("email").addEventListener("input", function () {
      const emailField = this;
      if (emailRegex.test(emailField.value.trim())) {
        emailField.classList.add("is-valid");
        emailField.classList.remove("is-invalid");
      } else {
        emailField.classList.add("is-invalid");
        emailField.classList.remove("is-valid");
      }
    });
  
    document.getElementById("phone").addEventListener("input", function () {
      const phoneField = this;
      if (phoneRegex.test(phoneField.value.trim())) {
        phoneField.classList.add("is-valid");
        phoneField.classList.remove("is-invalid");
      } else {
        phoneField.classList.add("is-invalid");
        phoneField.classList.remove("is-valid");
      }
    });
  
    document.getElementById("message").addEventListener("input", function () {
      const messageField = this;
      if (messageField.value.trim() === "") {
        messageField.classList.add("is-invalid");
        messageField.classList.remove("is-valid");
      } else {
        messageField.classList.add("is-valid");
        messageField.classList.remove("is-invalid");
      }
    });
  
    // Submit validation
    document.getElementById("contactForm").addEventListener("submit", function (e) {
      e.preventDefault();  // Stop the form from submitting
  
      let valid = true;
  
      // Validate Name field
      const nameField = document.getElementById("name");
      if (nameField.value.trim() === "") {
        valid = false;
        nameField.classList.add("is-invalid");
        nameField.classList.remove("is-valid");
      }
  
      // Validate Email field
      const emailField = document.getElementById("email");
      if (!emailRegex.test(emailField.value.trim())) {
        valid = false;
        emailField.classList.add("is-invalid");
        emailField.classList.remove("is-valid");
      }
  
      // Validate Phone field
      const phoneField = document.getElementById("phone");
      if (!phoneRegex.test(phoneField.value.trim())) {
        valid = false;
        phoneField.classList.add("is-invalid");
        phoneField.classList.remove("is-valid");
      }
  
      // Validate Message field
      const messageField = document.getElementById("message");
      if (messageField.value.trim() === "") {
        valid = false;
        messageField.classList.add("is-invalid");
        messageField.classList.remove("is-valid");
      }
  
      // If all fields are valid, submit the form
      if (valid) {
        alert("Form submitted successfully!");
        
        // Reset the form fields and validation classes
        this.reset();
        this.classList.remove("was-validated");  // Remove validation classes
      } else {
        alert("Please fill out all fields correctly.");
      }
    });
  });
  