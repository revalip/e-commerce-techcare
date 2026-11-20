const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');
const { sanitizeText, isValidEmail } = require('../middleware/security');

exports.register = async (req, res) => {
  try {
    const name = sanitizeText(req.body.name, 120);
    const email = sanitizeText(req.body.email, 190).toLowerCase();
    const password = String(req.body.password || '').trim();
    const phone = sanitizeText(req.body.phone, 30) || null;
    const address = sanitizeText(req.body.address, 300) || null;
    const city = sanitizeText(req.body.city, 100) || null;

    if (!name || name.length < 2) {
      return res.status(400).json({ success: false, message: 'Nama lengkap minimal 2 karakter.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Format email tidak valid.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password minimal 6 karakter.' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar. Silakan login.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role, phone, address, city) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, password_hash, 'customer', phone, address, city]
    );

    const userId = result.insertId;
    const token = jwt.sign({ id: userId, email, name, role: 'customer' }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil!',
      token,
      user: { id: userId, name, email, role: 'customer', phone }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Gagal melakukan registrasi.' });
  }
};

exports.login = async (req, res) => {
  try {
    const email = sanitizeText(req.body.email, 190).toLowerCase();
    const password = String(req.body.password || '').trim();

    if (!isValidEmail(email) || !password) {
      return res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
    }

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login berhasil!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Gagal login ke server.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, phone, address, city, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    return res.json({ success: true, user: users[0] });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil profil pengguna.' });
  }
};
