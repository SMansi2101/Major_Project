const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { verifyToken, isStudent } = require("../middleware/auth");

router.post("/register", studentController.register);
router.get("/dashboard", verifyToken, isStudent, studentController.loadDashboard);

module.exports = router;
