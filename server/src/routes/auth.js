const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { createRateLimiter } = require('../middleware/security');

const authLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 30 });

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
