const express = require('express');
const { getPredictiveAnalytics } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/predict', protect, getPredictiveAnalytics);

module.exports = router;
