const Student = require('../models/studentModel');
const Course = require('../models/courseModel');
const mongoose = require('mongoose');
 

const registerLoad = async function (req, res) {
    try {
        res.render('register.ejs');

    } catch (error) {
        console.log(error.message);
    };
};

const register = async function (req, res) {
    const{name,standard} = req.body;

    if(!name || !standard){
     return res.status(400).render('register',{message:'Name and Standard are required!'});
    }
    try {
        const newStudent = new Student({
            name,
            standard
        });

        const savedStudent = await newStudent.save();
        return res.redirect(`/dashboard?name=${encodeURIComponent(savedStudent.name)}&standard=${savedStudent.standard}`);
    } catch (error) {
        console.error('Error registering student:', error);

        res.status(500).render('register', { error: 'Internal Server Error', success: null });
    };
};

const loadDashboard = async function (req, res) {
    try {
        const { name, standard } = req.query;

        if (!name || !standard) {
            return res.redirect('/register');
        }

        const courses = await Course.find(); 

        res.render('dashboard', { 
            studentName: name, 
            studentStandard: standard, 
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
        if (!course) {
            return res.status(404).send('Course not found');
        }

        res.render('courseDetails', { course });
    } catch (error) {
        console.log('Error loading course details:', error.message);
        res.status(500).send('Internal Server Error');
    }
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
    loadHomePage
};  