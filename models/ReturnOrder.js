const mongoose = require('mongoose');

const ReturnOrderSchema = new mongoose.Schema({
  returnNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['Sales Return', 'Purchase Return'],
    required: true
  },
  referenceOrder: String,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: Number,
  reason: String,
  refundAmount: Number,
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('ReturnOrder', ReturnOrderSchema);
