const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("Unauthorized");
        }
        const decodeObj = await jwt.verify(token, "DevTinder@123");
        const {_id} = decodeObj;
        const user =  await User.findById(_id);
        if(!user){
            throw new Error("Unauthorized");
        }
        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({message: error.message || "Unauthorized"});
    }
}
module.exports = userAuth;