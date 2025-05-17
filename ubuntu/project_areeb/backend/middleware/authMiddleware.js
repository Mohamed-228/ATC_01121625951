const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assuming User model is now Mongoose based

// Secret key for JWT - In a real app, use an environment variable
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_for_areeb_task";

const authMiddleware = async (req, res, next) => {
    // Get token from header
    const token = req.header("x-auth-token");

    // Check if not token
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Add user from payload
        // req.user = decoded.user; // This contains id and role

        // Optionally, fetch the full user object from DB to ensure user still exists and is valid
        const user = await User.findById(decoded.user.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Token is not valid (user not found)" });
        }
        req.user = { id: user.id, role: user.role, username: user.username }; // Attach user info to request object

        next();
    } catch (err) {
        console.error("Token verification error:", err.message);
        res.status(401).json({ message: "Token is not valid" });
    }
};

// Middleware to check if user is admin
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admin role required." });
    }
};

module.exports = { authMiddleware, adminMiddleware };
