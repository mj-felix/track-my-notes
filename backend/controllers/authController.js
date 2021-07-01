const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');


const generateToken = require('../utils/generateToken.js');
const User = require('../models/userModel.js');

module.exports.register = asyncHandler(async (req, res) => {
    const { profileName, email, password } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) {
        res.status(400);
        throw new Error('Email already exists');
    }

    const profileNameExists = await User.findOne({ profileName });
    if (profileNameExists) {
        res.status(400);
        throw new Error('Profile name already exists');
    }

    const isAdmin = email.toLowerCase() === process.env.ADMIN_EMAIL ? true : false;

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
        delete user._doc.__v;
        res.status(201).json({
            'user': user,
            'accessToken': generateToken(user._id, 'access'),
            'refreshToken': generateToken(refreshToken, 'refresh'),
        });
    } else {
        res.status(400);
        throw new Error('User data invalid');
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
        });
    } else {
        res.status(401);
        throw new Error('Credentials invalid');
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
                throw new Error('Not authorized, refresh token failed');
            }
        } catch (e) {
            console.log(e.name, e.message, e.expiredAt ? e.expiredAt : '');
            res.status(401);
            throw new Error('Not authorized, refresh token failed');
        }
    }
    if (!refreshToken) {
        res.status(401);
        throw new Error('Not authorized, no refresh token');
    }
});