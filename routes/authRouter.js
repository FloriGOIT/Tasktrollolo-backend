const express = require("express");
const router = express.Router();
const User = require("../models/users");
const auth = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Register a new user
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        return res.status(409).json({
            status: "error",
            code: 409,
            message: "Email already in use",
            data: "Conflict",
        });
    }
    try {
        const newUser = new User({ name, email });
        await newUser.setPassword(password);
        await newUser.save();
        res.status(201).json({
            status: "success",
            code: 201,
            data: {
                message: "Registration successful",
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Internal Server Error",
            data: error.message,
        });
    }
});

// Login a user
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.isValidPassword(password))) {
        return res.status(400).json({
            status: "error",
            code: 400,
            message: "Incorrect email or password",
            data: "Bad Request",
        });
    }

    const payload = {
        id: user.id,
        username: user.username,
    };

    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

        // Save the refresh token in the database
        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            status: "success",
            code: 200,
            data: {
                token,
                refreshToken,
            },
        });
    } catch (error) {
        console.error('Token generation error:', error);
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Internal Server Error",
            data: error.message,
        });
    }
});

// Logout a user
router.get('/logout', auth, async (req, res) => {
    try {
        const user = req.user;
        user.token = null;
        await user.save();
        res.status(200).json({
            status: "success",
            code: 200,
            message: 'Successfully logged out',
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            status: "error",
            code: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});

module.exports = router;