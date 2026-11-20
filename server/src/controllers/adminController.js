const { pool } = require('../config/db');
const { sanitizeText } = require('../middleware/security');

const ALLOWED_ORDER_STATUSES = ['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'];

exports.getOverview = async (req, res) => {
  try {
    const [[revenueRow]] = await pool.query(
      "SELECT COALESCE(SUM(total_amount), 0) AS total_revenue FROM orders WHERE payment_status = 'paid' AND order_status <> 'cancelled'"
    );
    const [[ordersCountRow]] = await pool.query('SELECT COUNT(*) AS total_orders FROM orders');
    const [[awaitingVerifyRow]] = await pool.query(
      "SELECT COUNT(*) AS awaiting_count FROM orders WHERE payment_status = 'awaiting_verification'"
    );
    const [[productsCountRow]] = await pool.query(
      'SELECT COUNT(*) AS total_products, SUM(CASE WHEN stock <= 5 THEN 1 ELSE 0 END) AS low_stock_count FROM products WHERE is_active = TRUE'
    );
    const [[usersCountRow]] = await pool.query('SELECT COUNT(*) AS total_users FROM users');

    const [recentOrders] = await pool.query(`
      SELECT o.id, o.order_number, o.customer_name, o.customer_phone, o.total_amount,
             o.payment_method, o.payment_status, o.order_status, o.created_at, o.payment_proof_url
      FROM orders o
      ORDER BY o.created_at DESC
      LIMIT 6
    `);

    return res.json({
      success: true,
      stats: {
        totalRevenue: Number(revenueRow.total_revenue || 0),
        totalOrders: Number(ordersCountRow.total_orders || 0),
        awaitingVerification: Number(awaitingVerifyRow.awaiting_count || 0),
        totalProducts: Number(productsCountRow.total_products || 0),
        lowStockProducts: Number(productsCountRow.low_stock_count || 0),
        totalUsers: Number(usersCountRow.total_users || 0)
      },
      recentOrders
    });
  } catch (error) {
    console.error('getOverview error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat ringkasan admin.' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { status, payment_status, search } = req.query;

    let query = `
      SELECT o.*, COUNT(oi.id) AS total_items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE 1=1
    `;
    const params = [];

    if (status && ALLOWED_ORDER_STATUSES.includes(status)) {
      query += ' AND o.order_status = ?';
      params.push(status);
    }

    if (payment_status) {
      query += ' AND o.payment_status = ?';
      params.push(payment_status);
    }

    if (search) {
      const q = `%${sanitizeText(search, 80)}%`;
      query +=
        ' AND (o.order_number LIKE ? OR o.customer_name LIKE ? OR o.customer_email LIKE ? OR o.tracking_number LIKE ?)';
      params.push(q, q, q, q);
    }

    query += ' GROUP BY o.id ORDER BY o.created_at DESC';

    const [orders] = await pool.query(query, params);
    return res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('admin getOrders error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat daftar pesanan.' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    const notes = sanitizeText(req.body.notes, 250) || null;

    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    if (action === 'approve') {
      await pool.query(
        `
        UPDATE orders
        SET payment_status = 'paid', order_status = 'paid', paid_at = NOW(),
            payment_notes = COALESCE(?, payment_notes), updated_at = NOW()
        WHERE id = ?
      `,
        [notes || 'Pembayaran telah diverifikasi oleh admin.', id]
      );
      return res.json({ success: true, message: 'Pembayaran disetujui! Status pesanan kini Dibayar.' });
    }
    if (action === 'reject') {
      await pool.query(
        `
        UPDATE orders
        SET payment_status = 'rejected', payment_notes = ?, updated_at = NOW()
        WHERE id = ?
      `,
        [notes || 'Bukti transfer tidak valid atau dana belum masuk.', id]
      );
      return res.json({ success: true, message: 'Pembayaran ditolak.' });
    }

    return res.status(400).json({ success: false, message: 'Aksi tidak valid (gunakan approve atau reject).' });
  } catch (error) {
    console.error('verifyPayment error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memverifikasi pembayaran.' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { id } = req.params;
    const { order_status } = req.body;
    const courier = req.body.courier !== undefined ? sanitizeText(req.body.courier, 100) : undefined;
    const tracking_number =
      req.body.tracking_number !== undefined ? sanitizeText(req.body.tracking_number, 80) : undefined;

    if (order_status && !ALLOWED_ORDER_STATUSES.includes(order_status)) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Status pesanan tidak valid.' });
    }

    const [orders] = await connection.query('SELECT * FROM orders WHERE id = ? FOR UPDATE', [id]);
    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    const currentOrder = orders[0];
    const updates = [];
    const params = [];

    if (order_status) {
      updates.push('order_status = ?');
      params.push(order_status);

      // Kembalikan stok bila status berubah ke cancelled
      if (order_status === 'cancelled' && currentOrder.order_status !== 'cancelled') {
        const [items] = await connection.query('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [
          currentOrder.id
        ]);
        for (const item of items) {
          if (item.product_id) {
            await connection.query('UPDATE products SET stock = stock + ? WHERE id = ?', [
              item.quantity,
              item.product_id
            ]);
          }
        }
      }
    }

    if (courier !== undefined) {
      updates.push('courier = ?');
      params.push(courier);
    }

    if (tracking_number !== undefined) {
      updates.push('tracking_number = ?');
      params.push(tracking_number);
      if (!order_status && (currentOrder.order_status === 'processing' || currentOrder.order_status === 'paid')) {
        updates.push("order_status = 'shipped'");
      }
    }

    if (updates.length === 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Tidak ada perubahan data.' });
    }

    params.push(id);
    await connection.query(`UPDATE orders SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`, params);
    await connection.commit();

    return res.json({ success: true, message: 'Status pesanan berhasil diperbarui.' });
  } catch (error) {
    await connection.rollback();
    console.error('updateOrderStatus error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui status pesanan.' });
  } finally {
    connection.release();
  }
};

