const SalesOrder = require('../models/SalesOrder');
const Product = require('../models/Product');
const logActivity = require('../utils/activityLogger');

exports.getSales = async (req, res, next) => {
  try {
    const sales = await SalesOrder.find()
      .populate('customer', 'name email phone')
      .populate('items.product', 'name sku sellingPrice')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: sales.length, sales });
  } catch (err) {
    next(err);
  }
};

exports.createSale = async (req, res, next) => {
  try {
    const { customer, items, paymentMethod, discount = 0, tax = 0 } = req.body;
    let subtotal = 0;
    const itemsFormatted = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.productId} not found` });
      }
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for product ${product.name}` });
      }

      const unitPrice = item.unitPrice || product.sellingPrice;
      const lineTotal = item.quantity * unitPrice;
      subtotal += lineTotal;

      itemsFormatted.push({
        product: product._id,
        quantity: item.quantity,
        unitPrice,
        totalPrice: lineTotal
      });

      product.stockQuantity -= item.quantity;
      await product.save();
    }

    const totalAmount = subtotal + tax - discount;
    const invoiceNumber = 'INV-' + Date.now().toString().slice(-6);

    const sale = await SalesOrder.create({
      invoiceNumber,
      customer,
      items: itemsFormatted,
      subtotal,
      tax,
      discount,
      totalAmount,
      paymentMethod: paymentMethod || 'Credit Card',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      createdBy: req.user.id
    });

    await logActivity(req.user, 'Create Sales Order', 'Sales', `Created Invoice ${invoiceNumber} ($${totalAmount})`, req);
    res.status(201).json({ success: true, sale });
  } catch (err) {
    next(err);
  }
};
