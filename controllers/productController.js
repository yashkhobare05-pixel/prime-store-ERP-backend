const Product = require('../models/Product');
const logActivity = require('../utils/activityLogger');

exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, status, sortBy, sortOrder, page = 1, limit = 50 } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    if (status) query.status = status;

    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .populate('category', 'name code')
      .populate('supplier', 'name companyName')
      .populate('warehouse', 'name code')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limit),
      page: parseInt(page),
      products
    });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('supplier')
      .populate('warehouse');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    if (!req.body.barcode) {
      req.body.barcode = 'BAR' + Date.now() + Math.floor(Math.random() * 100);
    }
    if (!req.body.qrCode) {
      req.body.qrCode = `QR-${req.body.sku || 'PROD'}-${Date.now()}`;
    }
    const product = await Product.create(req.body);
    await logActivity(req.user, 'Create Product', 'Products', `Created product ${product.name} (SKU: ${product.sku})`, req);
    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    await logActivity(req.user, 'Update Product', 'Products', `Updated product ${product.name}`, req);
    res.status(200).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await product.deleteOne();
    await logActivity(req.user, 'Delete Product', 'Products', `Deleted product ${product.name}`, req);
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};
