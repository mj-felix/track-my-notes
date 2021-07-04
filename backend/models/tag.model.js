const mongoose = require('mongoose');

const TagSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            lowercase: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Tag', TagSchema);