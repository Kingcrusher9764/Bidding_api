const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require("../config/db")

const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = "INSERT INTO users (username, password, email) VALUES($1, $2, $3) RETURNING * ;"

        const newUser = await pool.query(query, [username, hashedPassword, email])

        res.status(201).json({ msg: "user regstered successfully!", newUser: newUser.rows });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const query = "SELECT * FROM users WHERE email=$1 ;"
        const { rows } = await pool.query(query, [email])

        if (!rows.length || !(await bcrypt.compare(password, rows[0].password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const row = rows[0]
        const token = jwt.sign({ id: row.id, role: row.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
};

const profile = async (req, res, next) => {
    try {

        const query = "SELECT * FROM users WHERE id=$1"
        const { rows } = await pool.query(query, [req.user.id])

        if (!rows.length) {
            return res.status(404).json({ msg: "User not found" })
        }

        const { password, ...info } = rows[0]
        res.status(200).json(info);

    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, profile };
