const express = require('express');
const { getDashboardStats, exportReport } = require('../controllers/reportcontroller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.get('/dashboard', getDashboardStats);
router.get('/export', exportReport);

module.exports = router;