require('dotenv').config();
const http = require('http');
const socket = require('socket.io');
const { app, PORT } = require("./app")

const server = http.createServer(app);
const io = socket(server);

const pool = require("./config/db")

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('bid', async (data) => {
        try {
            const { itemId, userId, bidAmount } = data;

            const itemQuery = "SELECT * FROM items WHERE id=$1;"
            const item = await pool.query(itemQuery, [itemId])

            if (!item.rows.length) {
                return console.log("Item is not present")
            }

            // Update the item's current price
            const bidQuery = "SELECT * FROM bids WHERE user_id=$1 and item_id=$2;"
            const bids = await pool.query(bidQuery, [userId, itemId])

            if (!bids.rows.length) {
                const createBidQuery = "INSERT INTO bids(item_id, user_id, bid_amount) values($1,$2,$3) RETURNING *;"
                const createdBid = await pool.query(createBidQuery, [itemId, userId, bidAmount])
            } else {
                const updateBidQuery = "UPDATE bids SET bid_amount=$1 WHERE user_id=$2 and item_id=$3 RETURNING *;"
                const updateBid = await pool.query(updateBidQuery, [bidAmount, userId, itemId])
            }

            if (bidAmount > item.rows[0].current_price) {
                const updateItemQuery = "UPDATE items SET current_price=$1 WHERE id=$2 RETURNING *;"
                const updateItem = await pool.query(updateItemQuery, [bidAmount, itemId])
            }

            // Notify all connected clients about the new bid
            const user = await pool.query("SELECT * FROM users where id=$1", [userId])
            let message = `New Bid of ${bidAmount} for ${item.rows[0].name} has been placed by ${user.rows[0].name}`

            io.emit('update', message);

            // Create a notification for the item owner
            message = `New Bid of ${bidAmount} for ${item.rows[0].name} has been placed by you`

            socket.emit('notify', message);

        } catch (error) {
            console.error(error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
