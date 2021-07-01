const asyncHandler = require('express-async-handler');

const generateToken = require('../utils/generateToken.js');
const User = require('../models/userModel.js');

module.exports.getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -__v');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports.updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
        user.profileName = req.body.profileName || user.profileName;
        user.email = req.body.email || user.email;
        user.isPublic = req.body.isPublic || user.isPublic;
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.linkedIn = req.body.linkedIn || user.linkedIn;
        user.twitter = req.body.twitter || user.twitter;
        user.gitHub = req.body.gitHub || user.gitHub;
        user.homepage = req.body.homepage || user.homepage;
        user.bio = req.body.bio || user.bio;
        user.location = req.body.location || user.location;

        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        delete updatedUser._doc.password;
        delete updatedUser._doc.__v;
        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});
