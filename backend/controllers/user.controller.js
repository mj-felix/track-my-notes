const asyncHandler = require('express-async-handler');

const generateToken = require('../utils/generate-token.js');
const User = require('../models/user.model.js');
const errors = require('../messages/error.messages.js');

module.exports.getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -__v -refreshToken');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error(errors.user.NOT_FOUND);
    }
});

module.exports.updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
        user.isPublic = req.body.isPublic || user.isPublic;
        user.firstName = req.body.firstName || '';
        user.lastName = req.body.lastName || '';
        user.linkedIn = req.body.linkedIn || '';
        user.twitter = req.body.twitter || '';
        user.gitHub = req.body.gitHub || '';
        user.homepage = req.body.homepage || '';
        user.bio = req.body.bio || '';
        user.location = req.body.location || '';

        if (req.body.profileName) {
            user.profileName = req.body.profileName;
        }
        if (req.body.password) {
            user.password = req.body.password;
        }
        if (req.body.email) {
            user.email = req.body.email;
        }

        const updatedUser = await user.save();
        delete updatedUser._doc.password;
        delete updatedUser._doc.refreshToken;
        delete updatedUser._doc.__v;
        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error(errors.user.NOT_FOUND);
    }
});
