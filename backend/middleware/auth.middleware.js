const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const User = require('../models/user.model.js');
const Tag = require('../models/tag.model.js');
const Note = require('../models/note.model.js');
const errors = require('../messages/error.messages.js');

module.exports.verifyAccessToken = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.content).select('-password');
            next();
        } catch (e) {
            console.log(e.name, e.message, e.expiredAt ? e.expiredAt : '');
            res.status(401);
            throw new Error(errors.auth.ACCESS_TOKEN_FAILED);
        }
    }
    if (!token) {
        res.status(401);
        throw new Error(errors.auth.ACCESS_TOKEN_FAILED);
    }
});

module.exports.tagBelongsToUser = asyncHandler(async (req, res, next) => {
    const tag = await Tag.findById(req.params.id).select('user');
    if (tag) {
        if (tag.user.equals(req.user._id)) {
            next();
        } else {
            res.status(403);
            throw new Error(errors.tag.NOT_USERS_TAG);
        }
    } else {
        res.status(404);
        throw new Error(errors.tag.NOT_FOUND);
    }
});

module.exports.noteBelongsToUser = asyncHandler(async (req, res, next) => {
    const note = await Note.findById(req.params.id).select('user');
    if (note) {
        if (note.user.equals(req.user._id)) {
            next();
        } else {
            res.status(403);
            throw new Error(errors.note.NOT_USERS_NOTE);
        }
    } else {
        res.status(404);
        throw new Error(errors.note.NOT_FOUND);
    }
});

module.exports.tagsBelongToUser = asyncHandler(async (req, res, next) => {
    const { tags: sentTags } = req.body;
    if (sentTags && sentTags.length) {
        let userTags = await Tag.find({ user: req.user._id }).select('_id');
        userTags = userTags.map(tag => tag._id.toString());
        const allTagsBelongToUser = req.body.tags.every(tag => userTags.includes(tag));
        if (allTagsBelongToUser) {
            next();
        } else {
            res.status(403);
            throw new Error(errors.tag.NOT_USERS_TAG);
        }
    } else {
        next();
    }
});

module.exports.fileBelongsToNote = asyncHandler(async (req, res, next) => {
    const { id, storedFileName } = req.params;
    const note = await Note.findById(id);
    if (!note.files.find(file => file.storedFileName === storedFileName)) {
        res.status(403);
        throw new Error(errors.file.NOT_USERS_FILE);
    }
    next();
});

module.exports.isSpaceAvailable = asyncHandler(async (req, res, next) => {
    const notes = await Note.find({ user: req.user._id });
    const files = [];
    for (let note of notes) {
        files.push(...note.files);
    }
    let storage = files.reduce((a, b) => a + b.size, 0);
    const size2000mb = 2000 * 1024 * 1024;
    if (storage > size2000mb) {
        res.status(406);
        throw new Error(errors.file.INSUFFCIENT_SPACE);
    }
    next();
});