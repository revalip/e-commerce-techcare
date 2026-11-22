const path = require('path');
const fs = require('fs');
const { pool } = require('../config/db');
const { sanitizeText, isValidEmail, isPositiveInt } = require('../middleware/security');
const { proofsDir, verifyImageMagicBytes, safeUnlink } = require('../middleware/upload');

const SHIPPING_ZONES = [
  { id: 'jabodetabek', label: 'Jabodetabek', multiplier: 1.0 },
  { id: 'jabar_banten', label: 'Jawa Barat & Banten', multiplier: 1.35 },
  { id: 'jateng_diy', label: 'Jawa Tengah & DIY', multiplier: 1.65 },
  { id: 'jatim', label: 'Jawa Timur', multiplier: 1.85 },
  { id: 'sumatera', label: 'Sumatera', multiplier: 2.5 },
  { id: 'bali_nusra', label: 'Bali & Nusa Tenggara', multiplier: 2.6 },
  { id: 'kalimantan', label: 'Kalimantan', multiplier: 3.1 },
  { id: 'sulawesi_papua', label: 'Sulawesi, Maluku & Papua', multiplier: 3.8 }
];

const COURIERS = [
  { id: 'jne_reg', label: 'JNE Reguler + Asuransi', baseRatePerKg: 12000 },
  { id: 'jne_yes', label: 'JNE YES + Packing Kayu Prioritas', baseRatePerKg: 24000 },
  { id: 'jnt_ez', label: 'J&T Express EZ', baseRatePerKg: 13000 },
  { id: 'sicepat_best', label: 'SiCepat BEST (Besok Sampai Tujuan)', baseRatePerKg: 16000 },
  { id: 'workshop', label: 'Ambil & Gratis Pasang di Workshop TECHCARE', baseRatePerKg: 0 }
];

const FREE_SHIPPING_THRESHOLD = 5000000;

const SERVER_COUPONS = [
  { code: 'TECHCARE10', type: 'percent', value: 10, minSpend: 500000, maxDiscount: 300000, expiresAt: '2026-12-31' },
  { code: 'UPGRADERAM', type: 'nominal', value: 50000, minSpend: 300000, maxDiscount: 50000, expiresAt: '2026-12-31' },
  { code: 'LAPTOP250K', type: 'nominal', value: 250000, minSpend: 5000000, maxDiscount: 250000, expiresAt: '2026-12-31' }
];

function resolveZone(rawZone) {
  const norm = String(rawZone || '').trim().toLowerCase();
  return (
    SHIPPING_ZONES.find(
      (z) => z.id === norm || z.label.toLowerCase() === norm || norm.startsWith(z.label.toLowerCase())
    ) || SHIPPING_ZONES[0]
  );
}

function resolveCourier(rawCourier) {
  const norm = String(rawCourier || '').trim().toLowerCase();
  if (norm === 'workshop' || norm.includes('workshop') || norm.includes('pickup')) return COURIERS[4];
  if (norm === 'jne_yes' || norm.includes('jne yes')) return COURIERS[1];
  if (norm === 'jnt_ez' || norm.includes('j&t') || norm.includes('jnt')) return COURIERS[2];
  if (norm === 'sicepat_best' || norm.includes('sicepat')) return COURIERS[3];
  return COURIERS[0];
}

function calculateServerShipping({ rawCourier, rawZone, totalWeightGram, subtotal }) {
  const courier = resolveCourier(rawCourier);
  const zone = resolveZone(rawZone);
  const weightKg = Math.max(1, Math.ceil((Number(totalWeightGram) || 500) / 1000));

  if (courier.id === 'workshop' || courier.baseRatePerKg === 0) {
    return { cost: 0, courierLabel: courier.label, zoneLabel: zone.label };
  }

  const rawRate = Math.round((courier.baseRatePerKg * zone.multiplier) / 1000) * 1000;
  const originalCost = rawRate * weightKg;
  const eligibleFree =
    subtotal >= FREE_SHIPPING_THRESHOLD &&
    zone.id === 'jabodetabek' &&
    (courier.id === 'jne_reg' || courier.id === 'jnt_ez');

  return {
    cost: eligibleFree ? 0 : originalCost,
    courierLabel: eligibleFree ? `${courier.label} (Gratis Ongkir)` : courier.label,
    zoneLabel: zone.label
  };
}

