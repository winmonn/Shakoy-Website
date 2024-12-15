const bcrypt = require('bcrypt');
const pool = require('./db'); // MySQL connection pool

const verifyUser = async (email, password) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return { success: false, message: 'Invalid email or password' };
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            return { success: true, user };
        } else {
            return { success: false, message: 'Invalid email or password' };
        }
    } catch (err) {
        console.error('Error verifying user:', err.message);
        return { success: false, message: 'Internal server error' };
    }
};

const createUser = async ({ name, email, password }) => {
    try {
        // Check if email is already registered
        const [existingUser] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return { success: false, message: 'Email already in use' };
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        return {
            success: true,
            user: { id: result.insertId, name, email }
        };
    } catch (err) {
        console.error('Error creating user:', err.message);
        return { success: false, message: 'Internal server error' };
    }
};

module.exports = { verifyUser, createUser };
