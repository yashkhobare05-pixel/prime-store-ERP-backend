const express = require('express');
const { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } = require('../controllers/warehouseController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getWarehouses)
  .post(protect, authorize('Admin', 'Manager'), createWarehouse);

router.route('/:id')
  .put(protect, authorize('Admin', 'Manager'), updateWarehouse)
  .delete(protect, authorize('Admin'), deleteWarehouse);

module.exports = router;
