const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const generateToken = require('../utils/generate-token.js');
const User = require('../models/user.model.js');
const errors = require('../messages/error.messages.js');

module.exports.register = asyncHandler(async (req, res) => {
    const { profileName, email, password } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) {
        res.status(400);
        throw new Error(errors.user.EMAIL_EXISTS);
    }

    const profileNameExists = await User.findOne({ profileName });
    if (profileNameExists) {
        res.status(400);
        throw new Error(errors.user.PROFILE_NAME_EXISTS);
    }

    const isAdmin = (email &&
        (email.toLowerCase() === process.env.ADMIN_EMAIL
            || email.toLowerCase() === 'mochaone@test.com'))
        ? true
        : false;

    const refreshToken = uuid.v4();

    const user = await User.create({
        profileName,
        email,
        password,
        isAdmin,
        refreshToken
    });
    if (user) {
        delete user._doc.password;
        delete user._doc.refresh_token;
        delete user._doc.__v;
        res.status(201).json({
            'user': user,
            'accessToken': generateToken(user._id, 'access'),
            'refreshToken': generateToken(refreshToken, 'refresh'),
        });
    } else {
        res.status(400);
        throw new Error(errors.user.INVALID_USER);
    }
});

module.exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        const refreshToken = uuid.v4();
        await User.findByIdAndUpdate(user._id, { refreshToken });
        delete user._doc.refreshToken;
        delete user._doc.password;
        delete user._doc.__v;
        res.json({
            'user': user,
            'accessToken': generateToken(user._id, 'access'),
            'refreshToken': generateToken(refreshToken, 'refresh'),
            'test': 'ooo'
        });
    } else {
        res.status(401);
        throw new Error(errors.auth.INVALID_CREDENTIALS);
    }
});

module.exports.refreshAccessToken = asyncHandler(async (req, res) => {
    let refreshToken;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            refreshToken = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
            const user = await User.findOne({ 'refreshToken': decoded.content });
            if (user) {
                res.json({
                    'accessToken': generateToken(user._id, 'access'),
                });
            } else {
                res.status(401);
                throw new Error(errors.auth.REFRESH_TOKEN_FAILED);
            }
        } catch (e) {
            console.log(e.name, e.message, e.expiredAt ? e.expiredAt : '');
            res.status(401);
            throw new Error(errors.auth.REFRESH_TOKEN_FAILED);
        }
    }
    if (!refreshToken) {
        res.status(401);
        throw new Error(errors.auth.REFRESH_TOKEN_FAILED);
    }
});