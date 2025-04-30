import Cars from "./classes/Cars.js";
import Users from "./classes/Users.js";
import Booking from "./classes/booking.js";

const carsClass = new Cars();
const usersClass = new Users();
const bookingClass = new Booking();

const init = async () => {
    await carsClass.ready;
    await usersClass.ready;
    await bookingClass.ready;
    extractDisplayDetails();
    checkCarAvailability(); // Add availability check before auth setup
    setupAuthorizationCheck();
};

//extarct car details from url
function extractDisplayDetails() {
    const carId = new URLSearchParams(window.location.search).get('car_id');
    const car = carsClass.getCarById(carId);
    console.log(car);
    
    //car exists
    if (car) {
        updateNamePrice(car);
        updateImgs(car);
        updateFeatures(car);
    }
    // car not found 
    else {
        carNotFoundRedirect();
    }
}

function updateNamePrice(car){
    //display car name and price / day
    document.getElementById("car-name").textContent = `${car.brand} ${car.model}`;
    document.getElementById("price").textContent = `$${car.pricePerDay}/day`;
}

function updateImgs(car){
    // display main image
    document.getElementById("main-car-img").src = car.images[0];
    document.getElementById("main-car-img").alt = `${car.brand} ${car.model}`;
    
    //display other images
    const otherImagesContainer = document.getElementById("other-images-container");
    otherImagesContainer.innerHTML = "";
    for (let i = 1; i < car.images.length; i++) {
        const img = document.createElement("img");
        img.className = "other-imgs";
        img.src = car.images[i];
        img.alt = `${car.brand} ${car.model} - image ${i + 1}`;
        otherImagesContainer.appendChild(img);
    }
}

function updateFeatures(car){
    // display car features
    const featureColumnsContainer = document.getElementById("feature-columns");
    featureColumnsContainer.innerHTML = "";
    
    for (let i = 0; i < car.features.length; i += 3) {
        const column = document.createElement("div");
        column.className = "col-12 col-md-4 d-flex flex-column gap-2";
        
        for (let j = i; j < i + 3 && j < car.features.length; j++) {
            const item = document.createElement("div");
            item.className = "car-equips d-flex align-items-center";
            item.innerHTML = `
                <i class="bi bi-check-circle-fill me-2"></i>
                <p class="mb-0">${car.features[j]}</p>
            `;
            column.appendChild(item);
        }
        
        featureColumnsContainer.appendChild(column);
    }
}

function carNotFoundRedirect(){
    document.querySelector("main").innerHTML = `
            <div id="car-not-found" class="d-flex flex-column justify-content-center align-items-center text-center w-100" style="height: 100vh;">
                <div>
                    <img src="../assets/noCar.svg" alt="Car not found" class="img-fluid" style="max-width: 300px;">
                    <h2 class="mt-3">Car not found</h2>
                    <p id="redirect-msg" class="mt-2 fs-5">Redirecting you to the home page in 3...</p>
                </div>
            </div>
        `;
    
    //redirect back to home in 3 seconds
    let count = 4;
    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            document.getElementById("redirect-msg").textContent = `Redirecting you to the home page in ${count}...`;
        } else {
            clearInterval(interval);
            window.location.href = "../index.html";
        }
    }, 1000);
}

// Updated checkCarAvailability()
function checkCarAvailability() {
    const carId = new URLSearchParams(window.location.search).get('car_id');
    const car = carsClass.getCarById(carId);
    
    // Show maintenance message if car is unavailable
    if (car.available === false) {
        displayUnavailableMessage();
        hideBookingElements();
        return;
    }

    // Check for active bookings
    const allBookings = bookingClass.getBookings();
    const today = new Date();
    
    // Find the first active booking for this car
    const activeBooking = allBookings.find(booking => {
        if (!booking || booking.carId !== carId) return false;
        try {
            const returnDate = new Date(booking.returnDate);
            return returnDate >= today;
        } catch {
            return false;
        }
    });

    if (activeBooking) {
        displayUnavailableMessage(activeBooking); // Pass the booking object
        hideBookingElements();
    }
}

