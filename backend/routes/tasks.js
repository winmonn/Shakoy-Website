const express = require('express');
const Task = require('../models/task');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

const validateCategory = (category_id, callback) => {
    db.query(
        'SELECT COUNT(*) AS count FROM categories WHERE id = ?',
        [category_id],
        (err, results) => {
            if (err || results[0].count === 0) {
                return callback(false); 
            }
            callback(true); 
        }
    );
};

router.delete('/tasks/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const taskId = req.params.id;
        
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await Task.findByIdAndDelete(taskId);

        res.status(200).json({ message: 'Task successfully deleted' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/tasks', (req, res) => {
    const { title, description, status, due_date, user_id, category_id } = req.body;

    if (!category_id) {
        return res.status(400).json({ error: 'category_id is required' });
    }

    validateCategory(category_id, (isValid) => {
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid category_id' });
        }

        db.query(
            'INSERT INTO tasks (title, description, status, due_date, user_id, category_id) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, status, due_date, user_id, category_id],
            (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Database error' });
                }
                res.status(201).json({ message: 'Task created successfully', taskId: results.insertId });
            }
        );
    });
});



router.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, status, due_date, category_id } = req.body;

    if (!category_id) {
        return res.status(400).json({ error: 'category_id is required' });
    }

    validateCategory(category_id, (isValid) => {
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid category_id' });
        }

        db.query(
            'UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ?, category_id = ? WHERE id = ?',
            [title, description, status, due_date, category_id, id],
            (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Database error' });
                }
                res.status(200).json({ message: 'Task updated successfully' });
            }
        );
    });
});



module.exports = router;
