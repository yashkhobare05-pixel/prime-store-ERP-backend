const express = require('express');
const { getPurchases, createPurchase, updatePurchaseStatus } = require('../controllers/purchaseController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getPurchases)
  .post(protect, authorize('Admin', 'Manager'), createPurchase);

router.put('/:id/status', protect, authorize('Admin', 'Manager'), updatePurchaseStatus);

module.exports = router;
