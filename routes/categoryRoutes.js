const express = require('express');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getCategories)
  .post(protect, authorize('Admin', 'Manager'), createCategory);

router.route('/:id')
  .put(protect, authorize('Admin', 'Manager'), updateCategory)
  .delete(protect, authorize('Admin'), deleteCategory);

module.exports = router;
