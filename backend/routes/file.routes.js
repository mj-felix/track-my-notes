const express = require('express');
const router = express.Router();

const {
    uploadFile,
    deleteFile
} = require('../controllers/file.controller.js');

const {
    verifyAccessToken,
    noteBelongsToUser,
    isSpaceAvailable,
    fileBelongsToNote
} = require('../middleware/auth.middleware.js');

const { uploadS3 } = require('../middleware/file.middleware.js');

// @desc    Upload file for a given note
// @route   POST /api/notes/:id/files
// @access  Private
router.post('/:id/files', verifyAccessToken, isSpaceAvailable, noteBelongsToUser, uploadS3, uploadFile);

// @desc    Delete file for a given note
// @route   DELETE /api/notes/:id/files/:storedFileName
// @access  Private
router.delete('/:id/files/:storedFileName', verifyAccessToken, noteBelongsToUser, fileBelongsToNote, deleteFile);

module.exports = router;