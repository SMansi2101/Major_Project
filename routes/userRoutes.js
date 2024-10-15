const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');

router.get('/register',studentController.registerLoad);
router.post('/register',studentController.register);

router.get('/dashboard',studentController.loadDashboard);

router.get('/courses/:courseName', studentController.loadCourseDetails);


module.exports = router;