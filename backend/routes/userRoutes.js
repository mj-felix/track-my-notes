const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
} = require('../controllers/userController.js');

const { verifyAccessToken } = require('../middleware/authMiddleware.js');

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