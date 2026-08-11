const Warehouse = require('../models/Warehouse');

exports.getWarehouses = async (req, res, next) => {
  try {
    const warehouses = await Warehouse.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: warehouses.length, warehouses });
  } catch (err) {
    next(err);
  }
};

exports.createWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.create(req.body);
    res.status(201).json({ success: true, warehouse });
  } catch (err) {
    next(err);
  }
};

exports.updateWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, warehouse });
  } catch (err) {
    next(err);
  }
};

exports.deleteWarehouse = async (req, res, next) => {
  try {
    await Warehouse.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Warehouse deleted' });
  } catch (err) {
    next(err);
  }
};
