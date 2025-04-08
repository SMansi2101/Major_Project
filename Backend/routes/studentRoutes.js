const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { isStudent } = require("../middleware/auth");

router.post("/register", studentController.register);
router.get("/courses", isStudent, studentController.getCourse);
router.get("/courses/:id", studentController.getCourseById);
router.get("/quiz/:id",isStudent,studentController.getQuizzes);


module.exports = router;
