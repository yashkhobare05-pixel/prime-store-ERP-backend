const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  address: String,
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  tier: {
    type: String,
    enum: ['Standard', 'Silver', 'Gold', 'Platinum'],
    default: 'Standard'
  },
  totalSpent: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
