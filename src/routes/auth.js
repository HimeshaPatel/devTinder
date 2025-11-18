const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user")
const bcrypt = require("bcrypt");


authRouter.post("/signup", async (req, res) => {
   
    try{
        validateSignUpData(req);
        //encypt password

        const {firstName, lastName, email, password} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);

         const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });    
        console.log(user);
        await user.save();
        res.send("User created successfully");
    } catch (error) {
        console.error("Signup error:", error);
        // Handle duplicate email error
        if (error.code === 11000) {
            return res.status(400).send("Email already exists");
        }
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).send(errors.join(", "));
        }
        // Handle other errors
        res.status(500).send(error.message || "User creation failed");   
    }
    })
 
authRouter.post("/login", async (req, res) => {
    try {

        const {email, password} = req.body;
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(400).send("Invalid email or password");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            //create a token
            const token = await user.getJWT();
            console.log(token);
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            res.send("Login successful");
        }        
        else{
            return res.status(400).send("Invalid email or password");
        }



    } catch (error) {
        console.error("Signup error:", error);
        // Handle duplicate email error
        if (error.code === 11000) {
            return res.status(400).send("Email already exists");
        }
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).send(errors.join(", "));
        }
        // Handle other errors
        res.status(500).send(error.message || "User creation failed");   
    }
})

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout successful");
})





module.exports = authRouter;
