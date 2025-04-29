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








function setupAuthorizationCheck() {
    const rentButton = document.getElementById('rent-btn');
    const loginSection = document.getElementById('login-signup');
    const currentUser = usersClass.getCurrentUser();
    const confirmPasswordContainer = document.getElementById('confirm-password-container');
    const registerLinkContainer = document.getElementById('register-link-container');
    
    if (!document.getElementById('toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
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
    
    if (currentUser) {
        rentButton.disabled = false;
        
        loginSection.innerHTML = `
            <div class="alert alert-success mb-3">
                <h5>Welcome, ${currentUser.name || currentUser.username}!</h5>
                <p class="mb-0">You are logged in and can rent cars.</p>
            </div>
        `;
    } else {
        rentButton.disabled = true;
        
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        
        const formInputs = [emailInput, passwordInput, confirmPasswordInput];
        
        formInputs.forEach(input => {
            if (input) {
                input.addEventListener('input', validateForm);
            }
        });
        
        const loginSignupContainer = document.createElement('div');
        loginSignupContainer.className = 'text-center mt-3';
        loginSignupContainer.innerHTML = `
            <button id="auth-btn" class="btn btn-primary">Login</button>
        `;
        
        loginSection.appendChild(loginSignupContainer);
        
        const authButton = document.getElementById('auth-btn');
        authButton.addEventListener('click', handleAuth);
        
        document.getElementById('show-register-link').addEventListener('click', function(event) {
            event.preventDefault();
            confirmPasswordContainer.style.display = 'block';
            registerLinkContainer.style.display = 'none';
            authButton.textContent = 'Register'; // Update button text
        });
        
        document.getElementById('show-login-link').addEventListener('click', function(event) {
            event.preventDefault();
            confirmPasswordContainer.style.display = 'none';
            registerLinkContainer.style.display = 'block';
            authButton.textContent = 'Login';
        });
    }
    
    function validateForm() {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordContainer = document.getElementById('confirm-password-container');
        const confirmPasswordInput = document.getElementById('confirm-password');
        
        if (!emailInput.value || !passwordInput.value) {
            return false;
        }
        
        if (confirmPasswordContainer.style.display !== 'none') {
            if (!confirmPasswordInput.value || confirmPasswordInput.value !== passwordInput.value) {
                return false;
            }
        }
        
        return true;
    }
    
    function handleAuth(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const isRegistering = confirmPasswordContainer.style.display !== 'none';
        
        if (isRegistering) {
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (!email || !password) {
                showToast('Please fill all required fields', 'danger');
                return;
            }
            
            if (password !== confirmPassword) {
                showToast('Passwords do not match', 'danger');
                return;
            }
            
            const username = email.split('@')[0];
            const name = username;
            const phone = '';
            
            const registerResult = usersClass.register(username, email, password, phone, name);
            
            if (registerResult.success) {
                showToast('Registration successful!', 'success');
                rentButton.disabled = false;
                
                loginSection.innerHTML = `
                    <div class="alert alert-success mb-3">
                        <h5>Welcome, ${registerResult.user.name || registerResult.user.username}!</h5>
                        <p class="mb-0">You are logged in and can rent cars.</p>
                    </div>
                `;
            } else {
                showToast(registerResult.message, 'danger');
            }
        } else {
            if (!email || !password) {
                showToast('Please enter both email and password', 'danger');
                return;
            }
            
            const loginResult = usersClass.login(email, password);
            
            if (loginResult.success) {
                showToast('Login successful!', 'success');
                rentButton.disabled = false;
                
                loginSection.innerHTML = `
                    <div class="alert alert-success mb-3">
                        <h5>Welcome, ${loginResult.user.name || loginResult.user.username}!</h5>
                        <p class="mb-0">You are logged in and can rent cars.</p>
                    </div>
                `;
            } else {
                showToast(loginResult.message, 'danger');
            }
        }
    }
    
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
    
    
}

// Initialize the page
init();

// const showRegisterLink = document.getElementById('show-register-link');
// const showLoginLink = document.getElementById('show-login-link');
// const confirmPasswordContainer = document.getElementById('confirm-password-container');
// const registerLinkContainer = document.getElementById('register-link-container');

// showRegisterLink.addEventListener('click', function(event) {
//     event.preventDefault();
//     confirmPasswordContainer.style.display = 'block';
//     registerLinkContainer.style.display = 'none';
// });

// showLoginLink.addEventListener('click', function(event) {
//     event.preventDefault();
//     confirmPasswordContainer.style.display = 'none';
//     registerLinkContainer.style.display = 'block';
// });

document.addEventListener('DOMContentLoaded', () => {
    // Hover effect on range INPUTS (hour and minute) when RANGES are hovered 
    rangeHoverEffects();

    // TODO: refactor Toggle between Register and Login forms
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