// Products Admin CRUD
exports.createProduct = async (req, res) => {
  try {
    const name = sanitizeText(req.body.name, 150);
    const brand = sanitizeText(req.body.brand, 60) || 'TECHCARE';
    const tagline = sanitizeText(req.body.tagline, 150) || null;
    const description = sanitizeText(req.body.description, 1000) || null;
    const price = Number(req.body.price);
    const stock = Math.max(0, Number(req.body.stock) || 10);
    const weight_gram = Math.max(50, Number(req.body.weight_gram) || 1000);
    const collection_id = req.body.collection_id ? Number(req.body.collection_id) : null;
    const color = sanitizeText(req.body.color, 80) || 'Matte Black';
    const is_bestseller = req.body.is_bestseller === 'true' || req.body.is_bestseller === true ? 1 : 0;

    if (!name || Number.isNaN(price) || price <= 0) {
      return res.status(400).json({ success: false, message: 'Nama dan harga valid produk wajib diisi.' });
    }

    const slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
      '-' +
      Date.now().toString().slice(-4);
    const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : '/images/products/thinkpad-x1-carbon-front.jpg';

    const [result] = await pool.query(
      `
      INSERT INTO products (brand, name, slug, tagline, description, price, stock, weight_gram, collection_id, image_url, color, is_bestseller, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)
    `,
      [brand, name, slug, tagline, description, price, stock, weight_gram, collection_id, imageUrl, color, is_bestseller]
    );

    return res.status(201).json({ success: true, message: 'Produk berhasil ditambahkan!', productId: result.insertId });
  } catch (error) {
    console.error('createProduct error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan produk.' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = [];
    const params = [];

    if (req.body.name) { updates.push('name = ?'); params.push(sanitizeText(req.body.name, 150)); }
    if (req.body.brand !== undefined) { updates.push('brand = ?'); params.push(sanitizeText(req.body.brand, 60)); }
    if (req.body.tagline !== undefined) { updates.push('tagline = ?'); params.push(sanitizeText(req.body.tagline, 150)); }
    if (req.body.description !== undefined) { updates.push('description = ?'); params.push(sanitizeText(req.body.description, 1000)); }
    if (req.body.price !== undefined) { updates.push('price = ?'); params.push(Math.max(1000, Number(req.body.price))); }
    if (req.body.stock !== undefined) { updates.push('stock = ?'); params.push(Math.max(0, Number(req.body.stock))); }
    if (req.body.weight_gram !== undefined) { updates.push('weight_gram = ?'); params.push(Math.max(50, Number(req.body.weight_gram))); }
    if (req.body.collection_id !== undefined) { updates.push('collection_id = ?'); params.push(req.body.collection_id || null); }
    if (req.body.color !== undefined) { updates.push('color = ?'); params.push(sanitizeText(req.body.color, 80)); }
    if (req.body.is_bestseller !== undefined) {
      updates.push('is_bestseller = ?');
      params.push(req.body.is_bestseller === 'true' || req.body.is_bestseller === true ? 1 : 0);
    }
    if (req.body.is_active !== undefined) {
      updates.push('is_active = ?');
      params.push(req.body.is_active === 'true' || req.body.is_active === true ? 1 : 0);
    }
    if (req.file) {
      updates.push('image_url = ?');
      params.push(`/uploads/products/${req.file.filename}`);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada data produk yang diubah.' });
    }

    params.push(id);
    await pool.query(`UPDATE products SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`, params);
    return res.json({ success: true, message: 'Produk berhasil diperbarui.' });
  } catch (error) {
    console.error('updateProduct error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui produk.' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE products SET is_active = FALSE WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Produk berhasil dinonaktifkan.' });
  } catch (error) {
    console.error('deleteProduct error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus produk.' });
  }
};

// Categories / Collections Admin CRUD
exports.createCollection = async (req, res) => {
  try {
    const name = sanitizeText(req.body.name, 100);
    const tagline = sanitizeText(req.body.tagline, 150) || null;
    const description = sanitizeText(req.body.description, 400) || null;
    const image_url = sanitizeText(req.body.image_url, 255) || null;
    if (!name) return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi.' });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const [result] = await pool.query(
      'INSERT INTO collections (name, slug, tagline, description, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, slug, tagline, description, image_url]
    );
    return res.status(201).json({ success: true, id: result.insertId, message: 'Kategori berhasil dibuat.' });
  } catch (error) {
    console.error('createCollection error:', error);
    return res.status(500).json({ success: false, message: 'Gagal membuat kategori.' });
  }
};

