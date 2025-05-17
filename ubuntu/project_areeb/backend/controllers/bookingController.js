const Booking = require("../models/Booking");
const Event = require("../models/Event");

// Create a new booking
exports.createBooking = async (req, res) => {
    const { eventId, numberOfTickets } = req.body;
    const userId = req.user.id; // Comes from authMiddleware

    if (!eventId || !numberOfTickets || numberOfTickets < 1) {
        return res.status(400).json({ message: "Event ID and a valid number of tickets are required." });
    }

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        // Optional: Check if event is in the past or if tickets are available (if stock is managed)
        if (new Date(event.date) < new Date()) {
            return res.status(400).json({ message: "Cannot book an event that has already passed." });
        }

        const totalPrice = event.price * numberOfTickets;

        const newBooking = new Booking({
            user: userId,
            event: eventId,
            numberOfTickets,
            totalPrice
        });

        const booking = await newBooking.save();
        // Populate event and user details for the response
        const populatedBooking = await Booking.findById(booking._id)
                                            .populate("event", "name date venue price imageUrl")
                                            .populate("user", "username email");

        res.status(201).json(populatedBooking);
    } catch (err) {
        console.error("Create booking error:", err.message);
        if (err.code === 11000) { // Handle potential unique index violation if defined (e.g., user can only book once)
            return res.status(400).json({ message: "You have already booked this event." });
        }
        res.status(500).send("Server error while creating booking.");
    }
};

// Get all bookings for the logged-in user
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
                                    .populate("event", "name date venue price imageUrl category")
                                    .populate("user", "username email") // Though user is known, good for consistency
                                    .sort({ bookingDate: -1 });
        if (!bookings || bookings.length === 0) {
            return res.status(200).json([]); // Return empty array if no bookings
        }
        res.json(bookings);
    } catch (err) {
        console.error("Get user bookings error:", err.message);
        res.status(500).send("Server error.");
    }
};

// Get a single booking by ID (ensure it belongs to the user or user is admin)
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
                                    .populate("event")
                                    .populate("user", "username email");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Check if the logged-in user owns the booking or is an admin
        if (booking.user._id.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "User not authorized to view this booking" });
        }

        res.json(booking);
    } catch (err) {
        console.error("Get booking by ID error:", err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ message: "Booking not found (invalid ID format)" });
        }
        res.status(500).send("Server error");
    }
};

// Cancel a booking (User can cancel their own, Admin can cancel any)
// For simplicity, we'll allow deletion. In a real app, you might mark as 'cancelled'.
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "User not authorized to cancel this booking" });
        }
        
        // Optional: Check if event is too close to cancel
        const event = await Event.findById(booking.event);
        if (event && new Date(event.date) < new Date()) {
             return res.status(400).json({ message: "Cannot cancel a booking for an event that has already passed." });
        }

        await Booking.findByIdAndDelete(req.params.id);

        res.json({ message: "Booking cancelled successfully" });
    } catch (err) {
        console.error("Cancel booking error:", err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ message: "Booking not found (invalid ID format)" });
        }
        res.status(500).send("Server error");
    }
};

// Get all bookings (Admin only)
exports.getAllBookingsAdmin = async (req, res) => {
    try {
        const bookings = await Booking.find()
                                    .populate("event", "name date")
                                    .populate("user", "username email")
                                    .sort({ bookingDate: -1 });
        res.json(bookings);
    } catch (err) {
        console.error("Admin get all bookings error:", err.message);
        res.status(500).send("Server error");
    }
};
