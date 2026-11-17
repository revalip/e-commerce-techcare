const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// All admin routes require admin role
router.use(requireAdmin);

// Dashboard overview stats
router.get('/overview', adminController.getOverview);

// Orders management
router.get('/orders', adminController.getOrders);
router.post('/orders/:id/verify', adminController.verifyPayment);
router.put('/orders/:id/status', adminController.updateOrderStatus);

// Products management
router.post('/products', upload.single('image'), adminController.createProduct);
router.put('/products/:id', upload.single('image'), adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

module.exports = router;
