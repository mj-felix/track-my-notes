const asyncHandler = require('express-async-handler');

const Note = require('../models/noteModel.js');
const { s3 } = require('../middleware/fileMiddleware.js');
const errors = require('../messages/errorMessages.js');

module.exports.createNote = asyncHandler(async (req, res) => {
    const { title, link, isSticky, isPublic, description, madePublicAt, tags } = req.body;
    const { _id: user } = req.user;

    let note = await Note.create({
        title,
        link,
        isSticky,
        isPublic,
        description,
        madePublicAt,
        tags,
        user
    });
    if (note) {
        note = await note.populate('tags', 'name').execPopulate();
        delete note._doc.__v;
        res.status(201).json(note);
    } else {
        res.status(400);
        throw new Error(errors.note.INVALID_NOTE);
    }
});

module.exports.updateNote = asyncHandler(async (req, res) => {
    const { title, link, isSticky, isPublic, description, madePublicAt, tags } = req.body;
    let note = await Note.findById(req.params.id).select('-__v');
    // if(!note) covered by noteBelongsToUser middleware
    note.title = title || note.title;
    note.link = link ? link : '';
    note.isSticky = isSticky || false;
    note.isPublic = isPublic || false;
    note.description = description || '';
    note.madePublicAt = madePublicAt || null;
    note.tags = tags || [];
    const updatedNote = await note.save();
    note = await note.populate('tags', 'name').execPopulate();
    res.json(updatedNote);
});

module.exports.deleteNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);
    // if(!note) covered by noteBelongsToUser middleware
    if (note.files.length) {
        const deleteParam = {
            Bucket: process.env.S3_BUCKET,
            Delete: {
                Objects: []
            }
        };
        for (let file of note.files) {
            deleteParam.Delete.Objects.push({ Key: file.storedFileName });
        }
        await s3.deleteObjects(deleteParam).promise();
    }
    await note.remove();
    res.status(204).send();
});

module.exports.getNotes = asyncHandler(async (req, res) => {
    const { search, tags } = req.query;
    const findFilter = { user: req.user._id };
    if (search) {
        // search phrase in title OR description OR link (ignore case)
        findFilter.$or = [
            { title: new RegExp(req.query.search, 'i') },
            { description: new RegExp(req.query.search, 'i') },
            { link: new RegExp(req.query.search, 'i') },
        ];
    }
    if (tags) {
        // all search tags matching Note tags
        findFilter.tags = { $all: tags.split(',') };
    }
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    const notesCount = await Note.countDocuments(findFilter);
    const notes = await Note
        .find(findFilter)
        .select('-__v')
        .sort({ isSticky: 'desc', madePublicAt: 'desc', updatedAt: 'desc' })
        .populate('tags', 'name')
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    res.json({ notes, notesCount, page, pageSize, pages: Math.ceil(notesCount / pageSize) });
});

module.exports.getNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id).select('-__v').populate('tags', 'name');
    // if(!note) covered by noteBelongsToUser middleware
    res.json(note);
});