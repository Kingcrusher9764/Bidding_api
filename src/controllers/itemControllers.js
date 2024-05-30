const multer = require('multer');
const pool = require('../config/db');
const { createNotification } = require("./notificationControllers")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

const createItem = async (req, res, next) => {
    try {
        const owner_id = req.user.id
        const { name, description, starting_price, end_time } = req.body;
        const image_url = req.file ? `./uploads/${req.file.filename}` : null;

        const query = "INSERT INTO items(name, owner_id, description, starting_price, image_url, end_time) values($1, $2, $3, $4, $5, $6) RETURNING *;"
        const item = await pool.query(query, [name, owner_id, description, starting_price, image_url, end_time])

        res.status(201).json({ info: item.rows });
    } catch (error) {
        next(error);
    }
};

const getItems = async (req, res, next) => {
    try {
        const { page, limit } = req.query

        const query = "SELECT * FROM items ORDER BY id LIMIT $1 OFFSET $2;"
        const { rows } = await pool.query(query, [limit, (page - 1) * limit])

        res.status(200).json({ items: rows })
    } catch (error) {
        next(error);
    }
}

const getItem = async (req, res, next) => {
    try {
        const { id } = req.params

        const query = "SELECT * FROM items WHERE id=$1;"
        const { rows } = await pool.query(query, [id])

        if (!rows.length) {
            return res.status(404).json({ msg: "Item not found" })
        }

        res.status(200).json({ item: rows[0] })
    } catch (error) {
        next(error);
    }
}

const updateItem = async (req, res, next) => {
    try {
        const { id } = req.params
        const owner_id = req.user.id

        const query1 = "SELECT * FROM items WHERE id=$1";
        const item = await pool.query(query1, [id])

        if (!item.rows.length) {
            return res.status(404).json({ msg: "This item is not present" })
        }
        if (item.rows[0].owner_id !== owner_id) {
            return res.status(403).json({ mag: "Only item user can update the item" })
        }

        const { name, description, starting_price, end_time } = req.body
        const image_url = req.file ? `./uploads/${req.file.filename}` : null;

        const query = "UPDATE items SET name=$1, description=$2, starting_price=$3, end_time=$4, image_url=$5 WHERE id=$6 RETURNING *;"
        const { rows } = await pool.query(query, [name, description, starting_price, end_time, image_url, id])

        res.status(203).json({ msg: "Item updated", item: rows[0] })
    } catch (error) {
        next(error)
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const { id } = req.params
        const owner_id = req.user.id

        const query1 = "SELECT * FROM items WHERE id=$1";
        const item = await pool.query(query1, [id])

        if (!item.rows.length) {
            return res.status(404).json({ msg: "This item is not present" })
        }
        if (item.rows[0].owner_id !== owner_id) {
            return res.status(403).json({ msg: "Only item user can delete the item" })
        }

        const query = "DELETE FROM items WHERE id=$1 RETURNING *;"
        const { rows } = await pool.query(query, [id])

        res.status(203).json({ msg: "Item deleted", itemInfo: rows[0] })
    } catch (error) {
        next(error)
    }
}

const placeBid = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { itemId } = req.params
        const { bid_amount } = req.body

        // checks if item is present or not
        const query1 = "SELECT * FROM items WHERE id=$1"
        const item = await pool.query(query1, [itemId])

        if (!item.rows.length) {
            return res.status(404).json({ msg: "The item is not present" })
        }
        // Check if the item owner is not placing the bid
        if (userId == item.rows[0].owner_id) {
            return res.status(403).json({ msg: "The owner can't place the bid" })
        }

        // Check if the bid is placed already or not
        const query2 = "SELECT * FROM bids WHERE user_id=$1 and item_id=$2;"
        const bid = await pool.query(query2, [userId, itemId])

        if (!bid.rows.length) {
            // if not present create a bid
            const query = "INSERT INTO bids(item_id, user_id, bid_amount) values($1, $2, $3) RETURNING *;"
            const { rows } = await pool.query(query, [itemId, userId, bid_amount])

            res.status(201).json({ msg: "Bid placed successfully", info: rows[0] })
        } else {
            // if present update the bid of that item
            const query3 = "UPDATE bids SET bid_amount=$1 WHERE user_id=$2 and item_id=$3 RETURNING *;"
            const updatedBid = await pool.query(query3, [bid_amount, userId, itemId])

            res.status(203).json({ msg: "Bid Placed successfully", info: updatedBid.rows[0] })
        }

        await createNotification(userId, itemId, bid_amount, item.rows[0].name)

    } catch (error) {
        next(error)
    }
}

const getBids = async (req, res, next) => {
    try {
        const { itemId } = req.params

        const query1 = "SELECT * FROM items WHERE id=$1"
        const item = await pool.query(query1, [itemId])
        if (!item.rows.length) {
            return res.status(404).json({ msg: "Item is not present" })
        }

        const query = "SELECT * FROM bids WHERE item_id=$1;"
        const { rows } = await pool.query(query, [itemId])

        res.status(203).json({ bids: rows })
    } catch (error) {
        next(error)
    }
}

module.exports = { createItem, getItems, getItem, updateItem, deleteItem, upload, placeBid, getBids };