exports.updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const name = sanitizeText(req.body.name, 100);
    const tagline = sanitizeText(req.body.tagline, 150);
    if (!name) return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi.' });

    await pool.query('UPDATE collections SET name = ?, tagline = ? WHERE id = ?', [name, tagline || null, id]);
    return res.json({ success: true, message: 'Kategori berhasil diperbarui.' });
  } catch (error) {
    console.error('updateCollection error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui kategori.' });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM collections WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Kategori berhasil dihapus.' });
  } catch (error) {
    console.error('deleteCollection error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus kategori.' });
  }
};

// Users & Roles Admin Management
exports.getUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, phone, city, created_at FROM users ORDER BY created_at DESC'
    );
    return res.json({ success: true, count: users.length, users });
  } catch (error) {
    console.error('getUsers error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat daftar pengguna.' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['admin', 'customer'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role tidak valid (gunakan admin atau customer).' });
    }
    if (Number(id) === Number(req.user.id)) {
      return res.status(400).json({ success: false, message: 'Tidak dapat mengubah role akun sendiri.' });
    }

    await pool.query('UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?', [role, id]);
    return res.json({ success: true, message: 'Role pengguna berhasil diperbarui.' });
  } catch (error) {
    console.error('updateUserRole error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui role pengguna.' });
  }
};
