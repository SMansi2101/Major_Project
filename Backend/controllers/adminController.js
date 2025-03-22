const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and Password are required!" });
    }

    const admin = await Admin.findOne({ username, password });
    if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("auth-token", token, { httpOnly: true });
    res.json({ message: "Login successful", token });
};

const loadDashboard = async (req, res) => {
    res.send("Admin Dashboard");
};

module.exports = { login, loadDashboard };
