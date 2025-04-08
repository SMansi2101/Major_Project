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

        const courseDetails = await CourseDetails.findById(req.params.id)
            .populate("courseId", "name description image"); // Ensure fields are populated


        if (!courseDetails) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Return all necessary details
        res.status(200).json({
            ...courseDetails.toObject(),
            courseId: courseDetails.courseId?._id, // Ensure correct courseId
            name: courseDetails.courseId?.name, 
            description: courseDetails.courseId?.description, 
            image: courseDetails.courseId?.image 
        });
    } catch (error) {
        console.error("Error fetching course:", error);
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
        const { id } = req.params; // This is courseId

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Course ID format" });
        }

        if (!req.student || !req.student.standard) {
            return res.status(400).json({ message: "Student standard is missing" });
        }

        const quiz = await Quiz.findOne({
            course: id,
            standard: req.student.standard
        }).populate("course");

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found for this course and standard" });
        }

        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: "Error fetching quiz", error: error.message });
    }
};

module.exports = {
    register,
    getCourseById,
    getCourse,
    getQuizzes
};
