import { showToast } from './uiHelpers.js';
import { getSelectedCar } from './Display.js';

//Check car is available for booking
export function checkCarAvailability() {
    const car = getSelectedCar();
    const carId = car.id;
    
    if (car.available === false) {
        displayUnavailableMessage();
        hideBookingElements();
        return;
    }
    
    const allBookings = window.bookingClass.getBookings();
    const today = new Date();
    
    const activeBooking = allBookings.find(booking => {
        if (!booking || booking.carId !== carId) return false;
        try {
            const returnDate = new Date(booking.returnDate);
            const isFutureBooking = returnDate >= today;
            return isFutureBooking && booking.status === "confirmed"; // Only block confirmed bookings
        } catch {
            return false;
        }
    });
    
    if (activeBooking) {
        displayUnavailableMessage(activeBooking);
        hideBookingElements();
    }
}

// car is unavailable for whatever reason
export function displayUnavailableMessage(booking) {
    // Clear existing alerts first to avoid ui issues
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
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: undefined,
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

//Hide elements when car is unavailable
export function hideBookingElements() {
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

//(make button ready to handle booking after auth)
export function setupBookingSystem() {
    const rentButton = document.getElementById('rent-btn');
    
    rentButton.removeEventListener('click', handleBooking);
    rentButton.addEventListener('click', handleBooking);
}

// Handle booking
export function handleBooking() {
    const currentUser = window.usersClass.getCurrentUser();
    if (!currentUser) {
        return showToast('Please log in to rent a car', 'danger');
    }
    
    const car = getSelectedCar();
    if (!car) {
        window.carNotFoundRedirect();
    }
    
    const [pickupDate, returnDate] = getSortedSelectedDates();
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
    const booking = buildBooking(car.id, currentUser.id, pickupDate, returnDate, car.pricePerDay);
    
    window.bookingClass.bookings.push(booking);
    window.bookingClass.saveToLocalStorage();
    checkCarAvailability();
    showToast(`Booking successful! Total: $${totalAmount}`, 'success');
}

//Get dates and sort
export function getSortedSelectedDates() {
    if (!calendar || !calendar.context || !calendar.context.selectedDates || calendar.context.selectedDates.length < 2) {
        return [];
    }
    try {
        const dates = calendar.context.selectedDates.map(dateStr => {
            if (!dateStr || typeof dateStr !== 'string') {
                return null;
            }
            
            const [year, month, day] = dateStr.split('-');
            const dateObj = new Date(year, month - 1, day);
            
            if (isNaN(dateObj.getTime())) {
                return null;
            }
            
            const selectedTime = calendar.context.selectedTime;
            
            // Parse 12-hour time (e.g., "04:00 PM") into 24-hour format
            //  to send to booking object
            if (typeof selectedTime === 'string') {
                const [time, period] = selectedTime.split(' ');
                let [hours, minutes] = time.split(':').map(Number);
                
                if (period === 'PM' && hours !== 12) {
                    hours += 12; // Convert PM to 24-hour (except 12 PM) 
                } else if (period === 'AM' && hours === 12) {
                    hours = 0; // 12 AM becomes 00:00
                }
                
                dateObj.setHours(hours, minutes, 0, 0);
            } else {
                // Default to 00:00 if time is not returned for whatever reason
                dateObj.setHours(0, 0, 0, 0);
            }
            
            return dateObj;
        }).filter(date => date !== null);
        
        return dates.sort((a, b) => a - b);
    } catch (error) {
        console.error('Error processing dates:', error);
        return [];
    }
}

//Check dates are the same
export function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

//Check for duplicate booking for these cars
export function isDuplicateBooking(carId, pickupDate, returnDate) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const currentUser = window.usersClass.getCurrentUser();
    
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

//Calculate the total amount for booking
export function calculateTotalAmount(startDate, endDate, pricePerDay) {
    const msPerDay = 1000 * 60 * 60 * 24;
    const durationDays = Math.ceil((endDate - startDate) / msPerDay);
    return durationDays * pricePerDay;
}

//make a booking object
export function buildBooking(carId, userId, pickupDate, returnDate, pricePerDay) {
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: undefined,
        hour12: true
    };
    
    const totalAmount = calculateTotalAmount(pickupDate, returnDate, pricePerDay);
    const msPerDay = 1000 * 60 * 60 * 24;
    const totalDays = Math.ceil((returnDate - pickupDate) / msPerDay);
    
    return {
        carId,
        userId,
        pickupDate: pickupDate.toLocaleString('en-US', options),
        returnDate: returnDate.toLocaleString('en-US', options),
        totalDays,
        totalAmount,
        status: 'pending',
    };
}