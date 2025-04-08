require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const connectDb = require("./config/dbConnection");

// Import Routes
const userRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Connect to Database
connectDb();

const app = express();

// Middleware
app.use(cors({
    origin:"http://localhost:5173",  
    credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

app.use(flash());

// Static Files (if needed for uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

// Default Route
app.get('/', (req, res) => {
    res.send('Career Choice API is running...');
});

module.exports = app;
