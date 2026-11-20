const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { optionalAuth, authenticateToken } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Static route first
router.get('/my/all', authenticateToken, orderController.getMyOrders);

// Create order
router.post('/', optionalAuth, orderController.createOrder);

// Get order by unique order number (verifikasi kepemilikan user/admin atau email tamu)
router.get('/:orderNumber', optionalAuth, orderController.getOrderByNumber);

// Upload payment proof for an order
router.post(
  '/:orderNumber/payment-proof',
  optionalAuth,
  upload.single('payment_proof'),
  orderController.uploadPaymentProof
);

// Cancel unpaid order and restore stock
router.post('/:orderNumber/cancel', authenticateToken, orderController.cancelOrder);

module.exports = router;
