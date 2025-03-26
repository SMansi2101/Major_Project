const Student = require('../models/studentModel');
const CourseDetails = require('../models/courseDetailsModel');
const Course = require('../models/courseModel');
const Quiz = require('../models/quizModel');
const mongoose = require('mongoose');

const register = async (req, res) => {
    try {
        const { fullname, standard } = req.body;

        if (!fullname.firstname || !standard) {
            return res.status(400).json({ message: "First name and standard are required" });
        }

        const studentId = "STU" + Date.now();
        const newStudent = new Student({ fullname, standard, studentId });

        await newStudent.save();

        // Generate Token using the model method
        const token = newStudent.generateAuthToken();

        res.status(201).json({
            message: "Registration successful",
            student: newStudent,
            token,  // Send token to frontend
            redirectTo: "/dashboard"
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: "Error fetching course", error: error.message });
    }
};
const getCourse = async (req, res) => { 
    try {
        if (!req.student || !req.student.standard) {
            return res.status(400).json({ message: "Student standard is missing" });
        }

        // Fetch courses and populate the related Course model data
        const courses = await CourseDetails.find({
            standard: req.student.standard
        }).populate("courseId", "name description image"); // Populate courseId field

        res.status(200).json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Error fetching courses", error: error.message });
    }
};


const getQuizzes = async (req, res) => {
    try {
        const { standard } = req.session.student || {}; // Get standard from session

        if (!standard) {
            return res.status(400).json({ message: "Student standard is missing" });
        }

        const quizzes = await Quiz.find({ standard: standard }); // Fetch quizzes for the student’s standard
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching quizzes", error: error.message });
    }
};


module.exports = {
    register,
    getCourseById,
    getCourse,
    getQuizzes
};
