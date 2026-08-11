const Product = require('../models/Product');
const InventoryTransaction = require('../models/InventoryTransaction');
const Warehouse = require('../models/Warehouse');
const logActivity = require('../utils/activityLogger');

exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await InventoryTransaction.find()
      .populate('product', 'name sku barcode')
      .populate('sourceWarehouse', 'name code')
      .populate('destinationWarehouse', 'name code')
      .populate('performedBy', 'name role')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({ success: true, count: transactions.length, transactions });
  } catch (err) {
    next(err);
  }
};

exports.stockIn = async (req, res, next) => {
  try {
    const { productId, quantity, warehouseId, batchNumber, serialNumber, reason } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const prevStock = product.stockQuantity;
    product.stockQuantity += Number(quantity);
    if (batchNumber) product.batchNumber = batchNumber;
    if (serialNumber && !product.serialNumbers.includes(serialNumber)) {
      product.serialNumbers.push(serialNumber);
    }
    await product.save();

    const transaction = await InventoryTransaction.create({
      product: productId,
      type: 'Stock In',
      quantity: Number(quantity),
      previousStock: prevStock,
      newStock: product.stockQuantity,
      destinationWarehouse: warehouseId || product.warehouse,
      batchNumber,
      serialNumber,
      reason: reason || 'Purchase / Inbound Stock',
      performedBy: req.user.id,
      referenceNo: 'REC-' + Date.now().toString().slice(-6)
    });

    if (warehouseId || product.warehouse) {
      await Warehouse.findByIdAndUpdate(warehouseId || product.warehouse, {
        $inc: { occupiedUnits: Number(quantity) }
      });
    }

    await logActivity(req.user, 'Stock In', 'Inventory', `Stocked in ${quantity} units of ${product.name}`, req);
    res.status(200).json({ success: true, message: 'Stock added successfully', product, transaction });
  } catch (err) {
    next(err);
  }
};

exports.stockOut = async (req, res, next) => {
  try {
    const { productId, quantity, warehouseId, reason } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stockQuantity < Number(quantity)) {
      return res.status(400).json({ success: false, message: 'Insufficient stock available' });
    }

    const prevStock = product.stockQuantity;
    product.stockQuantity -= Number(quantity);
    await product.save();

    const transaction = await InventoryTransaction.create({
      product: productId,
      type: 'Stock Out',
      quantity: Number(quantity),
      previousStock: prevStock,
      newStock: product.stockQuantity,
      sourceWarehouse: warehouseId || product.warehouse,
      reason: reason || 'Sales Outbound',
      performedBy: req.user.id,
      referenceNo: 'OUT-' + Date.now().toString().slice(-6)
    });

    if (warehouseId || product.warehouse) {
      await Warehouse.findByIdAndUpdate(warehouseId || product.warehouse, {
        $inc: { occupiedUnits: -Number(quantity) }
      });
    }

    await logActivity(req.user, 'Stock Out', 'Inventory', `Stocked out ${quantity} units of ${product.name}`, req);
    res.status(200).json({ success: true, message: 'Stock removed successfully', product, transaction });
  } catch (err) {
    next(err);
  }
};

exports.adjustStock = async (req, res, next) => {
  try {
    const { productId, newStockLevel, reason } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const prevStock = product.stockQuantity;
    const diff = Number(newStockLevel) - prevStock;
    product.stockQuantity = Number(newStockLevel);
    await product.save();

    const transaction = await InventoryTransaction.create({
      product: productId,
      type: 'Adjustment',
      quantity: Math.abs(diff),
      previousStock: prevStock,
      newStock: product.stockQuantity,
      reason: reason || 'Audit Stock Adjustment',
      performedBy: req.user.id,
      referenceNo: 'ADJ-' + Date.now().toString().slice(-6)
    });

    await logActivity(req.user, 'Inventory Adjustment', 'Inventory', `Adjusted ${product.name} from ${prevStock} to ${newStockLevel}`, req);
    res.status(200).json({ success: true, message: 'Stock adjusted successfully', product, transaction });
  } catch (err) {
    next(err);
  }
};

exports.transferWarehouse = async (req, res, next) => {
  try {
    const { productId, quantity, sourceWarehouseId, destinationWarehouseId, reason } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const transaction = await InventoryTransaction.create({
      product: productId,
      type: 'Transfer',
      quantity: Number(quantity),
      sourceWarehouse: sourceWarehouseId,
      destinationWarehouse: destinationWarehouseId,
      reason: reason || 'Inter-warehouse Optimization',
      performedBy: req.user.id,
      referenceNo: 'TRF-' + Date.now().toString().slice(-6)
    });

    await Warehouse.findByIdAndUpdate(sourceWarehouseId, { $inc: { occupiedUnits: -Number(quantity) } });
    await Warehouse.findByIdAndUpdate(destinationWarehouseId, { $inc: { occupiedUnits: Number(quantity) } });

    await logActivity(req.user, 'Warehouse Transfer', 'Inventory', `Transferred ${quantity} units of ${product.name}`, req);
    res.status(200).json({ success: true, message: 'Stock transferred successfully', transaction });
  } catch (err) {
    next(err);
  }
};
