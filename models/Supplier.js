const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  companyName: String,
  email: {
    type: String,
    required: true
  },
  phone: String,
  address: String,
  rating: {
    type: Number,
    default: 4.8,
    min: 1,
    max: 5
  },
  leadTimeDays: {
    type: Number,
    default: 3
  },
  deliveryPerformanceScore: {
    type: Number,
    default: 95.5
  },
  paymentTerms: {
    type: String,
    default: 'Net 30'
  },
  status: {
    type: String,
    enum: ['Active', 'Preferred', 'Inactive'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', SupplierSchema);
