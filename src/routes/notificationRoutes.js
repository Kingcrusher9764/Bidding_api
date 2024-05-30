const express = require("express")
const { getNotifications, markNotifications } = require("../controllers/notificationControllers")
const { authenticate } = require("../middleware/auth")

const router = express.Router()

router.get("/", authenticate, getNotifications)
router.post("/mark-read", authenticate, markNotifications)

module.exports = router