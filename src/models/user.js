const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String, 
        required: true,    
        minLength: 4,    
        maxLength: 50,
        trim: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, 
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email");
            }
        },
    },
    password: {
        type: String,
        required: true,
        // No length constraints needed - bcrypt hashes are always 60 characters
        // Password strength is validated before hashing in the signup route
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "other"].includes(value)){
                throw new Error("Gender must be either male or female");
            }
        },
    },
    photoUrl: {
        type: String,
        default: "https://sc-auetal.de/wp-content/uploads/2018/04/personal-dummy.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL");
            }
        },
    },
    about: {
        type: String,
        default: "This is about of the user!",
        minLength: 10,
        maxLength: 500,
        trim: true,
    },
    skills: {
        type: [String],
        validate: {
            validator: function (value) {
                if (!Array.isArray(value)) return false;
                if (value.length > 10) return false;
                return value.every((skill) => typeof skill === "string" && skill.trim().length > 0);
            },
            message: "skills must be an array of up to 10 non-empty strings",
        },
    },
   
},
{timestamps: true}
);

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id: user._id}, "DevTinder@123", {
        expiresIn: "7d"
    });
    return token;
}


userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;

}


module.exports = mongoose.model("User", userSchema);