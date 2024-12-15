const express = require('express');
const { authenticateJWT } = require('../middleware/auth'); // Authentication middleware
const pool = require('../models/db'); // Database connection

const router = express.Router();

// Fetch all categories
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const [categories] = await pool.execute('SELECT * FROM categories');
        res.status(200).json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching categories', error: err.message });
    }
});

// Create a new category
router.post('/', authenticateJWT, async (req, res) => {
    const { name, description, user_id } = req.body;

    if (!name || !user_id) {
        return res.status(400).json({ message: 'Name and user_id are required' });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO categories (name, description, user_id) VALUES (?, ?, ?)',
            [name, description || null, user_id]
        );
        res.status(201).json({ message: 'Category created successfully', categoryId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating category', error: err.message });
    }
});

// Update a category by ID
router.put('/:id', authenticateJWT, async (req, res) => {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    if (!name && !description) {
        return res.status(400).json({ message: 'At least one field (name or description) is required for update' });
    }

    const updates = [];
    const values = [];

    if (name) {
        updates.push('name = ?');
        values.push(name);
    }

    if (description) {
        updates.push('description = ?');
        values.push(description);
    }

    values.push(categoryId);

    try {
        const [result] = await pool.execute(
            `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating category', error: err.message });
    }
});

// Delete a category by ID
router.delete('/:id', authenticateJWT, async (req, res) => {
    const categoryId = req.params.id;

    try {
        const [result] = await pool.execute('DELETE FROM categories WHERE id = ?', [categoryId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting category', error: err.message });
    }
});

module.exports = router;
