const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_stock_inventory');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // If local MongoDB isn't running, log warning so memory database or fallback can function gracefully
    console.warn("Continuing system execution. Verify MongoDB connection if persistence is required.");
  }
};

module.exports = connectDB;
