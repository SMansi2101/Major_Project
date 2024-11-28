const Course = require('../models/courseModel');
const Quiz = require('../models/quizModel')
const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const loadAdminPanel = async function (req, res) {
    try {
        const courses = await Course.find();
        const message = req.flash('message')[0] || null; // Get the flash message
        res.render('adminPanel', { courses, message });
    } catch (error) {
        console.error('Error loading admin panel:', error);
        res.status(500).send("Error loading admin panel");
    }
};

const loadadminLogin = async function (req, res) {
    try {
        res.render('login');

    } catch (error) {
        res.status(500).send("Error loading admin panel");
    };
};

const adminLogin = async function (req, res) {
    try {
       const {email,password} = req.body;

       const admin = await Admin.findOne({email});
       if(!admin){
        return res.status(404).send("Admin Not Found");
       }

       const validPass = await bcrypt.compare(password,admin.password);
       if(validPass){
           const token = jwt.sign({_id: admin._id},process.env.JWT_SECRET);
           res.cookie('auth-token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',  
            maxAge: 3600000  
        });
           return res.redirect('/admin/dashboard');
       }
       if(!validPass){
        return res.render('login', { message: "Email or Password is incorrect!" });
       }

    } catch (error) {
        return res.render('login', { message: "Email or Password is incorrect!" });
    };
};

const createCourse = async function (req, res) {
    try {
        const {name,description,prerequisites,resources} = req.body;
        const image = req.file ? 'images/' + req.file.filename : null; 
        const newCourse = new Course({
            name,
            description,
            prerequisites: prerequisites.map((prerequisite) => ({
                name: prerequisite.name,
                standard: prerequisite.standard,
            })),
            resources,
            image,
        });
        await newCourse.save();
        req.flash('message', { type: 'success', content: 'Course created successfully!' });
        res.redirect('/admin/dashboard');

    } catch (error) {
        req.flash('message', { type: 'error', content: 'Error creating course. Please try again.' });
        res.redirect('/admin/dashboard');
    };
};

const createQuiz = async function (req, res) {
    try {
        const {title,standard,course,questions} = req.body;

        if (!title || !standard || !course || !questions || questions.length === 0) {
            req.flash('message', { type: 'error', content: 'All fields are required, and at least one question is necessary!' });
            return res.redirect('/admin/dashboard');
        }

        const selectedCourse = await Course.findById(course);
        if(!selectedCourse){
            req.flash('message', { type: 'error', content: 'Invalid course selected!' });
            return res.redirect('/admin/dashboard');
        }
          // Prepare questions array
        const formattedQuestions = questions.map((question,index) =>{
            if(!question.text || !question.options || !question.options.length>2 || !question.correct ){
                throw new Error(`Invalid data for question ${index + 1}`);
            }
            return {
                text: question.text,
                options: question.options,
                correct: question.correct,
            };
        });

         // Create a new quiz object
         const newQuiz = new Quiz({
            title,
            standard,
            course,
            questions: formattedQuestions,
        });

        await newQuiz.save();

        req.flash('message', { type: 'success', content: 'Quiz created successfully!' });
        res.redirect('/admin/dashboard');

    } catch (error) {
        req.flash('message', { type: 'error', content: 'Error creating quiz. Please try again.' });
        res.redirect('/admin/dashboard');
    };
};

module.exports = {
    loadAdminPanel,
    adminLogin,
    loadadminLogin,
    createCourse,
    createQuiz
};