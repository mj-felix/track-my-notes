const asyncHandler = require('express-async-handler');

const Tag = require('../models/tagModel.js');
const Note = require('../models/noteModel.js');

module.exports.createTag = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const { _id: user } = req.user;

    const tagExists = await Tag.findOne({ name, user });
    if (tagExists) {
        res.status(400);
        throw new Error('Tag already exists for this user');
    }

    const tag = await Tag.create({
        name,
        user
    });
    if (tag) {
        delete tag._doc.__v;
        res.status(201).json(tag);
    } else {
        res.status(400);
        throw new Error('Tag data invalid');
    }
});

module.exports.updateTag = asyncHandler(async (req, res) => {
    const tag = await Tag.findById(req.params.id).select('-__v');
    // if(!tag) covered by tagBelongsToUser middleware
    tag.name = req.body.name || tag.name;
    const updatedTag = await tag.save();
    res.json(updatedTag);
});

module.exports.deleteTag = asyncHandler(async (req, res) => {
    const tag = await Tag.findById(req.params.id);
    // if(!tag) covered by tagBelongsToUser middleware
    const notesToUntag = await Note.find({ tags: { '_id': tag._id } });
    for (let i = 0; i < notesToUntag.length; i++) {
        notesToUntag[i].tags.pull(tag._id);
        await notesToUntag[i].save();
    }
    await tag.remove();
    res.json({ message: 'Tag removed' });
});

module.exports.getTags = asyncHandler(async (req, res) => {
    const tags = await Tag.find({ user: req.user._id }).select('-__v');
    res.json(tags);
});