const mongoose = require('mongoose');

const SalesItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: Number,
  unitPrice: Number,
  totalPrice: Number
});

const SalesOrderSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  items: [SalesItemSchema],
  subtotal: Number,
  tax: Number,
  discount: Number,
  totalAmount: Number,
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Partially Paid', 'Refunded'],
    default: 'Paid'
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Bank Transfer', 'Cash', 'UPI', 'PayPal'],
    default: 'Credit Card'
  },
  orderStatus: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Delivered'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('SalesOrder', SalesOrderSchema);
