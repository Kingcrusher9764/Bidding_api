const express = require("express")
const { createItem, getItems, getItem, updateItem, deleteItem, upload, placeBid, getBids } = require("../controllers/itemControllers")
const { authenticate } = require("../middleware/auth")

const router = express.Router()

// items routes
router.get("/", getItems)
router.get("/:id", getItem)
router.post("/", authenticate, upload.single("image"), createItem)
router.put("/:id", authenticate, upload.single("image"), updateItem)
router.delete("/:id", authenticate, deleteItem)

// bids routes
router.get("/:itemId/bids", getBids)
router.post("/:itemId/bids", authenticate, placeBid)

module.exports = router