function displayUnavailableMessage(booking) {
    // Clear existing alerts first
    const existingAlerts = document.querySelectorAll('.alert.alert-warning');
    existingAlerts.forEach(alert => alert.remove());

    const alertContainer = document.createElement('div');
    alertContainer.className = 'alert alert-warning mt-3';
    alertContainer.role = 'alert';

    let messageContent = '';
    
    if (booking && booking.returnDate) {
        try {
            const returnDate = new Date(booking.returnDate);
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            
            messageContent = `
                <h4 class="alert-heading">Car Currently Booked</h4>
                <p>This vehicle will be available after:</p>
                <div class="fw-bold mb-2">
                    ${returnDate.toLocaleDateString('en-US', options)}
                </div>
                <p>Please check back after this date to rent again.</p>
            `;
        } catch (error) {
            console.error('Invalid return date format:', error);
            messageContent = `
                <h4 class="alert-heading">Vehicle Unavailable</h4>
                <p>This car is currently booked by another user.</p>
            `;
        }
    } else {
        messageContent = `
            <h4 class="alert-heading">Vehicle Unavailable</h4>
            <p>This car is temporarily out of service for maintenance.</p>
            <p class="mb-0">Please check back later or contact support.</p>
        `;
    }

    alertContainer.innerHTML = messageContent;

    const carEquipmentContainer = document.getElementById('car-equipment-container');
    if (carEquipmentContainer) {
        carEquipmentContainer.parentNode.insertBefore(alertContainer, carEquipmentContainer);
    }
}

// Hide calendar and input fields and rent button when car is unavailable
function hideBookingElements() {
    const calendarElement = document.getElementById('calendar');
    if (calendarElement) {
        calendarElement.style.display = 'none';
    }
    
    const loginSignup = document.getElementById('login-signup');
    if (loginSignup) {
        loginSignup.style.display = 'none';
    }
    
    const rentBtn = document.getElementById('rent-btn');
    if (rentBtn) {
        rentBtn.style.display = 'none';
    }
}

function setupAuthorizationCheck() {
    const rentButton = document.getElementById('rent-btn');
    const loginSection = document.getElementById('login-signup');
    
    //user object
    const currentUser = usersClass.getCurrentUser();
    const confirmPasswordContainer = document.getElementById('confirm-password-container');
    const registerLinkContainer = document.getElementById('register-link-container');
    
    console.log(currentUser);
    
    if(!currentUser){
        handleLoggedOutUser(rentButton, loginSection, confirmPasswordContainer, registerLinkContainer);
    }else{
        handleLoggedInUser(rentButton, loginSection, currentUser);
    }
}

function authClickHandler() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const confirmPasswordContainer = document.getElementById('confirm-password-container');
    const registerLinkContainer = document.getElementById('register-link-container');

    handleAuthOnRentClick(emailInput, passwordInput, confirmPasswordInput, confirmPasswordContainer, registerLinkContainer);
}

function handleLoggedOutUser(rentButton, loginSection, confirmPasswordContainer, registerLinkContainer) {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    const formInputs = [emailInput, passwordInput, confirmPasswordInput];
    
    // event listener to validate form and update button state
    formInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                // enable the button when form is valid
                const isFormValid = validateForm();
                rentButton.disabled = !isFormValid;
            });
        }
    });
    
    // Set initial button state
    const isFormValid = validateForm();
    rentButton.disabled = !isFormValid;
    
    if (!rentButton.hasEventListener) {
        rentButton.addEventListener('click', authClickHandler);
        rentButton.hasEventListener = true;
    }
}

function setupBookingSystem() {
    const rentButton = document.getElementById('rent-btn');
    
    // Remove previous existing event listeners to prevent duplicates
    rentButton.removeEventListener('click', handleBooking);
    
    // Add the booking handler
    rentButton.addEventListener('click', handleBooking);
}

function handleLoggedInUser(rentButton, loginSection, currentUser) {
    // Enable the rent button for logged-in users
    rentButton.disabled = false;
    
    // remove inputs and show user info(can be removable)
    // i just put it to be able to log out and try admin and wrong users
    loginSection.innerHTML = `<div class="user-info p-3 border rounded mb-3">
        <h5>Welcome, ${currentUser.name || currentUser.username}</h5>
        <p class="mb-2">You are logged in as: ${currentUser.email}</p>
        <button id="logout-btn" class="btn btn-outline-secondary btn-sm">Logout</button>
    </div>`;
    
    console.log("Logged in user UI displayed:", loginSection.innerHTML);
    
    // logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            const logoutResult = usersClass.logout();
            if (logoutResult.success) {
                showToast('Logged out successfully', 'success');
                
                // Reload after logging out
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                showToast('Logout failed: ' + logoutResult.message, 'danger');
            }
        });
    }
    
    // Initialize the booking system now that user is logged in
    setupBookingSystem();
    
    // If user is admin, redirect to admin page
    if (currentUser.role === 'admin') {
        showToast('Redirecting to admin dashboard...', 'info');
        setTimeout(() => {
            window.location.href = './admin/admin.html';
        }, 1500);
    }
}

