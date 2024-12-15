const bcrypt = require('bcrypt');
const pool = require('./models/db'); 

const hashPasswords = async () => {
    try {
        const [users] = await pool.execute('SELECT id, password FROM users');

        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 10); 

            await pool.execute('UPDATE users SET password = ? WHERE id = ?', [
                hashedPassword,
                user.id,
            ]);
            console.log(`Password for user ID ${user.id} has been hashed.`);
        }

        console.log('All passwords have been successfully hashed!');
    } catch (err) {
        console.error('Error hashing passwords:', err.message);
    }
};

hashPasswords();
