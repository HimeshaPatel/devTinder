const express = require("express");
const requestsRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
    
requestsRouter.post("/request/send/:status/:touserId",
     userAuth,
     async (req, res) => {
    try {
       const fromUserId = req.user._id;
       const toUserId = req.params.touserId;
       const status = req.params.status;

       const allowedStatus = ["ignored", "interested"];
       if(!allowedStatus.includes(status)){
        return res.status(400)
        .json({
            message: "Invalid status: " + status,
        });
       }

       const toUser = await User.findById(toUserId);
       if(!toUser){
        return res.status(400)
        .json({
            message: "User not found",
        });
       }

       const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
            {fromUserId, toUserId},
            {fromUserId: toUserId, toUserId: fromUserId},
        ]
       });
       if(existingConnectionRequest){
        return res.status(400)
        .json({
            message: "Connection request already exists",
        });
       }



       const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
       })
        const data = await connectionRequest.save(); 
        res.json({
            message: "Connection request sent successfully",
            data,
        })      
    } catch (error) {
        res.status(500).send(error.message || "Failed to send connection request");
    }
}) 


module.exports = requestsRouter;