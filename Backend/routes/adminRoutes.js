const express = require('express');
const { loginAdmin, logoutAdmin, getAdminProfile } = require('../controllers/adminController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', auth.authAdmin, logoutAdmin);
router.get('/profile', auth.authAdmin, getAdminProfile);

module.exports = router;
