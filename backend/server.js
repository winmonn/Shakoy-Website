const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); 
const pool = require('./models/db'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

function authenticateJWT(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                const expiredToken = jwt.decode(token); 

                if (!expiredToken) {
                    return res.status(403).json({ message: 'Invalid token.' });
                }

                const newToken = jwt.sign(
                    { userId: expiredToken.userId },
                    process.env.JWT_SECRET,
                    { expiresIn: '15m' } 
                );

                res.setHeader('Authorization', `Bearer ${newToken}`);
                req.user = expiredToken; 
                return next();
            }

            return res.status(403).json({ message: 'Invalid token.' });
        }

        req.user = user; 
        next(); 
    });
}


app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT 1 + 1 AS result');
        res.status(200).json({ message: 'Database connected!', result: rows[0].result });
    } catch (err) {
        res.status(500).json({ message: 'Database connection failed', error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user[0].password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ message: 'Login successful', token });

    } catch (err) {
        res.status(500).json({ message: 'Error during login', error: err.message });
    }
});

app.post('/users', async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        return res.status(400).json({ message: 'Password must include at least one uppercase letter and one number' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        res.status(201).json({ message: 'User created', userId: result.insertId });
    } catch (err) {
        next(err);
    }
});


app.put('/users/:id', authenticateJWT, async (req, res) => {
    const { name, email, password } = req.body;
    const userId = req.params.id;

    if (!name && !email && !password) {
        return res.status(400).json({ message: 'At least one field (name, email, password) is required' });
    }

    const updates = [];
    const values = [];
    
    if (name) {
        updates.push('name = ?');
        values.push(name);
    }
    if (email) {
        updates.push('email = ?');
        values.push(email);
    }
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updates.push('password = ?');
        values.push(hashedPassword);
    }

    values.push(userId);

    try {
        const [result] = await pool.execute(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
});

app.delete('/users/:id', authenticateJWT, async (req, res) => {
    const userId = req.params.id;

    try {
        const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
});

app.get('/users', authenticateJWT, async (req, res) => {
    try {
        const [users] = await pool.execute('SELECT * FROM users');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});

app.post('/tasks', authenticateJWT, async (req, res) => {
    const { title, description, status, due_date, user_id, category_id } = req.body;

    if (!title || !user_id || !category_id) {
        return res.status(400).json({
            message: 'Title, user_id, and category_id are required'
        });
    }

    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    const taskStatus = status || 'Pending';

    try {
        const [result] = await pool.execute(
            'INSERT INTO tasks (title, description, status, due_date, user_id, category_id) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description || null, taskStatus, due_date || null, user_id, category_id]
        );

        res.status(201).json({ message: 'Task created', taskId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: 'Error creating task', error: err.message });
    }
});


app.get('/tasks', authenticateJWT, async (req, res) => {
    try {
        const [tasks] = await pool.execute('SELECT * FROM tasks');
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching tasks', error: err.message });
    }
});

app.get('/tasks/:id', authenticateJWT, async (req, res) => {
    const taskId = req.params.id; 

    try {
        const [task] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [taskId]);

        if (task.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task[0]); 
    } catch (err) {
        res.status(500).json({ message: 'Error fetching task', error: err.message });
    }
});

app.put('/tasks/:id', authenticateJWT, async (req, res) => {
    const taskId = req.params.id; 
    const { title, description, status, due_date } = req.body; 

    if (!title && !description && !status && !due_date) {
        return res.status(400).json({ message: 'At least one field is required to update' });
    }

    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedStatus = status || undefined;

    try {
        const [result] = await pool.execute(
            'UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ? WHERE id = ?',
            [title || null, description || null, updatedStatus, due_date || null, taskId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating task', error: err.message });
    }
});

app.delete('/tasks/:id', authenticateJWT, async (req, res) => {
    const taskId = req.params.id; 

    try {
        const [result] = await pool.execute('DELETE FROM tasks WHERE id = ?', [taskId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting task', error: err.message });
    }
});

app.post('/categories', authenticateJWT, async (req, res) => {
    const { name, description, userId } = req.body;

    if (!name || !userId) {
        return res.status(400).json({ message: 'Name and user ID are required' });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO categories (name, description, user_id) VALUES (?, ?, ?)',
            [name, description || null, userId]
        );

        res.status(201).json({ message: 'Category created', categoryId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: 'Error creating category', error: err.message });
    }
});

app.put('/categories/:id', authenticateJWT, async (req, res) => {
    const { name, description } = req.body;
    const categoryId = req.params.id;

    if (!name && !description) {
        return res.status(400).json({ message: 'At least one field (name, description) is required' });
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
        res.status(500).json({ message: 'Error updating category', error: err.message });
    }
});

app.delete('/categories/:id', authenticateJWT, async (req, res) => {
    const categoryId = req.params.id;

    try {
        const [result] = await pool.execute('DELETE FROM categories WHERE id = ?', [categoryId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting category', error: err.message });
    }
});

app.get('/categories', authenticateJWT, async (req, res) => {
    try {
        const [categories] = await pool.execute('SELECT id, name, description, user_id FROM categories');
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching categories', error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});
