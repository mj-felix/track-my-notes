const express = require('express');
const router = express.Router();
const {
    register,
    login,
    refreshAccessToken
} = require('../controllers/auth.controller.js');

// @desc    Register a new user & obtain tokens
// @route   POST /api/v1/auth/register
// @access  Public
router.post('/register', register);

// @desc    Authenticate user & obtain tokens
// @route   POST /api/v1/auth/login
// @access  Public
router.post('/login', login);

// @desc    Obtain new access token
// @route   GET /api/v1/auth/refreshaccesstoken
// @access  Public
router.get('/refreshaccesstoken', refreshAccessToken);

module.exports = router;