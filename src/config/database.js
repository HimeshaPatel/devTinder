const mongoose = require("mongoose");

const connectDB = async() => {
    await mongoose.connect("mongodb+srv://himeshapatel888_db_user:jbjuOM1RwsplVLr8@namstedev.hkvj1lk.mongodb.net/devTinder");
}


module.exports = connectDB;

 
  