function validateForm() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordContainer = document.getElementById('confirm-password-container');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    if (!emailInput.value || !passwordInput.value) {
        return false;
    }
    
    if (confirmPasswordContainer.style.display !== 'none' && (!confirmPasswordInput.value || confirmPasswordInput.value !== passwordInput.value)) {
        return false;
    }
    
    return true;
}

function handleAuthOnRentClick(emailInput, passwordInput, confirmPasswordInput, confirmPasswordContainer, registerLinkContainer) {
    const isRegistering = confirmPasswordContainer.style.display !== 'none'; // Check if user is registering
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

function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    const toastId = `toast-${Date.now()}`;
    
    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

function handleRegistration(email, password) {
    const username = email.split('@')[0];
    const name = username;
    const phone = '+123-456-78911';
    
    const registerResult = usersClass.register(username, email, password, phone, name);
    console.log(registerResult);
    
    
    if (registerResult.success) {
        showToast('Registration successful!', 'success');
        // Log the user in after successful registration
        handleLogin(email, password, true);
    } else {
        showToast(registerResult.message, 'danger');
    }
}

function handleLogin(email, password, fromRegistration = false) {
    const loginResult = usersClass.login(email, password);
    
    if (loginResult.success) {
        if (!fromRegistration) {
            showToast('Login successful!', 'success');
        }

        //update UI
        const rentButton = document.getElementById("rent-btn");
        const loginSection = document.getElementById("login-signup");
        const currentUser  = usersClass.getCurrentUser();

        rentButton.removeEventListener('click', authClickHandler);
        handleLoggedInUser(rentButton, loginSection, currentUser);

        const shouldRent = document.querySelector(".rent-after-login");
        if (fromRegistration || shouldRent) {
            if (shouldRent) {
                shouldRent.remove();
            }

            // Wait for UI updates before renting
            setTimeout(() => {
                handleBooking(); // directly call the booking
            }, 500);
        }
        console.log("Booking triggered after login:", new Date());
    } else {
        showToast(loginResult.message, 'danger');
    }
}



function handleBooking() {
    const currentUser = usersClass.getCurrentUser();
    if (!currentUser) {
        return showToast('Please log in to rent a car', 'danger');
    }
    
    const car = getSelectedCar();
    if (!car) {
        return showToast('Car not found', 'danger');
    }
    
    const [pickupDate, returnDate] = getSortedSelectedDates();
    console.log('Pickup Date:', pickupDate);
    console.log('Return Date:', returnDate);
    if (!pickupDate || !returnDate) {
        return showToast('Please select pickup and return dates', 'warning');
    }
    
    if (isSameDay(pickupDate, returnDate)) {
        return showToast('Pickup and return dates cannot be the same day', 'warning');
    }
    
    if (isDuplicateBooking(car.id, pickupDate, returnDate)) {
        return showToast('You already have a booking for this car during these dates', 'warning');
    }
    
    const totalAmount = calculateTotalAmount(pickupDate, returnDate, car.pricePerDay);
    console.log('Total Amount:', totalAmount);
    const booking = buildBooking(car.id, currentUser.id, pickupDate, returnDate, totalAmount);
    console.log('Booking Object:', booking);
    
    bookingClass.bookings.push(booking);
    bookingClass.saveToLocalStorage();
    // check after booking
    checkCarAvailability();
    showToast(`Booking successful! Total: $${totalAmount}`, 'success');
}

// Check if two dates are the same day
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

// see if there is a previous booking for this car on these dates
function isDuplicateBooking(carId, pickupDate, returnDate) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const currentUser = usersClass.getCurrentUser();
    
    return bookings.some(booking => {
        if (booking.carId !== carId || booking.userId !== currentUser.id) {
            return false;
        }
        
        const existingPickup = new Date(booking.pickupDate);
        const existingReturn = new Date(booking.returnDate);
        
        // Check for date overlap
        return (
            // New booking starts during an existing booking
            (pickupDate >= existingPickup && pickupDate <= existingReturn) ||
            // New booking ends during an existing booking
            (returnDate >= existingPickup && returnDate <= existingReturn) ||
            // New booking encompasses an existing booking
            (pickupDate <= existingPickup && returnDate >= existingReturn)
        );
    });
}

function getSelectedCar() {
    const carId = new URLSearchParams(window.location.search).get('car_id');
    return carsClass.getCarById(carId);
}

