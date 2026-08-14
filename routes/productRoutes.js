const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/seed', seedProducts);
router.post('/seed', seedProducts);

router.route('/')
  .get(protect, getProducts)
  .post(protect, authorize('Admin', 'Manager'), createProduct);

router.route('/:id')
  .get(protect, getProductById)
  .put(protect, authorize('Admin', 'Manager'), updateProduct)
  .delete(protect, authorize('Admin'), deleteProduct);

module.exports = router;
