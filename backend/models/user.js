const bcrypt = require('bcrypt');
const pool = require('./db'); // MySQL connection pool

const verifyUser = async (email, password) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            console.log('No user found for email:', email); // Log email not found
            return { success: false, message: 'Invalid email or password' };
        }

        const user = rows[0];
        console.log('Database user password hash:', user.password); // Log hashed password

        const match = await bcrypt.compare(password, user.password);
        console.log('Password match:', match); // Log password match result

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


const createUser = async ({ email, username, password }) => {
    try {
        // Check if email is already registered
        const [existingUser] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return { success: false, message: 'Email already in use' };
        }

        // Insert the new user into the database
        const [result] = await pool.execute(
            'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
            [email, username, password]
        );

        return {
            success: true,
            user: { id: result.insertId, email, username },
        };
    } catch (err) {
        console.error('Error creating user:', err.message);
        return { success: false, message: 'Internal server error' };
    }
};

module.exports = { verifyUser, createUser };

