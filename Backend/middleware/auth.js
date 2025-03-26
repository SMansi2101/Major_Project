const jwt = require("jsonwebtoken");
const Student = require("../models/studentModel");
const adminModel = require('../models/adminModel');
const blacklistTokenModel = require('../models/BlackListedModel');

const authAdmin = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];


    if (!token) {
        return res.status(401).json({ message: 'Unauthorized. No token found' });
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token });

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized. Token is blacklisted' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await adminModel.findById(decoded._id);
         req.admin = admin;

        return next();

    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized. Invalid token' });
    }
};


const isStudent = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.student = decoded; // Attach student data to request
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = {
    isStudent,
    authAdmin
};
