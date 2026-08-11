const mongoose = require('mongoose');

const PurchaseItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: Number,
  unitCost: Number,
  totalCost: Number
});

const PurchaseOrderSchema = new mongoose.Schema({
  poNumber: {
    type: String,
    required: true,
    unique: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  items: [PurchaseItemSchema],
  totalAmount: Number,
  status: {
    type: String,
    enum: ['Draft', 'Pending', 'Ordered', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  expectedDeliveryDate: Date,
  receivedDate: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);
