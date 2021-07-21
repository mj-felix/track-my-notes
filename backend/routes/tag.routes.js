const express = require('express');
const router = express.Router();
const {
    createTag,
    updateTag,
    deleteTag,
    getTags
} = require('../controllers/tag.controller.js');

const {
    verifyAccessToken,
    tagBelongsToUser
} = require('../middleware/auth.middleware.js');

router.route('/')
    // @desc    Get tags for logged in user
    // @route   GET /api/v1/tags
    // @access  Private
    .get(verifyAccessToken, getTags)
    // @desc    Create tag for logged in user
    // @route   POST /api/v1/tags
    // @access  Private
    .post(verifyAccessToken, createTag);

router.route('/:id')
    // @desc    Update tag for logged in user
    // @route   PUT /api/v1/tags/:id
    // @access  Private
    .put(verifyAccessToken, tagBelongsToUser, updateTag)
    // @desc    Delete tag for logged in user
    // @route   DELETE /api/v1/tags/:id
    // @access  Private
    .delete(verifyAccessToken, tagBelongsToUser, deleteTag);

module.exports = router;