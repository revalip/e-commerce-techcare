const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { checkDbConnection } = require('./config/db');

// Route handlers
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const settingRoutes = require('./routes/settings');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static asset folders
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// In production on aaPanel or local, also serve client/dist if present
const clientDist = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDist));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'NOVAIRE E-Commerce Backend API',
    mode: 'MySQL + Local Payments (QRIS / Bank Transfer)'
  });
});

// Fallback to client index.html for SPA routing (for aaPanel single-port mode)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexHtml = path.join(clientDist, 'index.html');
  if (require('fs').existsSync(indexHtml)) {
    return res.sendFile(indexHtml);
  }
  res.status(404).send('API endpoint not found.');
});

// Start server
app.listen(PORT, async () => {
  console.log(`===============================================`);
  console.log(` TECHCARE Server running on http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`===============================================`);

  const dbOk = await checkDbConnection();
  if (!dbOk) {
    console.warn(`[!] CATATAN: MySQL belum terhubung. Pastikan layanan MySQL berjalan di port ${process.env.DB_PORT || 3306} dan file .env sudah sesuai.`);
  }
});
