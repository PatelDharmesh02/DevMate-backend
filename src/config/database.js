const mongoose = require("mongoose");

// Connect to MongoDB

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://pateldharmesh:Patelcric8@cluster0.4n5ir.mongodb.net/DevMate"
  );
};

module.exports = connectDB;
