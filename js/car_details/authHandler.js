import { showToast } from './uiHelpers.js';
import { hideBookingElements, setupBookingSystem, handleBooking } from './bookingHandler.js';

//authorization check and ui update
export function setupAuthorizationCheck() {
    const rentButton = document.getElementById('rent-btn');
    const loginSection = document.getElementById('login-signup');
    
    const currentUser = window.usersClass.getCurrentUser();
    const confirmPasswordContainer = document.getElementById('confirm-password-container');
    const registerLinkContainer = document.getElementById('register-link-container');
    
    if(!currentUser){
        handleGuestUser(rentButton, loginSection, confirmPasswordContainer, registerLinkContainer);
    } else {
        handleAuthorizedUser(rentButton, loginSection, currentUser);
    }
}

//Handle click on the rent button
export function authClickHandler() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const confirmPasswordContainer = document.getElementById('confirm-password-container');
    const registerLinkContainer = document.getElementById('register-link-container');
    
    handleAuthOnRentClick(emailInput, passwordInput, confirmPasswordInput, confirmPasswordContainer, registerLinkContainer);
}

//Handle guest user 
export function handleGuestUser(rentButton) {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    const formInputs = [emailInput, passwordInput, confirmPasswordInput];
    
    formInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                const isFormValid = validateForm();
                rentButton.disabled = !isFormValid;
            });
        }
    });
    
    const isFormValid = validateForm();
    rentButton.disabled = !isFormValid;
    
    if (!rentButton.hasEventListener) {
        rentButton.addEventListener('click', authClickHandler);
        rentButton.hasEventListener = true;
    }
}

//Handle authorized user state
export function handleAuthorizedUser(rentButton, loginSection, currentUser) {
    // Hide the login/signup form section but keep the rent booking 
    // functionality in case they didnt rent when signingup/logging in
    loginSection.style.display = 'none';
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            const logoutResult = window.usersClass.logout();
            if (logoutResult.success) {
                showToast('Logged out successfully', 'success');
                
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                showToast('Logout failed: ' + logoutResult.message, 'danger');
            }
        });
    }
    
    // Don't enable the rent button for admin users
    if (currentUser.role !== 'admin') {
        rentButton.disabled = false;
        setupBookingSystem();
    } else {
        // Hide booking elements for admin users
        hideBookingElements();
        
        const adminAlert = document.createElement('div');
        adminAlert.className = 'alert alert-info alert-dismissible fade show me-5';
        adminAlert.role = 'alert';
        adminAlert.innerHTML = `
            <strong>Admin account detected!</strong> You can access the 
            <a href="./admin/admin.html" class="alert-link">Admin Dashboard</a> to manage the system.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        // Insert the alert after the login section
        loginSection.parentNode.insertBefore(adminAlert, loginSection.nextSibling);
    }
}

//Validate form inputs
export function validateForm() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordContainer = document.getElementById('confirm-password-container');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    if (!emailInput.value || !passwordInput.value) {
        return false;
    }
    
    if (confirmPasswordContainer.style.display !== 'none' && 
        (!confirmPasswordInput.value || confirmPasswordInput.value !== passwordInput.value)) {
        return false;
    }
    
    return true;
}

//Handle authentication when rent button is clicked
export function handleAuthOnRentClick(emailInput, passwordInput, confirmPasswordInput, confirmPasswordContainer) {
    const isRegistering = confirmPasswordContainer.style.display !== 'none';
    const email = emailInput.value;
    const password = passwordInput.value;
    
    if (!email || !password) {
        showToast('Please fill in all required fields', 'danger');
        return;
    }
    
    if (!document.querySelector('.rent-after-login')) {
        const flag = document.createElement('div');
        flag.className = 'rent-after-login';
        flag.style.display = 'none';
        document.body.appendChild(flag);
    }
    
    if (isRegistering) {
        const confirmPassword = confirmPasswordInput.value;
        if (!confirmPassword || confirmPassword !== password) {
            showToast('Passwords do not match', 'danger');
            return;
        }
        handleRegistration(email, password);
    } else {
        handleLogin(email, password);
    }
}

//Handle registration
export function handleRegistration(email, password) {
    const username = email.split('@')[0];
    const name = username;
    const phone = '+123-456-78911';
    
    const registerResult = window.usersClass.register(username, email, password, phone, name);
    
    if (registerResult.success) {
        showToast('Registration successful!', 'success');
        handleLogin(email, password, true);
    } else {
        showToast(registerResult.message, 'danger');
    }
}

//Handle login
export function handleLogin(email, password, fromRegistration = false) {
    const loginResult = window.usersClass.login(email, password);
    
    if (loginResult.success) {
        if (!fromRegistration) {
            showToast('Login successful!', 'success');
        }
        
        const rentButton = document.getElementById("rent-btn");
        const loginSection = document.getElementById("login-signup");
        const currentUser = window.usersClass.getCurrentUser();
        
        rentButton.removeEventListener('click', authClickHandler);
        handleAuthorizedUser(rentButton, loginSection, currentUser);
        
       // Only proceed with booking if this is not an admin user
       if (currentUser.role !== 'admin') {
        const shouldRent = document.querySelector(".rent-after-login");
        if (fromRegistration || shouldRent) {
            if (shouldRent) {
                shouldRent.remove();
            }
            
            setTimeout(() => {
                handleBooking();
            }, 500);
        }
    } else {
        // If admin user, clean up the rent flag
        const shouldRent = document.querySelector(".rent-after-login");
        if (shouldRent) {
            shouldRent.remove();
        }
        
        showToast('Admin users cannot make bookings', 'warning');
        
        // Ensure admin users can't book by disabling the rent button
        rentButton.disabled = true;
        
        // Remove any existing event listeners to prevent booking
        const newRentButton = rentButton.cloneNode(true);
        rentButton.parentNode.replaceChild(newRentButton, rentButton);
    }
    } else {
        showToast(loginResult.message, 'danger');
    }
}