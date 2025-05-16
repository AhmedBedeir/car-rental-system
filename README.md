# 🚘 Car Rental System with Admin Dashboard

A responsive, client-side Car Rental System built with **HTML**, **CSS**, **JavaScript**, and **Bootstrap**. It allows customers to browse and book cars, while admins manage listings, bookings, and reports through a dashboard interface.

[🌐 Live Demo](https://car-rental-system-chi-two.vercel.app/)
![Thumbnail](./docs/Web-Showcase-Project-Presentation%20copy%20(1).jpg)

## ⚙ Technologies Used

- HTML5 & CSS3
- JavaScript (ES6+)
- Bootstrap 5
- LocalStorage (for data persistence)
- Chart.js (Admin analytics)

## 🧭 User Flow Diagram

This diagram illustrates the overall navigation and interaction flow within the system.

![User Flow Diagram](./docs/userFlow.png)

---

## 🧱 Class Diagram

This diagram shows the main classes and their relationships.

![Class Diagram](./docs/classDiagrams.png)

## ✨ Features

### 👥 User Functionality
- **Registration & Login** with validation
- Browse car listings
- Filter/search by brand, model, type, or price
- View car details
- **Book cars** with date/time validation
- View **booking history**
- Dynamic UI & toast notifications

### 🛠️ Admin Functionality
- Secure admin login
- Add, update, or delete car listings
- View all bookings & manage their status
- Access visual analytics (cars by brand/model/type, booking status)
- Admins can't book cars (restricted access)

### 📱 Responsive Design
Fully responsive layout for mobile, tablet, and desktop using Bootstrap.


## 🔒 Validations & Business Rules

### Booking Rules & Validations:

- Users must be logged in to make a booking.
- Form validation for registration and login (email, password, and password confirmation).
- Booking logic prevents:
  - Same-day bookings (two bookings with the exact pickup and return dates).
  - Overlapping bookings (same car booked in overlapping date ranges).
  - Duplicate bookings by the same user for the same car/date.
  - Booking unavailable cars (e.g., cars marked as booked, under maintenance, or sold).

- Date & time validation:
  - Pickup date must be earlier than return date.
  - Booking dates must be in the future.

### Role-based Access & Route Protection:

- Admin-only routes are protected:

  - Normal users are redirected away if they try to access the Admin Dashboard.

  - Bookings cannot be made by admin accounts.

- UI adapts based on user role:

  - Admin users see admin features only.

  - Customers see the booking interface only.

- Toast notifications provide real-time feedback (success/error) for actions like login, booking, form submission, and unauthorized access.


## 📊 Admin Analytics

Admins can view real-time statistics via Chart.js, including:

- Car availability

- Booking status

- Cars per brand/model/type

## 📌 Team Members
- Ahmed Bedeir
- Ahmed Assem
- Abdelrahman Ali
- Rahf Hazem
- Mohamed Shawky