const mongoose = require('mongoose');

const WarehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  capacityUnits: {
    type: Number,
    required: true,
    default: 10000
  },
  occupiedUnits: {
    type: Number,
    default: 0
  },
  managerName: String,
  contactPhone: String,
  status: {
    type: String,
    enum: ['Active', 'Maintenance', 'Full'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Warehouse', WarehouseSchema);
