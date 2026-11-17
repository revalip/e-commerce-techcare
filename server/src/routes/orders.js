const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { optionalAuth, authenticateToken } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Create order (works for both guest and authenticated user)
router.post('/', optionalAuth, orderController.createOrder);

// Get order by unique order number (publicly accessible with order number, e.g. from checkout redirect)
router.get('/:orderNumber', orderController.getOrderByNumber);

// Upload payment proof for an order
router.post('/:orderNumber/payment-proof', upload.single('payment_proof'), orderController.uploadPaymentProof);

// List logged-in user's orders
router.get('/my/all', authenticateToken, orderController.getMyOrders);

module.exports = router;
