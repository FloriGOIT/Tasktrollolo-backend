const mongoose = require('mongoose');
const filterTypes = require("../properties/filterTypes");

const cardSchema = new mongoose.Schema({
    titleCard: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    priority: {
        type: String,
        enum: {
            values: filterTypes,
            message: `You can choose a priority for ${filterTypes}`,
        },
        default: 'default',
    },
    columnId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Column',
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    deadline: {
        type: Date,
    }
}, {
    versionKey: false,
    timestamps: true,
});

const Card = mongoose.model('Card', cardSchema);
module.exports = Card;