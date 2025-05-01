import Cars from "./classes/Cars.js";
import Users from "./classes/Users.js";
import Booking from "./classes/booking.js";
import { extractDisplayDetails } from './car_details/Display.js';
import { checkCarAvailability } from './car_details/bookingHandler.js';
import { setupAuthorizationCheck } from './car_details/authHandler.js';
import { rangeHoverEffects } from './car_details/calendarHelpers.js';
import { toggleRegisterLogin } from './car_details/uiHelpers.js';

document.addEventListener('DOMContentLoaded', () => {
    const carsClass = new Cars();
    const usersClass = new Users();
    const bookingClass = new Booking();

    // global so i can use in imported modules
    window.carsClass = carsClass;
    window.usersClass = usersClass;
    window.bookingClass = bookingClass;

    const init = async () => {
        await carsClass.ready;
        await usersClass.ready;
        await bookingClass.ready;
        
        extractDisplayDetails();
        checkCarAvailability(); // check car availability before auth
        setupAuthorizationCheck();
    };

    // Initialize the page
    init();
    rangeHoverEffects();
    toggleRegisterLogin();
});