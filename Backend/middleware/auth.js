const jwt = require("jsonwebtoken");
const Student = require("../models/studentModel");
const Admin = require("../models/adminModel");

// Middleware to verify any token (Student or Admin)
const verifyToken = (req, res, next) => {
    const token = req.cookies["auth-token"];
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};

// Middleware to check if the user is an Admin
const isAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.user._id);
        if (!admin) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Middleware to check if the user is a Student
const isStudent = async (req, res, next) => {
    try {
        const student = await Student.findOne({ studentId: req.user.studentId });
        if (!student) {
            return res.status(403).json({ message: "Access denied. Students only." });
        }
        req.student = student;
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    verifyToken,
    isAdmin,
    isStudent
};
