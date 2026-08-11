const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_stock_inventory';
    const conn = await mongoose.connect(connStr);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      console.error('CRITICAL: Check MONGO_URI environment variable and MongoDB Atlas IP Network Access (0.0.0.0/0 whitelist).');
    }
  }
};

module.exports = connectDB;
