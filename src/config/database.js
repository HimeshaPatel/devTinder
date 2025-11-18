const mongoose = require("mongoose");

const connectDB = async() => {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        throw new Error("MONGODB_URI environment variable is not defined");
    }
    await mongoose.connect(mongoURI);
}


module.exports = connectDB;

 
  

