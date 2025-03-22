const Student = require('../models/studentModel');
const Course = require('../models/courseModel');
const Quiz = require('../models/quizModel');
const mongoose = require('mongoose');
 

const register = async (req, res) => {
    try {
        const { fullname, standard } = req.body;

        if (!fullname.firstname || !standard) {
            return res.status(400).json({ message: "First name and standard are required" });
        }

        // Generate a unique student ID (or use another unique field)
        const studentId = "STU" + Date.now();

        const newStudent = new Student({
            fullname,
            standard,
            studentId,
        });

        await newStudent.save();

        res.status(201).json({ message: "Registration successful", student: newStudent });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const loadDashboard = async function (req, res) {
    try {
       const student = req.session.student;

        if (!student) {
            return res.redirect('/register');
        }

        const courses = await Course.find(); 

        res.render('dashboard', { 
            studentName: student.name, 
            studentStandard: student.standard, 
            courses // Pass courses to the dashboard
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};

const loadCourseDetails = async function (req, res) {
    try {
        const courseName = req.params.courseName;
        const studentStandard = req.session.student ? req.session.student.standard : null;

        if (!studentStandard) {
            return res.status(400).send('Student not registered or standard not found.');
        }

        const course = await Course.findOne({ name: courseName });

        if (!course) {
            return res.status(404).send('Course not found');
        }

        const filteredPrerequisites = course.prerequisites.filter(prerequisite => 
            prerequisite.standard === Number(studentStandard)
        );
               
        const quiz = await Quiz.find();

        res.render('courseDetails', { course, quiz, prerequisites: filteredPrerequisites });
    } catch (error) {
        console.log('Error loading course details:', error.message);
        res.status(500).send('Internal Server Error');
    }
};


const loadQuiz = async function (req, res) {
    try {
        const courseId = req.params.id; 
        const studentStandard = req.session.student ? req.session.student.standard : null;  

        if (!studentStandard) {
            return res.status(400).send('Student not registered or standard not found.');
        }

        const quiz = await Quiz.findOne({ course: courseId, standard: studentStandard });

        if (!quiz) {
            return res.status(404).send('No quiz found for this course and standard.');
        }
        const shuffledQuestions = shuffleArray([...quiz.questions]); 
        res.render('quizPage', { quiz: { ...quiz.toObject(), questions: shuffledQuestions } });

    } catch (error) {
        console.error('Error loading quiz:', error);
        res.status(500).send('Internal Server Error');
    }
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const submitQuiz = async function (req, res) {
    try {
        const userAnswers = req.body.answers;
        const quizId = req.body.quizId;

        const quiz = await Quiz.findById(quizId);

        if(!quiz){
            return res.status(404).send('Quiz not found.');
        }

        let correctCount = 0;
        quiz.questions.forEach((question,index)=>{
            if (userAnswers[index] !== undefined && parseInt(userAnswers[index]) === question.correct) {
                correctCount++;
            }            
        });
        
        const totalQuestions = quiz.questions.length;
        const percentageCorrect = (correctCount/totalQuestions)*100;

        const isQualified  = percentageCorrect >=70;  //threshold

        res.render('quizResult',{
            quizTitle:quiz.title,
            totalQuestions,
            correctCount,
            percentageCorrect,
            isQualified,
        });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    };
};


const loadHomePage = async function (req, res) {
    try {
        res.render('home'); 

    } catch (error) {
        console.log(error.message);
    };
};

module.exports = {
    register,
    loadDashboard,
    loadCourseDetails,
    loadQuiz,
    submitQuiz,
    loadHomePage,
};  