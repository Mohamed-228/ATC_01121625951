const express = require("express");
const router = express.Router();
// Corrected import names to match exports from authController.js
const { register, login, getCurrentUser } = require("../controllers/authController"); 
// Assuming authMiddleware is correctly named and exported from authMiddleware.js
const { authMiddleware } = require("../middleware/authMiddleware"); 

router.post("/register", register);
router.post("/login", login);
// Corrected function name for the protected route and ensured authMiddleware is used
router.get("/me", authMiddleware, getCurrentUser); 

module.exports = router;
