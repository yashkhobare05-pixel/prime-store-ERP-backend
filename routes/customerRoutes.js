const express = require('express');
const { getCustomers, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getCustomers)
  .post(protect, authorize('Admin', 'Manager'), createCustomer);

router.route('/:id')
  .put(protect, authorize('Admin', 'Manager'), updateCustomer)
  .delete(protect, authorize('Admin'), deleteCustomer);

module.exports = router;
