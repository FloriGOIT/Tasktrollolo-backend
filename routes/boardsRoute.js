const express = require('express');
const router = express.Router();
const Joi = require('joi');
const asyncErrorHandler = require('../decorators/errorHandler');
const Board = require('../models/board');
const backgrounds = require('../properties/backgrounds');
const iconsBoard = require('../properties/icons');
const filterTypes = require('../properties/filterTypes');
const passport = require('passport'); // Import passport

const addBoardSchema = Joi.object({
    titleBoard: Joi.string().required(),
    background: Joi.string().valid(...backgrounds),
    icon: Joi.string().valid(...iconsBoard),
    filter: Joi.string().valid(...filterTypes),
});

const updateBoardSchema = Joi.object({
    titleBoard: Joi.string(),
    background: Joi.string().valid(...backgrounds),
    icon: Joi.string().valid(...iconsBoard),
    filter: Joi.string().valid(...filterTypes),   
});

// Get all boards
router.get('/', passport.authenticate('jwt', { session: false }), asyncErrorHandler(async (req, res) => {
    try {
        const { _id: owner } = req.user;

        const result = await Board.find({ owner });

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "You haven't got any boards" });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}));

// Post a new board
router.post('/', passport.authenticate('jwt', { session: false }), asyncErrorHandler(async (req, res) => {
    try {
        const { _id: owner } = req.user;
        const { titleBoard, background, icon, filter } = await addBoardSchema.validateAsync(req.body);

        const newBoard = new Board({ owner, titleBoard, background, icon, filter });
        const result = await newBoard.save();

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: "Invalid data", error: error.message });
    }
}));

// Get a board by id
router.get('/:id', passport.authenticate('jwt', { session: false }), asyncErrorHandler(async (req, res) => {
    try {
        const { _id: owner } = req.user;
        const { id } = req.params;

        const result = await Board.findOne({ _id: id, owner });

        if (!result) {
            return res.status(404).json({ message: "Board not found" });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}));

// Update a board
<<<<<<< HEAD
router.put('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { id } = req.query;
        const { _id: owner } = req.user;
        const updateData = req.body;

        const board = await Board.findOneAndUpdate({ _id: id, owner }, updateData, { new: true });

        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        res.status(200).json(board);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Delete a board
router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { _id: owner } = req.user;
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: "Board ID is required" });
        }
=======
router.put('/:id', passport.authenticate('jwt', { session: false }), asyncErrorHandler(async (req, res) => {
    try {
        const { _id: owner } = req.user;
        const { id } = req.params;
        const { titleBoard, background, icon, filter } = await updateBoardSchema.validateAsync(req.body);

        const result = await Board.findOneAndUpdate({ _id: id, owner }, { titleBoard, background, icon, filter }, { new: true });

        if (!result) {
            return res.status(404).json({ message: "Board not found" });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: "Invalid data", error: error.message });
    }
}));

// Delete a board
router.delete('/:id', passport.authenticate('jwt', { session: false }), asyncErrorHandler(async (req, res) => {
    try {
        const { _id: owner } = req.user;
        const { id } = req.params;
>>>>>>> 70eec918e76c692b692555390c08255a33a9fe90

        const result = await Board.findOneAndDelete({ _id: id, owner });

        if (!result) {
            return res.status(404).json({ message: "Board not found" });
        }

<<<<<<< HEAD
        res.status(200).json({ message: "Board deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

=======
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}));
>>>>>>> 70eec918e76c692b692555390c08255a33a9fe90

module.exports = router;