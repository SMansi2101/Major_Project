const express = require('express');
const { loginAdmin, logoutAdmin, getAdminProfile,uploadCourse,uploadQuiz} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); 
    },
  });
  const upload = multer({ storage });

router.post('/login', loginAdmin);
router.post('/logout', auth.authAdmin, logoutAdmin);
router.get('/profile', auth.authAdmin, getAdminProfile);
router.post('/upload-course',auth.authAdmin,upload.single("image"),uploadCourse);
router.post('/upload-quiz',auth.authAdmin,uploadQuiz);

module.exports = router;
