const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../config/db');

const ENV_JWT_SECRET = process.env.JWT_SECRET;
if (!ENV_JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('FATAL: Environment variable JWT_SECRET wajib diatur pada mode production!');
}

// Pada development tanpa .env, buat secret acak per-sesi agar tidak ada hardcoded secret di kode
const JWT_SECRET = ENV_JWT_SECRET || crypto.randomBytes(32).toString('hex');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak: Token autentikasi tidak ditemukan.'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token kedaluwarsa atau tidak valid.'
      });
    }
    req.user = user;
    next();
  });
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    req.user = err ? null : user;
    next();
  });
}

function requireAdmin(req, res, next) {
  authenticateToken(req, res, async () => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak: Hanya untuk Administrator.'
      });
    }
    try {
      const [rows] = await pool.query('SELECT role FROM users WHERE id = ? LIMIT 1', [req.user.id]);
      if (rows.length === 0 || rows[0].role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Akses ditolak: Hak akses Administrator tidak lagi aktif.'
        });
      }
      return next();
    } catch (error) {
      console.error('requireAdmin DB check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal memverifikasi hak akses Administrator.'
      });
    }
  });
}

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin,
  JWT_SECRET
};
