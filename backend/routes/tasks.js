const express = require('express');
const pool = require('../models/db'); // Database connection

const router = express.Router();

// Fetch all tasks with pagination - No Token Required
router.get('/', async (req, res) => {
    let limit = parseInt(req.query.limit, 10);
    let offset = parseInt(req.query.offset, 10);

    // Default values if limit or offset is invalid
    if (isNaN(limit) || limit <= 0) limit = 10; 
    if (isNaN(offset) || offset < 0) offset = 0;

    try {
        const [tasks] = await pool.execute('SELECT * FROM tasks LIMIT ? OFFSET ?', [limit, offset]);
        res.status(200).json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err.message);
        res.status(500).json({ message: 'Error fetching tasks', error: err.message });
    }
});

// Fetch a single task by ID - No Token Required
router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10; // Default to 10 if invalid
    const offset = parseInt(req.query.offset) || 0; // Default to 0 if invalid

    try {
        if (isNaN(limit) || isNaN(offset)) {
            throw new Error("Limit and offset must be valid numbers");
        }

        const [tasks] = await pool.execute('SELECT * FROM tasks LIMIT ? OFFSET ?', [limit, offset]);
        res.status(200).json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err.message);
        res.status(500).json({ message: 'Error fetching tasks', error: err.message });
    }
});


router.post('/', async (req, res) => {
    const { title, description, category, due_date } = req.body;

    if (!title || !category) {
        return res.status(400).json({ message: 'Title and category are required' });
    }

    try {
        // Find category_id by category name
        const [categoryResult] = await pool.execute('SELECT id FROM categories WHERE name = ?', [category]);
        if (categoryResult.length === 0) {
            return res.status(400).json({ message: 'Invalid category selected. Please choose a valid category name.' });
        }
        const category_id = categoryResult[0].id;

        // Insert the task
        const status = 'Pending'; // Default status
        const user_id = 1; // Default user ID, replace if needed
        const [result] = await pool.execute(
            'INSERT INTO tasks (title, description, status, due_date, user_id, category_id) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description || null, status, due_date || null, user_id, category_id]
        );

        res.status(201).json({
            message: 'Task created successfully',
            taskId: result.insertId,
        });
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ message: 'Error creating task', error: err.message });
    }
});


// Update a task by ID - No Token Required
router.put('/:id', async (req, res) => {
    const taskId = req.params.id;
    const { title, description, status, due_date, category_id } = req.body;

    if (!title && !description && !status && !due_date && !category_id) {
        return res.status(400).json({ message: 'At least one field is required to update' });
    }

    const updates = [];
    const values = [];

    if (title) updates.push('title = ?') && values.push(title);
    if (description) updates.push('description = ?') && values.push(description);
    if (status) updates.push('status = ?') && values.push(status);
    if (due_date) updates.push('due_date = ?') && values.push(due_date);
    if (category_id) updates.push('category_id = ?') && values.push(category_id);

    values.push(taskId);

    try {
        const [result] = await pool.execute(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating task', error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    const taskId = req.params.id;

    try {
        const [result] = await pool.execute('DELETE FROM tasks WHERE id = ?', [taskId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ message: 'Error deleting task', error: err.message });
    }
});

module.exports = router;
