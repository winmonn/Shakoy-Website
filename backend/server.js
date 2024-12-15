const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); 
const pool = require('./models/db'); 

const userRoutes = require('./routes/users'); 
const taskRoutes = require('./routes/tasks'); 
const categoryRoutes = require('./routes/categories'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3001', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
})); 
app.use(bodyParser.json()); 

// Test database connection
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT 1 + 1 AS result');
        res.status(200).json({ message: 'Database connected!', result: rows[0].result });
    } catch (err) {
        res.status(500).json({ message: 'Database connection failed', error: err.message });
    }
});

// Modularized routes
app.use('/users', userRoutes);       
app.use('/tasks', taskRoutes);       
app.use('/categories', categoryRoutes); 
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
