const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const dotenv = require("dotenv")
const rateLimit = require("express-rate-limit")

dotenv.config()
const userRoutes = require("./routes/userRoutes")
const itemRoutes = require("./routes/itemRoutes")
const notificationRoutes = require("./routes/notificationRoutes")
const errorHandler = require("./middleware/errorHandler")

// rate limiter
const limiter = rateLimit({
    max: 200,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP"
})
const app = express()
const PORT = process.env.PORT || 4000

app.use(limiter)
app.use(cors())
app.use(bodyParser.json())

app.use("/api/user", userRoutes)
app.use("/api/items", itemRoutes)
app.use("/api/notifications", notificationRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server started at PORT:${PORT}`)
})
