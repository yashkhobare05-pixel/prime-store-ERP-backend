const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userName: String,
  userRole: String,
  action: {
    type: String,
    required: true
  },
  module: {
    type: String,
    required: true
  },
  details: String,
  ipAddress: String
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
