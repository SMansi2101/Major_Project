const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../models/adminModel');
const blacklistTokenModel = require('../models/BlackListedModel');
const { validationResult } = require('express-validator');
const Course = require('../models/courseModel');
const CourseDetails = require("../models/courseDetailsModel");
const Quiz = require("../models/quizModel");


module.exports.loginAdmin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = admin.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, admin });
};

module.exports.getAdminProfile = async (req, res) => {
    res.status(200).json({ admin: req.admin });
};

module.exports.logoutAdmin = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    await blacklistTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Admin logged out successfully' });
};


module.exports.uploadCourse = async (req, res) => {
    try {
        const { name, description, standards } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
        
        // Parse the standards array from the request body
        const parsedStandards = JSON.parse(standards || "[]");

        // Find or create the main course
        let course = await Course.findOne({ name });
        if (!course) {
            course = new Course({ name, description, image: imagePath });
            await course.save();
        }

        // Process each standard and save the corresponding course details
        for (const std of parsedStandards) {
            const { standard, prerequisites, resources } = std;

            // Check if details for this standard already exist
            const existingDetails = await CourseDetails.findOne({ courseId: course._id, standard });
            if (existingDetails) {
                return res.status(400).json({ error: `Course details for standard ${standard} already exist` });
            }

            // Parse prerequisites and resources
            const parsedPrerequisites = prerequisites ? prerequisites.map(prereq => ({
                title: prereq.title,
                subPrerequisites: prereq.subPrerequisites.map(sub => ({ name: sub }))
            })) : [];

            const parsedResources = resources ? resources.map(r => ({ title: r.title, link: r.link })) : [];

            // Save standard-specific details
            const newCourseDetails = new CourseDetails({
                courseId: course._id,
                standard,
                prerequisites: parsedPrerequisites,
                resources: parsedResources,
            });

            await newCourseDetails.save();
        }

        res.status(201).json({ message: "Course uploaded successfully", course });
    } catch (error) {
        console.error("Error uploading course:", error);
        res.status(500).json({ error: "Error uploading course", details: error.message });
    }
};


module.exports.uploadQuiz = async (req, res) => {
    try {
        const { standard, course, questions } = req.body;


        // Validate required fields
        if (!standard || !course || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ error: "Missing required fields or invalid format" });
        }

        // Ensure standard is a number
        if (typeof standard !== "number") {
            return res.status(400).json({ error: "Standard must be a number" });
        }

        // Find course (case-insensitive)
        const existingCourse = await Course.findOne({ name: { $regex: new RegExp(`^${course}$`, "i") } });
        if (!existingCourse) {
            return res.status(404).json({ error: "Course not found" });
        }

        // Validate each question

        for (const q of questions) {
            if (!Array.isArray(q.options) || q.options.length !== 4 || typeof q.correct !== "number" || q.correct < 0 || q.correct > 3) {
              return res.status(400).json({ error: "Each question must have exactly 4 options and a valid correct answer index (0-3)" });
            }
          }
          


        const formattedQuestions = questions.map(q => ({
            ...q,
            correct: q.correct - 1
        }));
        const newQuiz = new Quiz({
            standard,
            course: existingCourse._id,
            questions: formattedQuestions
        });

        await newQuiz.save();
        res.status(201).json({ message: "Quiz uploaded successfully", newQuiz });
    } catch (error) {
        res.status(500).json({ error: "Error uploading quiz", details: error.message });
    }
};