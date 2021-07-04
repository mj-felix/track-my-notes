const asyncHandler = require('express-async-handler');

const Note = require('../models/note.model.js');
const { s3 } = require('../middleware/file.middleware.js');

module.exports.uploadFile = asyncHandler(async (req, res) => {
    const file = {
        originalFileName: req.file.originalname,
        storedFileName: req.file.key,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: req.file.location,
        bucket: req.file.bucket
    };
    const { id } = req.params;
    const note = await Note.findById(id).populate('tags', 'name');
    note.files.push(file);
    await note.save();
    delete note._doc.__v;
    res.json(note);
});

module.exports.deleteFile = asyncHandler(async (req, res) => {
    const { id, storedFileName } = req.params;
    await s3.deleteObject({
        Bucket: process.env.S3_BUCKET,
        Key: storedFileName
    }).promise();
    const note = await Note
        .findByIdAndUpdate(id, { $pull: { files: { storedFileName } } }, { new: true })
        .populate('tags', 'name')
        .select('-__v');
    res.json(note);
});