function calculateServerDiscount(rawCode, subtotal) {
  const code = String(rawCode || '').trim().toUpperCase();
  if (!code) return 0;
  const coupon = SERVER_COUPONS.find((c) => c.code === code);
  if (!coupon) return 0;
  if (coupon.expiresAt) {
    const expiry = new Date(`${coupon.expiresAt}T23:59:59+07:00`);
    if (!Number.isNaN(expiry.getTime()) && Date.now() > expiry.getTime()) return 0;
  }
  if (subtotal < coupon.minSpend) return 0;
  const raw =
    coupon.type === 'percent'
      ? Math.min(Math.round((subtotal * coupon.value) / 100), coupon.maxDiscount || Infinity)
      : coupon.value;
  return Math.max(0, Math.min(raw, subtotal));
}

function canAccessOrder(order, req, guestEmail) {
  const isAdmin = Boolean(req.user && req.user.role === 'admin');
  if (isAdmin) return true;

  // Jika pesanan milik akun terdaftar (user_id != null), WAJIB login sebagai pemilik akun tersebut (tidak boleh bypass lewat email tamu)
  if (order.user_id !== null && order.user_id !== undefined) {
    return Boolean(req.user && Number(req.user.id) === Number(order.user_id));
  }

  // Pesanan tamu (user_id == null): verifikasi email tamu
  const normalizedGuest = sanitizeText(guestEmail, 190).toLowerCase();
  return Boolean(normalizedGuest && normalizedGuest === (order.customer_email || '').toLowerCase());
}

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
    const rawShippingZone = sanitizeText(req.body.shipping_zone_id || req.body.shipping_zone, 100) || 'jabodetabek';
    const rawCourier = sanitizeText(req.body.courier_id || req.body.courier, 100) || 'jne_reg';
    const rawCouponCode = sanitizeText(req.body.coupon_code || req.body.discount_code || req.body.kode_diskon, 40);
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

    if (items.length > 30) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Maksimal 30 item berbeda dalam satu pesanan.'
      });
    }

    // Agregasi kuantitas per product_id agar item duplikat tidak melewati batas stok/kuantitas
    const aggregatedMap = new Map();
    for (const item of items) {
      const productId = Number(item.id);
      const qty = Number(item.quantity);
      if (!isPositiveInt(productId, 1000000000) || !isPositiveInt(qty, 50)) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Produk atau jumlah tidak valid (jumlah harus bilangan bulat positif 1–50).'
        });
      }
      const nextQty = (aggregatedMap.get(productId) || 0) + qty;
      if (nextQty > 50) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Total jumlah per produk maksimal 50 unit dalam satu pesanan.'
        });
      }
      aggregatedMap.set(productId, nextQty);
    }

    // Lock baris produk secara terurut berdasarkan ID untuk mencegah deadlock
    const sortedProductIds = Array.from(aggregatedMap.keys()).sort((a, b) => a - b);

    let subtotal = 0;
    let totalWeightGram = 0;
    const validatedItems = [];

    for (const productId of sortedProductIds) {
      const qty = aggregatedMap.get(productId);
      const [productRows] = await connection.query(
        'SELECT id, name, price, stock, weight_gram FROM products WHERE id = ? AND is_active = TRUE FOR UPDATE',
        [productId]
      );

      if (productRows.length === 0) {
        await connection.rollback();
        return res.status(400).json({ success: false, message: `Produk ID #${productId} tidak tersedia.` });
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

    // Hitung diskon & ongkir 100% di server (abaikan angka arbitrary dari client)
    const safeDiscount = calculateServerDiscount(rawCouponCode, subtotal);
    const shippingCalc = calculateServerShipping({
      rawCourier,
      rawZone: rawShippingZone,
      totalWeightGram,
      subtotal
    });
    const shipping_cost = shippingCalc.cost;
    const courier = shippingCalc.courierLabel;
    const shipping_zone = shippingCalc.zoneLabel;

    const unique_code = Math.floor(101 + Math.random() * 898);
    const total_amount = Math.max(0, subtotal - safeDiscount) + shipping_cost + unique_code;
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
        subtotal,
        discount_amount: safeDiscount,
        shipping_cost,
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

    if (!canAccessOrder(order, req, req.query.email)) {
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
    if (order.payment_proof_url) {
      order.payment_proof_url = `/api/orders/${encodeURIComponent(order.order_number)}/payment-proof`;
    }
    return res.json({ success: true, order });
  } catch (error) {
    console.error('getOrderByNumber error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat pesanan.' });
  }
};

