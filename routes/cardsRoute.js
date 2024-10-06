const express = require('express');
const router = express.Router();
const Joi = require('joi');
const asyncErrorHandler = require('../decorators/errorHandler');
const Card = require('../models/card');

const addCardSchema = Joi.object({
    titleCard: Joi.string().required().min(1).max(100),
    description: Joi.string().max(500),
    priority: Joi.string(),
    deadline: Joi.date().iso(),
    columnId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});

const updateCardSchema = Joi.object({
    titleCard: Joi.string().min(1).max(100),
    description: Joi.string().max(500),
    priority: Joi.string(),
    deadline: Joi.date().iso(),
});

// Get all cards
router.get('/', asyncErrorHandler(async (req, res) => {
    const result = await Card.find();
    if (!result || result.length === 0) {
        return res.status(404).json({ message: "You haven't got any cards" });
    }
    res.status(200).json(result);
}));

// Post a new card
router.post('/', asyncErrorHandler(async (req, res) => {
    const { titleCard, description, priority, columnId, owner } = await addCardSchema.validateAsync(req.body);
    const newCard = new Card({ titleCard, description, priority, columnId, owner });
    const result = await newCard.save();
    res.status(201).json(result);
}));

// Update a card
router.patch('/', asyncErrorHandler(async (req, res) => {
    const { titleCard, description, priority, deadline } = await updateCardSchema.validateAsync(req.body);
    const { columnId, cardId } = req.query;

    if (!columnId || !cardId) {
        return res.status(400).json({ message: "Missing id or cardId in query parameters" });
    }

    const result = await Card.findOneAndUpdate({ _id: cardId, columnId: columnId }, { titleCard, description, priority, deadline }, { new: true });
    if (!result) {
        return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json(result);
}));

// Delete a card
router.delete('/', asyncErrorHandler(async (req, res) => {
    const { columnId, cardId } = req.query;

    if (!columnId || !cardId) {
        return res.status(400).json({ message: "Missing id or cardId in query parameters" });
    }

    const result = await Card.findOneAndDelete({ _id: cardId, columnId: columnId });
    if (!result) {
        return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json({ message: "Card deleted successfully" });
}));

module.exports = router;