const Event = require("../models/Event");

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().populate("createdBy", "username email").sort({ date: -1 }); 
        res.json(events);
    } catch (err) {
        console.error("Get all events error:", err.message);
        res.status(500).send("Server error");
    }
};

// Get a single event by ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate("createdBy", "username email");
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json(event);
    } catch (err) {
        console.error("Get event by ID error:", err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ message: "Event not found (invalid ID format)" });
        }
        res.status(500).send("Server error");
    }
};

// Create a new event (Admin only)
exports.createEvent = async (req, res) => {
    const { name, description, category, date, venue, price, imageUrl } = req.body;

    // Basic validation (more can be added with a library like Joi)
    if (!name || !description || !category || !date || !venue || price === undefined || !imageUrl) {
        return res.status(400).json({ message: "Please provide all required fields for the event." });
    }

    try {
        const newEvent = new Event({
            name,
            description,
            category,
            date,
            venue,
            price,
            imageUrl,
            createdBy: req.user.id 
        });

        const event = await newEvent.save();
        res.status(201).json(event);
    } catch (err) {
        console.error("Create event error:", err.message);
        res.status(500).send("Server error while creating event");
    }
};

// Update an event (Admin only)
exports.updateEvent = async (req, res) => {
    const { name, description, category, date, venue, price, imageUrl } = req.body;
    const eventId = req.params.id;

    try {
        let event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Optional: Check if the user updating is the one who created it or an admin
        // For now, authMiddleware ensures only admin can reach this based on route protection

        const updatedFields = {
            name: name || event.name,
            description: description || event.description,
            category: category || event.category,
            date: date || event.date,
            venue: venue || event.venue,
            price: price !== undefined ? price : event.price,
            imageUrl: imageUrl || event.imageUrl
        };

        event = await Event.findByIdAndUpdate(
            eventId,
            { $set: updatedFields },
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        res.json(event);
    } catch (err) {
        console.error("Update event error:", err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ message: "Event not found (invalid ID format)" });
        }
        res.status(500).send("Server error while updating event");
    }
};

// Delete an event (Admin only)
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Optional: Check if the user deleting is the one who created it or an admin

        await Event.findByIdAndDelete(req.params.id);

        res.json({ message: "Event removed successfully" });
    } catch (err) {
        console.error("Delete event error:", err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ message: "Event not found (invalid ID format)" });
        }
        res.status(500).send("Server error while deleting event");
    }
};
