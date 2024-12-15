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
        console.log('Creating user with:', { name, email }); // Log incoming data

        // Check if email is already registered
        const [existingUser] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            console.error('Email already in use:', email); // Log duplicate email attempt
            return { success: false, message: 'Email already in use' };
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully'); // Log successful hashing

        // Insert the new user into the database
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        console.log('User created successfully with ID:', result.insertId); // Log user creation
        return {
            success: true,
            user: { id: result.insertId, name, email },
        };
    } catch (err) {
        console.error('Error creating user:', err.message); // Log any errors
        return { success: false, message: 'Internal server error' };
    }
};


module.exports = { verifyUser, createUser };
