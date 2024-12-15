const express = require('express');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const pool = require('../models/db'); // Database connection

const router = express.Router();

// Fetch all tasks with pagination
router.get('/', verifyToken, async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    try {
        const [tasks] = await pool.execute('SELECT * FROM tasks LIMIT ? OFFSET ?', [limit, offset]);
        res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching tasks', error: err.message });
    }
});

// Fetch a single task by ID
router.get('/:id', verifyToken, async (req, res) => {
    const taskId = req.params.id;

    try {
        const [task] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [taskId]);
        if (task.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching task', error: err.message });
    }
});

// Create a new task
router.post('/', verifyToken, async (req, res) => {
    const { title, description, status, due_date, user_id, category_id } = req.body;

    if (!title || !user_id || !category_id) {
        return res.status(400).json({ message: 'Title, user_id, and category_id are required' });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO tasks (title, description, status, due_date, user_id, category_id) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description || null, status || 'Pending', due_date || null, user_id, category_id]
        );
        res.status(201).json({ message: 'Task created successfully', taskId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating task', error: err.message });
    }
});

// Update a task by ID
router.put('/:id', verifyToken, async (req, res) => {
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

// Delete a task by ID
router.delete('/:id', verifyToken, async (req, res) => {
    const taskId = req.params.id;

    try {
        const [result] = await pool.execute('DELETE FROM tasks WHERE id = ?', [taskId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting task', error: err.message });
    }
});

module.exports = router;
