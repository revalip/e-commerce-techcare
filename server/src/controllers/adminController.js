const { pool } = require('../config/db');

// Dashboard summary statistics
exports.getOverview = async (req, res) => {
  try {
    const [[revenueRow]] = await pool.query(
      "SELECT COALESCE(SUM(total_amount), 0) AS total_revenue FROM orders WHERE payment_status = 'paid'"
    );

    const [[ordersCountRow]] = await pool.query(
      "SELECT COUNT(*) AS total_orders FROM orders"
    );

    const [[awaitingVerifyRow]] = await pool.query(
      "SELECT COUNT(*) AS awaiting_count FROM orders WHERE payment_status = 'awaiting_verification'"
    );

    const [[productsCountRow]] = await pool.query(
      "SELECT COUNT(*) AS total_products, SUM(CASE WHEN stock <= 5 THEN 1 ELSE 0 END) AS low_stock_count FROM products WHERE is_active = TRUE"
    );

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
        lowStockProducts: Number(productsCountRow.low_stock_count || 0)
      },
      recentOrders
    });
  } catch (error) {
    console.error('getOverview error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat ringkasan admin: ' + error.message });
  }
};

// Orders listing for admin
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

    if (status) {
      query += ` AND o.order_status = ?`;
      params.push(status);
    }

    if (payment_status) {
      query += ` AND o.payment_status = ?`;
      params.push(payment_status);
    }

    if (search) {
      query += ` AND (o.order_number LIKE ? OR o.customer_name LIKE ? OR o.customer_email LIKE ? OR o.customer_phone LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` GROUP BY o.id ORDER BY o.created_at DESC`;

    const [orders] = await pool.query(query, params);

    return res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('admin getOrders error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat pesanan: ' + error.message });
  }
};

// Admin verify or reject manual payment
exports.verifyPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, notes } = req.body; // action: 'approve' | 'reject'

    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    if (action === 'approve') {
      await pool.query(`
        UPDATE orders
        SET payment_status = 'paid', order_status = 'processing', paid_at = NOW(),
            payment_notes = COALESCE(?, payment_notes), updated_at = NOW()
        WHERE id = ?
      `, [notes || 'Pembayaran telah diverifikasi oleh admin.', id]);

      return res.json({ success: true, message: 'Pembayaran disetujui! Status pesanan kini Diproses.' });
    } else if (action === 'reject') {
      await pool.query(`
        UPDATE orders
        SET payment_status = 'rejected', payment_notes = ?, updated_at = NOW()
        WHERE id = ?
      `, [notes || 'Bukti transfer tidak valid atau dana belum masuk.', id]);

      return res.json({ success: true, message: 'Pembayaran ditolak.' });
    } else {
      return res.status(400).json({ success: false, message: 'Aksi tidak valid (gunakan approve atau reject).' });
    }
  } catch (error) {
    console.error('verifyPayment error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memverifikasi pembayaran: ' + error.message });
  }
};

// Update order status or resi
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, courier, tracking_number } = req.body;

    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    const updates = [];
    const params = [];

    if (order_status) {
      updates.push('order_status = ?');
      params.push(order_status);
    }

    if (courier !== undefined) {
      updates.push('courier = ?');
      params.push(courier);
    }

    if (tracking_number !== undefined) {
      updates.push('tracking_number = ?');
      params.push(tracking_number);
      // Auto move status to 'shipped' if tracking number is added and status is still processing
      if (!order_status && orders[0].order_status === 'processing') {
        updates.push("order_status = 'shipped'");
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada perubahan data.' });
    }

    params.push(id);
    await pool.query(`UPDATE orders SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`, params);

    return res.json({ success: true, message: 'Status pesanan berhasil diperbarui.' });
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui status: ' + error.message });
  }
};

// Products Admin CRUD
exports.createProduct = async (req, res) => {
  try {
    const { name, tagline, description, price, stock, collection_id, color, is_bestseller } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Nama dan harga produk wajib diisi.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
    const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : '/images/products/novaire-air.png';

    const [result] = await pool.query(`
      INSERT INTO products (name, slug, tagline, description, price, stock, collection_id, image_url, color, is_bestseller, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)
    `, [
      name.trim(),
      slug,
      tagline || null,
      description || null,
      price,
      stock || 10,
      collection_id || null,
      imageUrl,
      color || 'Matte Silver',
      is_bestseller === 'true' || is_bestseller === true ? 1 : 0
    ]);

    return res.status(201).json({ success: true, message: 'Produk berhasil ditambahkan!', productId: result.insertId });
  } catch (error) {
    console.error('createProduct error:', error);
    return res.status(500).json({ success: false, message: 'Gagal membuat produk: ' + error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tagline, description, price, stock, collection_id, color, is_bestseller, is_active } = req.body;

    const updates = [];
    const params = [];

    if (name) { updates.push('name = ?'); params.push(name.trim()); }
    if (tagline !== undefined) { updates.push('tagline = ?'); params.push(tagline); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (price !== undefined) { updates.push('price = ?'); params.push(price); }
    if (stock !== undefined) { updates.push('stock = ?'); params.push(stock); }
    if (collection_id !== undefined) { updates.push('collection_id = ?'); params.push(collection_id || null); }
    if (color !== undefined) { updates.push('color = ?'); params.push(color); }
    if (is_bestseller !== undefined) { updates.push('is_bestseller = ?'); params.push(is_bestseller === 'true' || is_bestseller === true ? 1 : 0); }
    if (is_active !== undefined) { updates.push('is_active = ?'); params.push(is_active === 'true' || is_active === true ? 1 : 0); }

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
    return res.status(500).json({ success: false, message: 'Gagal mengedit produk: ' + error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE products SET is_active = FALSE WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Produk berhasil dinonaktifkan.' });
  } catch (error) {
    console.error('deleteProduct error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus produk: ' + error.message });
  }
};
