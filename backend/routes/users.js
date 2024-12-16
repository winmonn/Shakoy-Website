const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../models/db'); 
const bcrypt = require('bcrypt');
const { verifyUser, createUser, getUserById, getAllUsers, updateUser, deleteUser } = require('../models/user');
const { verifyToken, isAdmin } = require('../middlewares/auth');
require('dotenv').config();

const router = express.Router();

// User login
router.post('/login', async (req, res) => {
    console.log('Login Request Body:', req.body); 

    const { email, password } = req.body;

    try {
        const [user] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (user.length === 0) {
            console.log('No user found for email:', email);
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user[0].password);

        if (!validPassword) {
            console.log('Password mismatch for email:', email);
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        console.log('Login successful for email:', email);
        res.status(200).json({ message: 'Login successful', token });

    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).json({ message: 'Error during login', error: err.message });
    }
});


// User signup
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    console.log('Signup Request Body:', req.body);

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long and include one uppercase letter and one number' });
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

        console.log('Signup successful, returning token'); // Log success
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: result.user,
        });
    } catch (err) {
        console.error('Error in /signup route:', err.message); // Log any route-level errors
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
});

// Fetch all users (admin only)
router.get('/', verifyToken, async (req, res) => {
    try {
        const users = await getAllUsers();

        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});

// Fetch a user by ID
router.get('/:id', verifyToken, async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching user', error: err.message });
    }
});

// Update user details
router.put('/:id', verifyToken, async (req, res) => {
    const userId = req.params.id;
    const updates = req.body;

    if (!updates.name && !updates.email && !updates.password) {
        return res.status(400).json({ message: 'At least one field (name, email, password) is required for update' });
    }

    try {
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const result = await updateUser(userId, updates);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
});

// Delete a user by ID
router.delete('/:id', verifyToken, async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await deleteUser(userId);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
});

module.exports = router;
