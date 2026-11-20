const { pool } = require('../config/db');
const { sanitizeText, isValidEmail, isPositiveInt } = require('../middleware/security');

function generateOrderNumber() {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomStr = Math.floor(1000 + Math.random() * 9000);
  return `TC-${dateStr}-${randomStr}`;
}

exports.createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const customer_name = sanitizeText(req.body.customer_name, 150);
    const customer_email = sanitizeText(req.body.customer_email, 190).toLowerCase();
    const customer_phone = sanitizeText(req.body.customer_phone, 35);
    const shipping_address = sanitizeText(req.body.shipping_address, 350);
    const shipping_city = sanitizeText(req.body.shipping_city, 100);
    const shipping_postal_code = sanitizeText(req.body.shipping_postal_code, 20) || null;
    const shipping_notes = sanitizeText(req.body.shipping_notes, 250) || null;
    const shipping_zone = sanitizeText(req.body.shipping_zone, 100) || 'Jabodetabek';
    const courier = sanitizeText(req.body.courier, 100) || 'JNE Reguler + Asuransi';
    const shipping_cost = Math.max(0, Number(req.body.shipping_cost) || 0);
    const discount_amount = Math.max(0, Number(req.body.discount_amount) || 0);
    const { payment_method, items } = req.body;

    const userId = req.user ? req.user.id : null;

    if (!customer_name || !isValidEmail(customer_email) || !customer_phone || !shipping_address || !shipping_city) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Mohon lengkapi data kontak valid dan alamat pengiriman.'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Keranjang belanja Anda kosong.' });
    }

    let subtotal = 0;
    let totalWeightGram = 0;
    const validatedItems = [];

    for (const item of items) {
      const qty = Number(item.quantity);
      if (!isPositiveInt(qty, 50)) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Jumlah produk tidak valid (harus bilangan bulat positif 1–50).'
        });
      }

      const [productRows] = await connection.query(
        'SELECT id, name, price, stock, weight_gram FROM products WHERE id = ? AND is_active = TRUE FOR UPDATE',
        [item.id]
      );

      if (productRows.length === 0) {
        await connection.rollback();
        return res.status(400).json({ success: false, message: `Produk ID #${item.id} tidak tersedia.` });
      }

      const product = productRows[0];
      if (product.stock < qty) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Stok produk "${product.name}" tidak mencukupi (tersedia: ${product.stock}, diminta: ${qty}).`
        });
      }

      const itemSubtotal = Number(product.price) * qty;
      subtotal += itemSubtotal;
      totalWeightGram += (Number(product.weight_gram) || 1000) * qty;

      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        quantity: qty,
        subtotal: itemSubtotal
      });

      await connection.query('UPDATE products SET stock = stock - ? WHERE id = ?', [qty, product.id]);
    }

    const safeDiscount = Math.min(discount_amount, subtotal);
    const unique_code = Math.floor(101 + Math.random() * 898);
    const total_amount = Math.max(0, subtotal - safeDiscount + shipping_cost) + unique_code;
    const order_number = generateOrderNumber();
    const chosenMethod = payment_method === 'qris' ? 'qris' : 'bank_transfer';
    const payment_deadline = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const [orderResult] = await connection.query(
      `
      INSERT INTO orders (
        order_number, user_id, customer_name, customer_email, customer_phone,
        shipping_address, shipping_city, shipping_postal_code, shipping_zone, shipping_notes,
        courier, total_weight_gram, subtotal, discount_amount, shipping_cost, unique_code,
        total_amount, payment_method, payment_status, order_status, payment_deadline
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', ?)
    `,
      [
        order_number,
        userId,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        shipping_city,
        shipping_postal_code,
        shipping_zone,
        shipping_notes,
        courier,
        totalWeightGram,
        subtotal,
        safeDiscount,
        shipping_cost,
        unique_code,
        total_amount,
        chosenMethod,
        payment_deadline
      ]
    );

    const orderId = orderResult.insertId;

    for (const item of validatedItems) {
      await connection.query(
        `
        INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, subtotal)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
        [orderId, item.product_id, item.product_name, item.product_price, item.quantity, item.subtotal]
      );
    }

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat!',
      order: {
        id: orderId,
        order_number,
        unique_code,
        total_amount,
        payment_deadline,
        payment_method: chosenMethod,
        payment_status: 'pending'
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('createOrder error:', error);
    return res.status(500).json({ success: false, message: 'Gagal membuat pesanan.' });
  } finally {
    connection.release();
  }
};

