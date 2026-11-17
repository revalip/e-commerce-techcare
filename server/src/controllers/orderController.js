const { pool } = require('../config/db');

// Helper to generate unique order number like NOV-261117-9482
function generateOrderNumber() {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomStr = Math.floor(1000 + Math.random() * 9000);
  return `NOV-${dateStr}-${randomStr}`;
}

exports.createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_postal_code,
      shipping_notes,
      courier,
      payment_method,
      items
    } = req.body;

    const userId = req.user ? req.user.id : null;

    if (!customer_name || !customer_email || !customer_phone || !shipping_address || !shipping_city) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Mohon lengkapi data kontak dan alamat pengiriman.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Keranjang belanja Anda kosong.' });
    }

    // Verify products & calculate subtotal from DB to avoid client-side tampering
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const [productRows] = await connection.query(
        'SELECT id, name, price, stock FROM products WHERE id = ? AND is_active = TRUE FOR UPDATE',
        [item.id]
      );

      if (productRows.length === 0) {
        await connection.rollback();
        return res.status(400).json({ success: false, message: `Produk ID #${item.id} tidak tersedia.` });
      }

      const product = productRows[0];
      const qty = parseInt(item.quantity) || 1;

      if (product.stock < qty) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Stok produk "${product.name}" tidak mencukupi (tersedia: ${product.stock}, diminta: ${qty}).`
        });
      }

      const itemSubtotal = Number(product.price) * qty;
      subtotal += itemSubtotal;

      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        quantity: qty,
        subtotal: itemSubtotal
      });

      // Deduct stock
      await connection.query('UPDATE products SET stock = stock - ? WHERE id = ?', [qty, product.id]);
    }

    const shipping_cost = 0; // Free shipping according to promo strip
    const total_amount = subtotal + shipping_cost;
    const order_number = generateOrderNumber();
    const chosenMethod = payment_method === 'qris' ? 'qris' : 'bank_transfer';

    const [orderResult] = await connection.query(`
      INSERT INTO orders (
        order_number, user_id, customer_name, customer_email, customer_phone,
        shipping_address, shipping_city, shipping_postal_code, shipping_notes,
        courier, subtotal, shipping_cost, total_amount, payment_method,
        payment_status, order_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')
    `, [
      order_number, userId, customer_name.trim(), customer_email.trim(), customer_phone.trim(),
      shipping_address.trim(), shipping_city.trim(), shipping_postal_code || null, shipping_notes || null,
      courier || 'JNE Reguler (Gratis Ongkir)', subtotal, shipping_cost, total_amount, chosenMethod
    ]);

    const orderId = orderResult.insertId;

    for (const item of validatedItems) {
      await connection.query(`
        INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, subtotal)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [orderId, item.product_id, item.product_name, item.product_price, item.quantity, item.subtotal]);
    }

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat!',
      order: {
        id: orderId,
        order_number,
        total_amount,
        payment_method: chosenMethod,
        payment_status: 'pending'
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('createOrder error:', error);
    return res.status(500).json({ success: false, message: 'Gagal membuat pesanan: ' + error.message });
  } finally {
    connection.release();
  }
};

exports.getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const [orders] = await pool.query(`
      SELECT o.*, u.name as user_account_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.order_number = ?
    `, [orderNumber]);

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    const order = orders[0];

    const [items] = await pool.query(`
      SELECT oi.*, p.image_url, p.slug
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [order.id]);

    order.items = items;

    return res.json({ success: true, order });
  } catch (error) {
    console.error('getOrderByNumber error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat pesanan: ' + error.message });
  }
};

exports.uploadPaymentProof = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { notes } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'File bukti transfer wajib diunggah.' });
    }

    const [orders] = await pool.query('SELECT id, payment_status FROM orders WHERE order_number = ?', [orderNumber]);
    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    const proofUrl = `/uploads/proofs/${req.file.filename}`;

    await pool.query(`
      UPDATE orders
      SET payment_proof_url = ?, payment_notes = ?, payment_status = 'awaiting_verification', updated_at = NOW()
      WHERE order_number = ?
    `, [proofUrl, notes || null, orderNumber]);

    return res.json({
      success: true,
      message: 'Bukti transfer berhasil diunggah! Admin akan segera memverifikasi pembayaran Anda.',
      payment_proof_url: proofUrl,
      payment_status: 'awaiting_verification'
    });
  } catch (error) {
    console.error('uploadPaymentProof error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengunggah bukti: ' + error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const [orders] = await pool.query(`
      SELECT o.*, COUNT(oi.id) as total_items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [userId]);

    return res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('getMyOrders error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat daftar pesanan: ' + error.message });
  }
};
