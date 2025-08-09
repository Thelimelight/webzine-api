const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth')
const { register, login } = require('../controllers/authController')
const upload = require('../middleware/multer');

// Routes
router.post('/register', authenticate, upload.single('profileImage'), register);
router.post('/login', login)

module.exports = router;