const mongoose = require('mongoose');

const pasteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    views: {
        type: Number,
        default: 0,
    },
    comments: [
        {
            text: String,
            createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

module.exports = mongoose.model('Paste', pasteSchema);