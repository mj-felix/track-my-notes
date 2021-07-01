const express = require('express');
const router = express.Router();
const {
    createNote,
    updateNote,
    deleteNote,
    getNotes,
    getNote
} = require('../controllers/noteController.js');

const {
    verifyAccessToken,
    noteBelongsToUser,
    tagsBelongToUser
} = require('../middleware/authMiddleware.js');

router.route('/')
    // @desc    Get notes for logged in user
    // @route   GET /api/notes
    // @access  Private
    .get(verifyAccessToken, getNotes)
    // @desc    Create note for logged in user
    // @route   POST /api/notes
    // @access  Private
    .post(verifyAccessToken, tagsBelongToUser, createNote);

router.route('/:id')
    // @desc    Get note
    // @route   GET /api/notes/:id
    // @access  Private
    .put(verifyAccessToken, noteBelongsToUser, tagsBelongToUser, updateNote)
    // @desc    Update note
    // @route   PUT /api/notes/:id
    // @access  Private
    .delete(verifyAccessToken, noteBelongsToUser, deleteNote)
    // @desc    Update note
    // @route   PUT /api/notes/:id
    // @access  Private
    .get(verifyAccessToken, noteBelongsToUser, getNote);

module.exports = router;