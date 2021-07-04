const mongoose = require('mongoose');

const FileSchema = mongoose.Schema(
    {
        originalFileName: String,
        storedFileName: String,
        mimeType: String,
        size: Number,
        url: String,
        bucket: String,
    },
    {
        timestamps: true,
    }
);

const NoteSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        link: {
            type: String,
        },
        isSticky: {
            type: Boolean,
            required: true,
            default: false,
        },
        isPublic: {
            type: Boolean,
            required: true,
            default: false,
        },
        description: {
            type: String,
        },
        madePublicAt: {
            type: Date,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        files: [FileSchema],
        tags: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag'
        }]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Note', NoteSchema);