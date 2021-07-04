const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

const User = require('../models/user.model.js');
const Note = require('../models/note.model.js');
const errors = require('../messages/error.messages.js');

module.exports.getPublicUserProfile = asyncHandler(async (req, res) => {
    let user = await User
        .findOne({ profileName: req.params.profilename })
        .select('-password -__v -refreshToken -isAdmin -createdAt -updatedAt');
    if (user) {
        const userNotes = await Note.find({ user: user._id, isPublic: true });
        const publicNotesExist = userNotes.length ? true : false;
        //     .select('-__v')
        //     .sort({ isSticky: 'desc', madePublicAt: 'desc', updatedAt: 'desc' })
        //     .populate('tags', 'name');
        if (user.isPublic) {
            delete user._doc._id;
            user._doc.publicNotesExist = publicNotesExist;
            // user._doc.notes = userNotes;
        } else {
            // res.status(403);
            // throw new Error('User not public');
            user = {
                'isPublic': false,
                'profileName': user.profileName,
                'publicNotesExist': publicNotesExist,
            };
            // user.notes = userNotes;
        }
        res.json(user);
    } else {
        res.status(404);
        throw new Error(errors.user.NOT_FOUND);
    }
});

module.exports.getPublicNote = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(404);
        throw new Error(errors.note.NOT_FOUND);
    }
    const note = await Note
        .findOne({ _id: req.params.id, isPublic: true })
        .select('-__v')
        .populate(
            {
                path: 'user',
                match: { profileName: req.params.profilename },
                select: 'profileName isPublic -_id'
            }
        )
        .populate('tags', 'name');
    if (note && note.user) {
        res.json(note);
    } else {
        res.status(404);
        throw new Error(errors.note.NOT_FOUND);
    }
});

module.exports.getPublicNotes = asyncHandler(async (req, res) => {
    let user = await User.findOne({ profileName: req.params.profilename });
    if (user) {
        const { tags } = req.query;
        const findFilter = { user: user._id, isPublic: true };
        if (tags) {
            // all search tags matching Note tags
            findFilter.tags = { $all: tags.split(',') };
        }
        const pageSize = Number(req.query.pageSize) || 10;
        const page = Number(req.query.page) || 1;
        const notesCount = await Note.countDocuments(findFilter);
        const userNotes = await Note
            .find(findFilter)
            .select('-__v')
            .sort({ isSticky: 'desc', madePublicAt: 'desc', updatedAt: 'desc' })
            .populate('tags', 'name')
            .populate('user', 'isPublic profileName -_id')
            .limit(pageSize)
            .skip(pageSize * (page - 1));
        res.json({ notes: userNotes, notesCount, page, pageSize, pages: Math.ceil(notesCount / pageSize) });
    } else {
        res.status(404);
        throw new Error(errors.user.NOT_FOUND);
    }
});