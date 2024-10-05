const express = require('express');
const router = express.Router();
const Joi = require('joi');
const asyncErrorHandler = require('../decorators/errorHandler');
const Column = require('../models/column');

// Validation Schemas
const addColumnSchema = Joi.object({
    titleColumn: Joi.string().required().min(1).max(100),
    boardId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(), // Added owner field
});

const updateColumnSchema = Joi.object({
    titleColumn: Joi.string().min(1).max(100),
});

// Get all columns
router.get('/', asyncErrorHandler(async (req, res) => {
    const result = await Column.find();
    if (!result || result.length === 0) {
        return res.status(404).json({ message: "You haven't got any columns" });
    }
    res.status(200).json(result);
}));

// Post a new column
router.post('/', asyncErrorHandler(async (req, res) => {
    const { titleColumn, boardId, owner } = await addColumnSchema.validateAsync(req.body);
    const newColumn = new Column({ titleColumn, boardId, owner });
    const result = await newColumn.save();
    res.status(201).json(result);
}));

// Update a column
router.patch('/', asyncErrorHandler(async (req, res) => {
    const { titleColumn } = await updateColumnSchema.validateAsync(req.body);
    const { id, columnId } = req.query;
    const result = await Column.findOneAndUpdate({ _id: columnId, boardId: id }, { titleColumn }, { new: true });
    if (!result) {
        return res.status(404).json({ message: "Column not found" });
    }
    res.status(200).json(result);
}));


// Delete a column
router.delete('/', asyncErrorHandler(async (req, res) => {
    const { id, columnId } = req.query;
    const result = await Column.findOneAndDelete({ _id: columnId, boardId: id });
    if (!result) {
        return res.status(404).json({ message: "Column not found" });
    }
    res.status(200).json({ message: "Column deleted successfully" });
}));

module.exports = router;