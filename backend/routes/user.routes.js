const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
} = require('../controllers/user.controller.js');

const { verifyAccessToken } = require('../middleware/auth.middleware.js');

router.route('/profile')
    // @desc    Get logged in user profile
    // @route   GET /api/users/profile
    // @access  Private
    .get(verifyAccessToken, getUserProfile)
    // @desc    Update logged in user profile
    // @route   PUT /api/users/profile
    // @access  Private
    .put(verifyAccessToken, updateUserProfile);

module.exports = router;