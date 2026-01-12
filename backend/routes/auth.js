const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token berlaku 1 hari
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    const userExists = await User.findOne({ username });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        username,
        password,
    });

    if (user) {
        // Set cookie on successful registration
        res.cookie('token', generateToken(user._id), {
            httpOnly: true, // Tidak bisa diakses client-side JS
            secure: process.env.NODE_ENV === 'production', // Hanya kirim via HTTPS di production
            sameSite: 'Lax', // Perlindungan CSRF
            maxAge: 24 * 60 * 60 * 1000, // 1 hari
        });

        res.status(201).json({
            _id: user._id,
            username: user.username,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
        // Set cookie on successful login
        res.cookie('token', generateToken(user._id), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000, // 1 hari
        });

        res.json({
            _id: user._id,
            username: user.username,
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private (sebenarnya public, hanya menghapus cookie)
router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0), // Set tanggal kedaluwarsa ke masa lalu
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });
    res.json({ message: 'Logged out successfully' });
});


module.exports = router;