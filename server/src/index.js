const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { checkDbConnection } = require('./config/db');
const { securityHeaders } = require('./middleware/security');

// Route handlers
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const settingRoutes = require('./routes/settings');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 4000;

// Security headers
app.use(securityHeaders);

// CORS whitelist dari CLIENT_URL (+ localhost dev ports hanya di non-production)
const configuredOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const devOrigins =
  process.env.NODE_ENV === 'production'
    ? []
    : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:4173', 'http://127.0.0.1:4173'];

const allowedOrigins = new Set([...configuredOrigins, ...devOrigins]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      const corsErr = new Error('Origin tidak diizinkan oleh kebijakan CORS.');
      corsErr.status = 403;
      return callback(corsErr);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Static asset folders — HANYA products & settings yang publik; /uploads/proofs diproteksi via endpoint order
app.use('/uploads/products', express.static(path.join(__dirname, '../uploads/products')));
app.use('/uploads/settings', express.static(path.join(__dirname, '../uploads/settings')));

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
    service: 'TECHCARE E-Commerce Backend API',
    mode: 'MySQL + Local Payments Simulation (QRIS / Bank Transfer)'
  });
});

// Fallback to client index.html for SPA routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexHtml = path.join(clientDist, 'index.html');
  if (fs.existsSync(indexHtml)) {
    return res.sendFile(indexHtml);
  }
  return res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan.' });
});

// Central error handler (hindari membocorkan stack trace ke client)
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.'
        : err.message
  });
});

if (require.main === module) {
  app.listen(PORT, async () => {
    console.log('===============================================');
    console.log(` TECHCARE Server running on http://localhost:${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('===============================================');

    const dbOk = await checkDbConnection();
    if (!dbOk) {
      console.warn(
        `[!] CATATAN: MySQL belum terhubung. Pastikan layanan MySQL berjalan di port ${
          process.env.DB_PORT || 3306
        } dan file .env sudah sesuai.`
      );
    }
  });
}

module.exports = app;
