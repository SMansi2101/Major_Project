const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController"); // Ensure this path is correct!
const { verifyToken, isAdmin } = require("../middleware/auth");

// Ensure adminController.login is properly defined!
router.post("/login", adminController.login);
router.get("/admin-dashboard", verifyToken, isAdmin, adminController.loadDashboard);

module.exports = router;
