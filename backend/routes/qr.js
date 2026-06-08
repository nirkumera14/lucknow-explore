const express = require('express');
const router = express.Router();
const { generateQR, generateAllQRs, recordScan, getScanHistory, getQRStats, downloadQR } = require('../controllers/qrController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

router.post('/generate/:id', protect, authorize('admin'), generateQR);
router.post('/generate-all', protect, authorize('admin'), generateAllQRs);
router.post('/scan', optionalAuth, recordScan);
router.get('/history', protect, getScanHistory);
router.get('/stats', protect, authorize('admin'), getQRStats);
router.get('/download/:id', downloadQR);

module.exports = router;
