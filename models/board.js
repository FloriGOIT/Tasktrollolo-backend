const mongoose = require('mongoose');
const icon = require('../properties/icons');
const filterType = require('../properties/filterTypes');
const background = require('../properties/backgrounds');

const boardSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    titleBoard: {
        type: String,
        required: true,
    },
    background: {
        type: String,
        enum: {
            values: background,
            message: `You can choose a background board from ${background}`,
        },
        default: 'default',
    },
    icon: {
        type: String,
        enum: {
            values: icon,
            message: `You can choose a icon from ${icon}`,
        },
        default: 'default',
    },
    filter: {
        type: String,
        enum: {
            values: filterType,
            message: `You can choose a filter board for ${filterType}`,
        },
        default: 'default',
    },
}, {
    versionKey: false,
    timestamps: true,
});

const Board = mongoose.model('Board', boardSchema);
module.exports = Board;