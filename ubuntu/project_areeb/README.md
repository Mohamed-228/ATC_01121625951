# Event Booking System - Areeb Task

This project is a full-stack event booking system developed as part of the Areeb Task. It allows users to browse and book events, manage their bookings, and provides an integrated web-based admin panel for event management.

## Project Structure

```
project_areeb/
├── frontend/
│   ├── html/
│   │   ├── index.html
│   │   ├── event-details.html
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── admin.html
│   │   └── congratulations.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   └── bookings.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   └── bookingController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   └── Booking.js
│   ├── middleware/
│   │   └── authMiddleware.js
├── requirements.txt
├── project_structure.md
└── README.md (This file)
```

## Technologies Used

*   **Frontend:** HTML, Native CSS, Native JavaScript (No frameworks or libraries as per requirement)
*   **Backend:** Node.js, Express.js
*   **Data Storage:** In-memory arrays (for demonstration purposes, as no specific database was mandated and to keep it simple)
*   **Authentication:** JWT (JSON Web Tokens) for stateless authentication.

## Features

### Frontend

*   **Authentication:** User registration and login.
*   **Home Page (Event Listings):**
    *   Displays events in a grid/flexbox layout.
    *   Shows a "Booked" label for events already booked by the user.
    *   "Book Now" button for available events.
*   **Event Details Page:**
    *   Shows full event information (Name, Description, Category, Date, Venue, Price, Image).
    *   "Book Now" button (books 1 ticket per click).
    *   Redirects to a Congratulations screen upon successful booking.
*   **Admin Panel:**
    *   CRUD operations for events (Create, Read, Update, Delete).
    *   Separate screen within the same web application.
*   **UI Design:** Custom UI created from scratch (Web design only).

### Backend

*   **Authentication API:** Handles user registration and login, token generation.
*   **Event Management API:** Provides CRUD endpoints for events.
*   **Booking API:** Allows users to book events and view their bookings.
*   **Role-Based Access Control:** Differentiates between regular users and admin users for certain actions (e.g., event management).

## Setup and Running Instructions

A detailed guide on how to set up and run this project on Visual Studio Code on a Mac will be provided in a separate file: `VSCode_Setup_Guide_Mac.md`.

This project was developed with the assistance of AI tools for coding, debugging, and suggestions, as per the task requirements.

