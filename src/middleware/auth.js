const jwt = require('jsonwebtoken');
const pool = require("../config/db")

const authenticate = async (req, res, next) => {
    if (!req.header('Authorization')) {
        return res.status(403).json({ message: "Token is not present" })
    }
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Token is not provided properly' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const query = "SELECT *  FROM users WHERE id=$1"
        const user = await pool.query(query, [decoded.id])

        if (!user.rows) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user.rows[0];

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = { authenticate };
