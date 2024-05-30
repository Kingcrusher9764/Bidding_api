const pool = require("../config/db")

const createNotification = async (userId, itemId, bidPlaced, itemName) => {
    try {
        // get the user id of item owner
        const usersQuery = "SELECT user_id FROM bids WHERE item_id=$1;"
        const { rows } = await pool.query(usersQuery, [itemId])

        // get the username who is placing the bid
        const userQuery = "SELECT username FROM users WHERE id=$1;"
        const user = await pool.query(userQuery, [userId])
        const { username } = user.rows[0]

        const message = `${username} has placed ${bidPlaced} on ${itemName}`

        // create notifications for all the user who bids on the item
        for (let i = 0; i < rows.length; i++) {
            const query = "INSERT INTO notifications(user_id, message) values($1, $2);"
            if (rows[i].user_id != userId) {
                const result = await pool.query(query, [rows[i].user_id, message])
            } else {
                const message2 = `You has placed ${bidPlaced} on ${itemName}`
                const result = await pool.query(query, [rows[i].user_id, message2])
            }
        }

        return { msg: "Success" }
    } catch (error) {
        console.log(error)
    }
}

const getNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id

        const query = "SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC;"
        const { rows } = await pool.query(query, [userId])

        res.status(203).json({ messages: rows })
    } catch (error) {
        next(error)
    }
}

const markNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id

        const query = "UPDATE notifications SET is_read=TRUE WHERE user_id=$1;"
        const result = await pool.query(query, [userId])

        res.status(203).json({ messages: "Marked notifications as read" })
    } catch (error) {
        next(error)
    }
}

module.exports = { createNotification, getNotifications, markNotifications }