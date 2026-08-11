const express = require('express');
const {
  getTransactions,
  stockIn,
  stockOut,
  adjustStock,
  transferWarehouse
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/transactions', protect, getTransactions);
router.post('/stock-in', protect, authorize('Admin', 'Manager'), stockIn);
router.post('/stock-out', protect, authorize('Admin', 'Manager'), stockOut);
router.post('/adjust', protect, authorize('Admin', 'Manager'), adjustStock);
router.post('/transfer', protect, authorize('Admin', 'Manager'), transferWarehouse);

module.exports = router;
