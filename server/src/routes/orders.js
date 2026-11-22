const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { optionalAuth, authenticateToken } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { createRateLimiter } = require('../middleware/security');

const createOrderLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 20 });
const lookupOrderLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 60 });
const proofUploadLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 15 });

// Static route first
router.get('/my/all', authenticateToken, orderController.getMyOrders);

// Create order
router.post('/', createOrderLimiter, optionalAuth, orderController.createOrder);

// Protected payment proof download/view (hanya pemilik order / admin / email tamu yang cocok)
router.get('/:orderNumber/payment-proof', lookupOrderLimiter, optionalAuth, orderController.getPaymentProof);

// Get order by unique order number (verifikasi kepemilikan user/admin atau email tamu)
router.get('/:orderNumber', lookupOrderLimiter, optionalAuth, orderController.getOrderByNumber);

// Upload payment proof for an order
router.post(
  '/:orderNumber/payment-proof',
  proofUploadLimiter,
  optionalAuth,
  upload.single('payment_proof'),
  orderController.uploadPaymentProof
);

// Cancel unpaid order and restore stock
router.post('/:orderNumber/cancel', authenticateToken, orderController.cancelOrder);

module.exports = router;
