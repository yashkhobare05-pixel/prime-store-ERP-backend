const PurchaseOrder = require('../models/PurchaseOrder');
const Product = require('../models/Product');
const logActivity = require('../utils/activityLogger');

exports.getPurchases = async (req, res, next) => {
  try {
    const purchases = await PurchaseOrder.find()
      .populate('supplier', 'name companyName')
      .populate('items.product', 'name sku')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: purchases.length, purchases });
  } catch (err) {
    next(err);
  }
};

exports.createPurchase = async (req, res, next) => {
  try {
    const { supplier, items, expectedDeliveryDate } = req.body;
    let totalAmount = 0;
    const itemsFormatted = items.map(item => {
      const lineTotal = item.quantity * item.unitCost;
      totalAmount += lineTotal;
      return {
        product: item.productId,
        quantity: item.quantity,
        unitCost: item.unitCost,
        totalCost: lineTotal
      };
    });

    const poNumber = 'PO-' + Date.now().toString().slice(-6);
    const purchase = await PurchaseOrder.create({
      poNumber,
      supplier,
      items: itemsFormatted,
      totalAmount,
      expectedDeliveryDate,
      createdBy: req.user.id
    });

    await logActivity(req.user, 'Create Purchase Order', 'Purchases', `Created PO ${poNumber} ($${totalAmount})`, req);
    res.status(201).json({ success: true, purchase });
  } catch (err) {
    next(err);
  }
};

exports.updatePurchaseStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const purchase = await PurchaseOrder.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Purchase order not found' });
    }

    if (status === 'Completed' && purchase.status !== 'Completed') {
      purchase.receivedDate = Date.now();
      for (const item of purchase.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stockQuantity: item.quantity }
        });
      }
    }

    purchase.status = status;
    await purchase.save();

    await logActivity(req.user, 'Update Purchase Status', 'Purchases', `Updated PO ${purchase.poNumber} status to ${status}`, req);
    res.status(200).json({ success: true, purchase });
  } catch (err) {
    next(err);
  }
};
