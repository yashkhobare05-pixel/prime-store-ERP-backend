const express = require('express');
const { getSales, createSale } = require('../controllers/salesController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getSales)
  .post(protect, authorize('Admin', 'Manager', 'Employee'), createSale);

module.exports = router;
