const Course = require('../models/courseModel');
const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const loadAdminPanel = async function (req, res) {
    try {
        res.render('adminPanel');

    } catch (error) {
        res.status(500).send("Error loading admin panel");
    };
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
        const {name,description,image} = req.body;
        const course = await Course.create({
            name,
            description,
            image:req.file.buffer
        });
        req.flash('success', 'Course created successfully');
        res.redirect('/admin/dashboard');

    } catch (error) {
        res.status(500).send("Error loading admin panel");
    };
};

module.exports = {
    loadAdminPanel,
    adminLogin,
    loadadminLogin,
    createCourse
};