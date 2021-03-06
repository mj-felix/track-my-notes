const express = require('express');
const router = express.Router();
const {
    getPublicNote,
    getPublicNotes,
    getPublicUserProfile
} = require('../controllers/public.controller.js');

// @desc    Retrieve user public profile
// @route   GET /api/v1/public/:profilename
// @access  Public
router.get('/:profilename', getPublicUserProfile);

// @desc    Retrieve user's public notes
// @route   GET /api/v1/public/:profilename/notes
// @access  Public
router.get('/:profilename/notes/', getPublicNotes);

// @desc    Retrieve user's public note
// @route   GET /api/v1/public/:profilename/notes/:noteid
// @access  Public
router.get('/:profilename/notes/:id', getPublicNote);

module.exports = router;