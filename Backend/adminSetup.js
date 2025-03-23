require('dotenv').config(); 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AdminModel = require('./models/adminModel');
const connectDb = require("./config/dbConnection");

connectDb();

const createAdmin = async () => {
    try {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10); 
        const admin = new AdminModel({
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword
        });

        await admin.save();
        console.log('Admin created successfully');
        mongoose.disconnect(); 
    } catch (err) {
        console.error('Error creating admin: ', err);
        mongoose.disconnect(); 
    }
};

createAdmin();
