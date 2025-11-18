const express = require("express");
const requestsRouter = express.Router();
const userAuth = require("../middlewares/auth");

    
requestsRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try {
        const user = req.user;
        //sending connection request
        console.log("Sending connection request")
        res.send(user.firstName + " connection request sent")
    } catch (error) {
        res.status(500).send(error.message || "Failed to send connection request");
    }
}) 


module.exports = requestsRouter;