const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Low Stock', 'Expiry Alert', 'Reorder Alert', 'Order Update', 'AI Insight', 'System Alert'],
    default: 'Low Stock'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
