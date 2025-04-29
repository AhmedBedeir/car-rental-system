import Cars from "./classes/Cars.js";
import Users from "./classes/Users.js";

const carsClass = new Cars();
const usersClass = new Users();

const init = async () => {
    await carsClass.ready;
    await usersClass.ready;
    extractDisplayDetails();
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


//TODO: Refactor this
/* 
rentButton.addEventListener('click', function() {
const currentUser = usersClass.getCurrentUser();

if (!currentUser) {
showToast('Please log in to rent a car', 'danger');
return;
}

const urlParams = new URLSearchParams(window.location.search);
const carId = urlParams.get('car_id');
const car = carsClass.getCarById(carId);

if (!calendar || !calendar.context || !calendar.context.selectedDates) {
showToast('Calendar not found or no dates selected', 'danger');
return;
}

const selectedDates = calendar.context.selectedDates;

if (selectedDates.length < 2) {
showToast('Please select pickup and return dates', 'warning');
return;
}

selectedDates.sort((a, b) => new Date(a) - new Date(b));
const firstDate = new Date(selectedDates[0]);
const lastDate = new Date(selectedDates[selectedDates.length - 1]);

firstDate.setHours(10, 0, 0, 0);
lastDate.setHours(10, 0, 0, 0);

const pickupISOString = firstDate.toISOString().slice(0, 16);
const returnISOString = lastDate.toISOString().slice(0, 16);

const diffTime = Math.abs(lastDate - firstDate);
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
const totalAmount = diffDays * car.pricePerDay;

// Create booking object
const booking = {
carId: carId,
userId: currentUser.id,
pickupDate: pickupISOString,
returnDate: returnISOString,
totalDays: diffDays,
totalAmount: totalAmount,
status: "pending"
};
console.log('Booking Object:', booking);

const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
bookings.push(booking);
localStorage.setItem('bookings', JSON.stringify(bookings));

console.log('Stored Bookings in localStorage:', bookings);

showToast(`Booking successful! Total: $${totalAmount}`, 'success');
});


} */



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
    
    // rent button authorization
    if (!rentButton.hasEventListener) {
        rentButton.addEventListener('click', function() {
            handleAuthOnRentClick(emailInput, passwordInput, confirmPasswordInput, confirmPasswordContainer, registerLinkContainer);
        });
        rentButton.hasEventListener = true; // prevent multiple event listeners
    }
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
        setTimeout(() => {
            handleLogin(email, password);
        }, 1000);
    } else {
        showToast(registerResult.message, 'danger');
    }
}

function handleLogin(email, password) {
    const loginResult = usersClass.login(email, password);
    
    if (loginResult.success) {
        showToast('Login successful!', 'success');
        // Reload the page to show the logged-in user interface
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    } else {
        showToast(loginResult.message, 'danger');
    }
}

/*
// Booking logic
document.getElementById('rent-btn').addEventListener('click', function() {
const currentUser = usersClass.getCurrentUser();

if (!currentUser) {
showToast('Please log in to rent a car', 'danger');
return;
}

const urlParams = new URLSearchParams(window.location.search);
const carId = urlParams.get('car_id');
const car = carsClass.getCarById(carId);

const selectedDates = getSelectedDatesFromCalendar();

if (!selectedDates || selectedDates.length < 2) {
showToast('Please select pickup and return dates', 'warning');
return;
}

const [firstDate, lastDate] = selectedDates.sort((a, b) => new Date(a) - new Date(b));
const totalAmount = calculateTotalAmount(firstDate, lastDate, car.pricePerDay);

const booking = createBookingObject(carId, currentUser.id, firstDate, lastDate, totalAmount);

saveBookingToLocalStorage(booking);
showToast(`Booking successful! Total: $${totalAmount}`, 'success');
});

function getSelectedDatesFromCalendar() {
const calendar = document.getElementById('calendar');
return calendar?.context?.selectedDates || [];
}

function calculateTotalAmount(firstDate, lastDate, pricePerDay) {
const diffTime = Math.abs(lastDate - firstDate);
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
return diffDays * pricePerDay;
}

function createBookingObject(carId, userId, pickupDate, returnDate, totalAmount) {
return {
carId,
userId,
pickupDate: pickupDate.toISOString().slice(0, 16),
returnDate: returnDate.toISOString().slice(0, 16),
totalDays: (returnDate - pickupDate) / (1000 * 60 * 60 * 24),
totalAmount,
status: "pending"
};
}

function saveBookingToLocalStorage(booking) {
const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
bookings.push(booking);
localStorage.setItem('bookings', JSON.stringify(bookings));
}*/





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
