const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { requireAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Public endpoint to view payment details (Bank Transfer & QRIS)
router.get('/payment-info', settingController.getPaymentInfo);

// Admin updates payment settings or QRIS image
router.post('/payment-info', requireAdmin, upload.single('qris_image'), settingController.updatePaymentSettings);

module.exports = router;
