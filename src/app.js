require('dotenv').config();
const express = require('express');
const connectDB = require("./config/database");
const app = express();

const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");

// Mount routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
    
connectDB()
    .then(() => {
        console.log("Database connected successfully");
        app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
    })
    .catch((err) => {
        console.log("Database connection failed", err);
    });






