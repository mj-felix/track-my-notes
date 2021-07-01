const express = require('express');
const router = express.Router();
const {
    createTag,
    updateTag,
    deleteTag,
    getTags
} = require('../controllers/tagController.js');

const {
    verifyAccessToken,
    tagBelongsToUser
} = require('../middleware/authMiddleware.js');

router.route('/')
    // @desc    Get tags for logged in user
    // @route   GET /api/tags
    // @access  Private
    .get(verifyAccessToken, getTags)
    // @desc    Create tag for logged in user
    // @route   POST /api/tags
    // @access  Private
    .post(verifyAccessToken, createTag);

router.route('/:id')
    // @desc    Get tag for logged in user
    // @route   GET /api/tags/:id
    // @access  Private
    .put(verifyAccessToken, tagBelongsToUser, updateTag)
    // @desc    Update tag for logged in user
    // @route   PUT /api/tags/:id
    // @access  Private
    .delete(verifyAccessToken, tagBelongsToUser, deleteTag);

module.exports = router;