exports.getPaymentProof = async (req, res) => {
  try {
    const orderNumber = sanitizeText(req.params.orderNumber, 60);
    const [orders] = await pool.query(
      'SELECT id, order_number, user_id, customer_email, payment_proof_url FROM orders WHERE order_number = ?',
      [orderNumber]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    const order = orders[0];
    if (!canAccessOrder(order, req, req.query.email)) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak: Anda tidak memiliki izin melihat bukti pembayaran ini.'
      });
    }

    if (!order.payment_proof_url) {
      return res.status(404).json({ success: false, message: 'Bukti pembayaran belum diunggah.' });
    }

    const safeFileName = path.basename(order.payment_proof_url);
    const absolutePath = path.join(proofsDir, safeFileName);
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ success: false, message: 'File bukti pembayaran tidak ditemukan.' });
    }

    return res.sendFile(absolutePath);
  } catch (error) {
    console.error('getPaymentProof error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat bukti pembayaran.' });
  }
};

exports.uploadPaymentProof = async (req, res) => {
  const uploadedPath = req.file ? req.file.path : null;
  try {
    const orderNumber = sanitizeText(req.params.orderNumber, 60);
    const notes = sanitizeText(req.body.notes, 250) || null;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'File bukti transfer wajib diunggah.' });
    }

    if (!verifyImageMagicBytes(uploadedPath)) {
      safeUnlink(uploadedPath);
      return res.status(400).json({
        success: false,
        message: 'Isi file bukan gambar yang valid (JPG, PNG, WEBP, atau GIF).'
      });
    }

    const [orders] = await pool.query(
      'SELECT id, user_id, customer_email, payment_status, order_status, payment_proof_url FROM orders WHERE order_number = ?',
      [orderNumber]
    );
    if (orders.length === 0) {
      safeUnlink(uploadedPath);
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    const order = orders[0];
    if (!canAccessOrder(order, req, req.body.email)) {
      safeUnlink(uploadedPath);
      return res.status(403).json({ success: false, message: 'Akses ditolak untuk mengunggah bukti pesanan ini.' });
    }

    if (order.order_status !== 'pending' || order.payment_status === 'paid') {
      safeUnlink(uploadedPath);
      return res.status(400).json({
        success: false,
        message: 'Bukti pembayaran hanya dapat diunggah untuk pesanan yang masih menunggu pembayaran.'
      });
    }

    const storedProofPath = `/uploads/proofs/${req.file.filename}`;

    await pool.query(
      `
      UPDATE orders
      SET payment_proof_url = ?, payment_notes = ?, payment_status = 'awaiting_verification', updated_at = NOW()
      WHERE order_number = ?
    `,
      [storedProofPath, notes, orderNumber]
    );

    // Bersihkan file bukti lama jika ada penggantian
    if (order.payment_proof_url) {
      const prevFileName = path.basename(order.payment_proof_url);
      if (prevFileName && prevFileName !== req.file.filename) {
        safeUnlink(path.join(proofsDir, prevFileName));
      }
    }

    return res.json({
      success: true,
      message: 'Bukti transfer berhasil diunggah! Admin akan segera memverifikasi pembayaran Anda.',
      payment_proof_url: `/api/orders/${encodeURIComponent(orderNumber)}/payment-proof`,
      payment_status: 'awaiting_verification'
    });
  } catch (error) {
    safeUnlink(uploadedPath);
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
    if (
      order.order_status !== 'pending' ||
      order.payment_status === 'awaiting_verification' ||
      order.payment_status === 'paid'
    ) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Hanya pesanan yang belum dibayar dan belum diverifikasi yang dapat dibatalkan.'
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
      SELECT o.*, COALESCE(SUM(oi.quantity), 0) AS total_items
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
