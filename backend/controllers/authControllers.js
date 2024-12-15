const bcrypt = require('bcrypt');
const pool = require('../models/db'); 

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

module.exports = { verifyUser };
