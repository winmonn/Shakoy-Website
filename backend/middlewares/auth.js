const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  

    if (!token) {
        return res.status(403).send('Token required');  
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid or expired token');  
        }

        req.user = decoded;  
        next();  
    });
};

function isAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Permission denied.');
    }
    next();
}

module.exports = { verifyToken, isAdmin };
