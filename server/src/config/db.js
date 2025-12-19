// src/config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('\n💡 Make sure MongoDB is running:');
    console.error('   - If using local MongoDB: Start the MongoDB service');
    console.error('   - If using MongoDB Atlas: Check your connection string in .env');
    console.error('   - Connection URI:', process.env.MONGO_URI);
    process.exit(1);
  }
};

module.exports = connectDB;
