const express = require('express');
const { getActivityLogs } = require('../controllers/activityLogController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, authorize('Admin', 'Manager'), getActivityLogs);

module.exports = router;
