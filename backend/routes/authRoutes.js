const express = require('express');
const router = express.Router();
const {
    register,
    login,
    refreshAccessToken
} = require('../controllers/authController.js');

// @desc    Register a new user & obtain tokens
// @route   POST /api/users
// @access  Public
router.post('/register', register);

// @desc    Authenticate user & obtain tokens
// @route   POST /api/users/login
// @access  Public
router.post('/login', login);

// @desc    Authenticate user & obtain tokens
// @route   POST /api/users/login
// @access  Public
router.post('/refreshaccesstoken', refreshAccessToken);

module.exports = router;