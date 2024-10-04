const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
    titleColumn: {
        type: String,
        required: true,
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    versionKey: false,
    timestamps: true,
});

const Column = mongoose.model('Column', columnSchema);

module.exports = Column;