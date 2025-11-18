const validator = require("validator");

const validateSignUpData = (req) =>{
    const {firstName, lastName, email, password} = req.body;

    if (!firstName || !lastName){
        throw new Error("First name and last name are required");
    } else if (!validator.isEmail(email)){
        throw new Error("Invalid email");
    } else if (!validator.isStrongPassword(password)){
        throw new Error("Password is not strong");
    } 
};

const validateProfileEditData = (req) => {
    const allowedEditFields = 
    ["firstName",
    "lastName",
    "email",
    "photoUrl",
    "about",
    "gender",
    "age",
    "skills"];

    const isEditAllowed = Object.keys(req.body).every(field => 
        allowedEditFields.includes(field));

      return isEditAllowed;  
}

module.exports = {
    validateSignUpData,
    validateProfileEditData
}