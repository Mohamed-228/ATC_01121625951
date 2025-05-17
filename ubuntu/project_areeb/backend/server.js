const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const bookingRoutes = require("./routes/bookings");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Serve static files from the "frontend" directory
app.use(express.static(path.join(__dirname, "../frontend")));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/eventbooking_areeb";

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit if DB connection fails
    });

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

// Serve HTML files directly for any other GET request not handled by API or static files
// This ensures that direct navigation to HTML pages works.
app.get("/html/:pageName", (req, res) => {
    const pageName = req.params.pageName;
    const filePath = path.join(__dirname, "../frontend/html", `${pageName}`);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Error sending file:", filePath, err);
            if (!res.headersSent) {
                res.status(404).send("Page not found");
            }
        }
    });
});

// Fallback to index.html for root or any unhandled routes (optional, good for SPAs)
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/html", "index.html"), (err) => {
        if (err) {
            console.error("Error sending index.html:", err);
            if (!res.headersSent) {
                res.status(500).send("Error loading the page.");
            }
        }
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