exports.getOrderByNumber = async (req, res) => {
  try {
    const orderNumber = sanitizeText(req.params.orderNumber, 60);

    const [orders] = await pool.query(
      `
      SELECT o.*, u.name AS user_account_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.order_number = ?
    `,
      [orderNumber]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    const order = orders[0];

    // Proteksi IDOR: cek kepemilikan (admin / pemilik order / kecocokan email tamu)
    const isAdmin = req.user && req.user.role === 'admin';
    const isOwner = req.user && order.user_id && Number(req.user.id) === Number(order.user_id);
    const queryEmail = sanitizeText(req.query.email, 190).toLowerCase();
    const matchesGuestEmail = queryEmail && queryEmail === (order.customer_email || '').toLowerCase();

    if (!isAdmin && !isOwner && !matchesGuestEmail) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak: Anda tidak memiliki izin melihat rincian pesanan ini.'
      });
    }

    const [items] = await pool.query(
      `
      SELECT oi.*, p.image_url, p.slug
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `,
      [order.id]
    );

    order.items = items;
    return res.json({ success: true, order });
  } catch (error) {
    console.error('getOrderByNumber error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat pesanan.' });
  }
};

exports.uploadPaymentProof = async (req, res) => {
  try {
    const orderNumber = sanitizeText(req.params.orderNumber, 60);
    const notes = sanitizeText(req.body.notes, 250) || null;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'File bukti transfer wajib diunggah.' });
    }

    const [orders] = await pool.query(
      'SELECT id, user_id, customer_email, payment_status FROM orders WHERE order_number = ?',
      [orderNumber]
    );
    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    const order = orders[0];
    const isAdmin = req.user && req.user.role === 'admin';
    const isOwner = req.user && order.user_id && Number(req.user.id) === Number(order.user_id);
    const bodyEmail = sanitizeText(req.body.email, 190).toLowerCase();
    if (!isAdmin && !isOwner && bodyEmail !== (order.customer_email || '').toLowerCase()) {
      return res.status(403).json({ success: false, message: 'Akses ditolak untuk mengunggah bukti pesanan ini.' });
    }

    const proofUrl = `/uploads/proofs/${req.file.filename}`;

    await pool.query(
      `
      UPDATE orders
      SET payment_proof_url = ?, payment_notes = ?, payment_status = 'awaiting_verification', updated_at = NOW()
      WHERE order_number = ?
    `,
      [proofUrl, notes, orderNumber]
    );

    return res.json({
      success: true,
      message: 'Bukti transfer berhasil diunggah! Admin akan segera memverifikasi pembayaran Anda.',
      payment_proof_url: proofUrl,
      payment_status: 'awaiting_verification'
    });
  } catch (error) {
    console.error('uploadPaymentProof error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengunggah bukti pembayaran.' });
  }
};

exports.cancelOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const orderNumber = sanitizeText(req.params.orderNumber, 60);

    const [orders] = await connection.query(
      'SELECT * FROM orders WHERE order_number = ? FOR UPDATE',
      [orderNumber]
    );
    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    const order = orders[0];
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && Number(order.user_id) !== Number(req.user.id)) {
      await connection.rollback();
      return res.status(403).json({ success: false, message: 'Akses ditolak.' });
    }
    if (order.order_status !== 'pending') {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Hanya pesanan berstatus Menunggu Bayar yang dapat dibatalkan.'
      });
    }

    const [items] = await connection.query('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [
      order.id
    ]);
    for (const item of items) {
      if (item.product_id) {
        await connection.query('UPDATE products SET stock = stock + ? WHERE id = ?', [
          item.quantity,
          item.product_id
        ]);
      }
    }

    await connection.query(
      "UPDATE orders SET order_status = 'cancelled', updated_at = NOW() WHERE id = ?",
      [order.id]
    );

    await connection.commit();
    return res.json({ success: true, message: 'Pesanan dibatalkan dan stok dikembalikan.' });
  } catch (error) {
    await connection.rollback();
    console.error('cancelOrder error:', error);
    return res.status(500).json({ success: false, message: 'Gagal membatalkan pesanan.' });
  } finally {
    connection.release();
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const [orders] = await pool.query(
      `
      SELECT o.*, COUNT(oi.id) AS total_items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `,
      [userId]
    );

    return res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('getMyOrders error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat daftar pesanan.' });
  }
};
