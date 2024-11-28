const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');

router.get('/', studentController.loadHomePage);

router.get('/register',studentController.registerLoad);
router.post('/register',studentController.register);

router.get('/dashboard',studentController.loadDashboard);

router.get('/courses/:courseName', studentController.loadCourseDetails);

router.get('/quiz/:id',studentController.loadQuiz);


module.exports = router;