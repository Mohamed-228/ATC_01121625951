const express = require("express");
const router = express.Router();
const {
    createBooking,
    getUserBookings, // Corrected: was getMyBookings
    getAllBookingsAdmin, // Corrected: was getAllBookings
    cancelBooking,
    getBookingById // Added for completeness, though not used in current routes directly by this name
} = require("../controllers/bookingController");
// Corrected: was protect, authorizeAdmin; authMiddleware.js exports authMiddleware and adminMiddleware
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware"); 

// Protected User routes
router.post("/", authMiddleware, createBooking);
router.get("/mybookings", authMiddleware, getUserBookings); // Corrected: was getMyBookings
router.get("/:id", authMiddleware, getBookingById); // Added route for getting a single booking by ID

// Protected Admin route
router.get("/", authMiddleware, adminMiddleware, getAllBookingsAdmin); // Corrected: was getAllBookings & authorizeAdmin

// Protected User/Admin route (User can cancel their own, Admin can cancel any)
router.delete("/:id", authMiddleware, cancelBooking);

module.exports = router;
