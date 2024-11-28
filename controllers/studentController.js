const Student = require('../models/studentModel');
const Course = require('../models/courseModel');
const Quiz = require('../models/quizModel');
const mongoose = require('mongoose');
 

const registerLoad = async function (req, res) {
    try {
        res.render('register.ejs');

    } catch (error) {
        console.log(error.message);
    };
};

const register = async function (req, res) {
    const { name, standard } = req.body;

    if (!name || !standard) {
        return res.status(400).render('register', { message: 'Name and Standard are required!' });
    }

    try {
        const newStudent = new Student({
            name,
            standard
        });

        const savedStudent = await newStudent.save();

        // Store data in session
        req.session.student = {
            name: savedStudent.name,
            standard: savedStudent.standard
        };

        return res.redirect('/dashboard');
    } catch (error) {
        console.error('Error registering student:', error);
        res.status(500).render('register', { error: 'Internal Server Error', success: null });
    }
};


const loadDashboard = async function (req, res) {
    try {
       const student = req.session.student;

        if (!student) {
            return res.redirect('/register');
        }

        const courses = await Course.find(); 

        res.render('dashboard', { 
            studentName: student.name, 
            studentStandard: student.standard, 
            courses // Pass courses to the dashboard
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};

const loadCourseDetails = async function (req, res) {
    try {
        const courseName = req.params.courseName;

        const course = await Course.findOne({ name: courseName });
        const quiz = await Quiz.find();
        if (!course) {
            return res.status(404).send('Course not found');
        }

        res.render('courseDetails', { course , quiz });
    } catch (error) {
        console.log('Error loading course details:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

const loadQuiz = async function (req, res) {
    try {
        const courseId= req.params.id;

        const quiz = await Quiz.findOne({course: courseId});

        if (!quiz) {
            return res.status(404).send('No quiz found for this course.');
        }

        res.render('quizPage', { quiz });

    } catch (error) {
        res.status(500).send('Internal Server Error');
    };
};

const loadHomePage = async function (req, res) {
    try {
        res.render('home'); 

    } catch (error) {
        console.log(error.message);
    };
};

module.exports = {
    registerLoad,
    register,
    loadDashboard,
    loadCourseDetails,
    loadQuiz,
    loadHomePage,
};  