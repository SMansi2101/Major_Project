
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifytoken, Isadmin } = require('../middleware/auth');

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {      
        const uploadPath = path.join(__dirname, '../public/images'); 
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const upload = multer({ storage: storage });

router.get('/login',adminController.loadadminLogin);
router.post('/login',adminController.adminLogin);
router.post('/logout', (req, res) => {
    res.clearCookie('auth-token');  
    res.redirect('/admin/login');   
});


router.get('/dashboard', verifytoken, Isadmin ,adminController.loadAdminPanel);
router.post('/create-course',verifytoken,Isadmin,upload.single('image'),adminController.createCourse);
router.post('/create-quiz',verifytoken,Isadmin,adminController.createQuiz);


module.exports = router;
