const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Secret key for JWT - In a real app, use an environment variable
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_for_areeb_task";

exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists with this email" });
        }
        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Username is already taken" });
        }

        // Create new user
        user = new User({
            username,
            email,
            password,
            role: role || "user" 
        });

        await user.save();

        // Create token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: "5h" }, 
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token, userId: user.id, username: user.username, role: user.role });
            }
        );

    } catch (err) {
        console.error("Register error:", err.message);
        res.status(500).send("Server error during registration");
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials (email not found)" });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials (password incorrect)" });
        }

        // Create token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: "5h" },
            (err, token) => {
                if (err) throw err;
                res.json({ token, userId: user.id, username: user.username, role: user.role });
            }
        );

    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).send("Server error during login");
    }
};

// Optional: Get current user (useful for frontend to verify token)
exports.getCurrentUser = async (req, res) => {
    try {
        // req.user is set by the authMiddleware
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
