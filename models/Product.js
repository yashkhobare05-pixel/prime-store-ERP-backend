const mongoose = require('mongoose');

const ProductVariantSchema = new mongoose.Schema({
  name: String,
  sku: String,
  price: Number,
  quantity: Number
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add product name'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'Please add product SKU'],
    unique: true,
    uppercase: true
  },
  barcode: {
    type: String,
    required: true,
    unique: true
  },
  qrCode: {
    type: String
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse'
  },
  description: {
    type: String,
    default: ''
  },
  costPrice: {
    type: Number,
    required: true
  },
  sellingPrice: {
    type: Number,
    required: true
  },
  stockQuantity: {
    type: Number,
    default: 0
  },
  minStockLevel: {
    type: Number,
    default: 10
  },
  maxStockLevel: {
    type: Number,
    default: 200
  },
  reorderPoint: {
    type: Number,
    default: 20
  },
  unit: {
    type: String,
    default: 'PCS'
  },
  variants: [ProductVariantSchema],
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80'
  },
  batchNumber: String,
  expiryDate: Date,
  isSerialTracked: {
    type: Boolean,
    default: false
  },
  serialNumbers: [String],
  status: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Out of Stock', 'Discontinued'],
    default: 'In Stock'
  },
  movementVelocity: {
    type: String,
    enum: ['Fast Moving', 'Moderate Moving', 'Slow Moving', 'Dead Stock'],
    default: 'Fast Moving'
  }
}, { timestamps: true });

ProductSchema.pre('save', function (next) {
  if (this.stockQuantity <= 0) {
    this.status = 'Out of Stock';
  } else if (this.stockQuantity <= this.minStockLevel) {
    this.status = 'Low Stock';
  } else {
    this.status = 'In Stock';
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
