const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const studentSchema = new mongoose.Schema({
    fullname: {
        firstname: { type: String, required: true, minlength: 3 },
        lastname: { type: String, minlength: 3 }
    },
    standard: { type: String, required: true },
    studentId: { type: String, unique: true },  // Unique identifier for login
});

// Generate JWT Token
studentSchema.methods.generateAuthToken = function () {
    return jwt.sign({ studentId: this.studentId }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