function getSortedSelectedDates() {
    if (!calendar || !calendar.context || !calendar.context.selectedDates || calendar.context.selectedDates.length < 2) {
        return [];
    }
    
    const dates = calendar.context.selectedDates.map(dateStr => {
        const [year, month, day] = dateStr.split('-');
        const dateObj = new Date(year, month - 1, day);
        
        if (isNaN(dateObj.getTime())) {
            console.log('Invalid date:', dateStr);
            return null;
        }
        
        const selectedTime = calendar.context.selectedTime;
        console.log('Selected Time (Raw):', selectedTime);
        
        // Parse 12-hour time (e.g., "04:00 PM") into 24-hour format
        if (typeof selectedTime === 'string') {
            const [time, period] = selectedTime.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            
            if (period === 'PM' && hours !== 12) {
                hours += 12; // Convert PM to 24-hour (except 12 PM)
            } else if (period === 'AM' && hours === 12) {
                hours = 0; // 12 AM becomes 00:00
            }
            
            dateObj.setHours(hours, minutes, 0, 0);
        }
        // If selectedTime is an object (e.g., { hours: 16, minutes: 0 })
        else if (selectedTime && selectedTime.hours !== undefined && selectedTime.minutes !== undefined) {
            dateObj.setHours(selectedTime.hours, selectedTime.minutes, 0, 0);
        }
        // Default to 00:00 if time selection gives error for any reason
        else {
            dateObj.setHours(0, 0, 0, 0);
        }
        
        console.log('Updated Date Object (local):', dateObj.toString());
        console.log('Updated Date Object (ISO):', dateObj.toISOString());
        
        return dateObj;
    }).filter(date => date !== null);
    
    return dates.sort((a, b) => a - b);
}


function calculateTotalAmount(startDate, endDate, pricePerDay) {
    const durationDays = getDateDifferenceInDays(startDate, endDate);
    return durationDays * pricePerDay;
}

function getDateDifferenceInDays(start, end) {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.ceil(Math.abs(end - start) / msPerDay);
}

function buildBooking(carId, userId, pickupDate, returnDate, totalAmount) {
    return {
        carId,
        userId,
        pickupDate: pickupDate.toString(),
        returnDate: returnDate.toString(),
        totalDays: getDateDifferenceInDays(pickupDate, returnDate),
        totalAmount,
        status: 'pending',
    };
}


// Initialize the page
init();

document.addEventListener('DOMContentLoaded', () => {
    // Hover effect on range INPUTS (hour and minute) when RANGES are hovered 
    rangeHoverEffects();
    
    // toggle between register and login forms and links
    toggleRegisterLogin();
});

function rangeHoverEffects() {
    const ranges = [
        { selector: 'label[data-vc-time-range="hour"] input', inputSelector: 'label[data-vc-time-input="hour"] input' },
        { selector: 'label[data-vc-time-range="minute"] input', inputSelector: 'label[data-vc-time-input="minute"] input' }
    ];
    
    ranges.forEach(({ selector, inputSelector }) => {
        const range = document.querySelector(selector);
        const input = document.querySelector(inputSelector);
        
        if (range && input) {
            range.addEventListener('mouseenter', () => changeInputBackground(input, true)); // doesnt work as a direct callbaxk
            range.addEventListener('mouseleave', () => changeInputBackground(input, false));
        }
    });
}

function changeInputBackground(input, isHovered) {
    if (isHovered) {
        input.style.backgroundColor = 'var(--border-color)';
    } else {
        input.style.backgroundColor = '';
    }
}

function toggleRegisterLogin(){
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    const registerLinkContainer = document.getElementById('register-link-container');
    const confirmPasswordContainer = document.getElementById('confirm-password-container');
    
    if (showRegisterLink && showLoginLink && confirmPasswordContainer) {
        // Toggle password confirmation (when "don't have an account" is clicked)
        showRegisterLink.addEventListener('click', (e) => {
            // prevent acting like page navigation
            e.preventDefault();
            toggleConfirmPassword(confirmPasswordContainer, registerLinkContainer, true);
        });
        
        // or "already have an account" is clicked
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleConfirmPassword(confirmPasswordContainer, registerLinkContainer, false);
        });
    }
}

function toggleConfirmPassword(confirmPasswordContainer, registerLinkContainer, showConfirmPassword) {
    //show confirm password, hide "dont have an account"
    if (showConfirmPassword) {
        confirmPasswordContainer.style.display = 'block';
        registerLinkContainer.style.display = 'none';
    }
    //hide confirm password, show "dont have an account"
    else {
        confirmPasswordContainer.style.display = 'none';
        registerLinkContainer.style.display = 'block';
    }
}

//TODO: add car description right after the images
//TODO:edit other images width&height(object fit:cover?)
