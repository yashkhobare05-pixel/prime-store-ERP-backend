const express = require('express');
const { getReportsSummary } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', protect, getReportsSummary);

module.exports = router;
