const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { verifyUser, createUser } = require('../models/user'); 
require('dotenv').config();

const router = express.Router();

// Login Endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const result = await verifyUser(email, password);

    if (!result.success) {
        return res.status(401).send(result.message);
    }

    const user = result.user;

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({ token });
});

// Signup Endpoint
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await createUser({ name, email, password: hashedPassword });

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        const user = result.user;

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ message: 'User registered successfully', token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
});

module.exports = router;
