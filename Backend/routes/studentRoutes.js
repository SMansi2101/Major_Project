const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { isStudent } = require("../middleware/auth");

router.post("/register", studentController.register);
router.get("/dashboard", isStudent, studentController.loadDashboard);

module.exports = router;
