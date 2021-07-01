const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        profileName: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            minLength: 3,
            match: [/^[a-zA-Z-_]+$/, 'Only letters, dash (-) and underscore(_) allowed']
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#basic_validation
            match: [
                /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                'Email invalid'
            ]
        },
        password: {
            type: String,
            required: true,
            match: [
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@!%*?&-_+])[A-Za-z\d#@!%*?&-_+]{6,}$/,
                'Password must have minimum six characters, at least one uppercase letter, one lowercase letter, one number and one special character #@!%*?&-_+'
            ]
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
        isPublic: {
            type: Boolean,
            required: true,
            default: false,
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        linkedIn: {
            type: String,
        },
        twitter: {
            type: String,
        },
        gitHub: {
            type: String,
        },
        homepage: {
            type: String,
        },
        bio: {
            type: String,
        },
        location: {
            type: String,
        },
        refreshToken: {
            type: String,
            unique: true,
            index: true
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);