const express = require("express");
const router = express.Router();
const {
    getAllEvents, // Corrected: was getEvents
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");
// Corrected: was protect, authorizeAdmin; authMiddleware.js exports authMiddleware and adminMiddleware
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware"); 

// Public routes
router.get("/", getAllEvents); // Corrected: was getEvents
router.get("/:id", getEventById);

// Protected Admin routes
router.post("/", authMiddleware, adminMiddleware, createEvent); // Corrected: was protect, authorizeAdmin
router.put("/:id", authMiddleware, adminMiddleware, updateEvent); // Corrected: was protect, authorizeAdmin
router.delete("/:id", authMiddleware, adminMiddleware, deleteEvent); // Corrected: was protect, authorizeAdmin

module.exports = router;
