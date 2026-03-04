const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// Auth
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// Profile Management
router.put("/update/:id", auth, userController.updateProfile);

// Security
router.post("/change-password/:id", auth, userController.changePassword);

// Change security password
router.post("/change-security-password/:id", auth, userController.changeSecurityPassword);

// Danger zone
router.delete("/delete/:id", auth, userController.deleteUser);

// Recovery
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password/:token", userController.resetPassword);

module.exports = router;
