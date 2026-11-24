/**
 * ============================================================================
 * TECHCARE API SERVICE LAYER (DUAL-MODE: STANDALONE DEMO + FULL-STACK API)
 * ============================================================================
 * - Default (VITE_API_MODE=demo): Berjalan standalone di Netlify / Vercel
 *   dengan persistensi localStorage (cocok untuk demo kuliah gratis 100%).
 * - Full-stack (VITE_API_MODE=api): Menghubungkan endpoint Express + MySQL.
 */

import {
  mockProducts,
  mockCollections,
  mockDiscounts,
  mockOrders
} from '../data/mock';
import { sanitizeText } from '../utils/security';

const API_MODE = (import.meta.env.VITE_API_MODE || 'demo').toLowerCase();
const API_URL = import.meta.env.VITE_API_URL || '/api';

const delay = (min = 120, max = 240) => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Versioned storage keys (v12) memuat foto makro resmi Kingston FURY (front/rear 2K) & Foresee OEM SSD
const STORAGE_KEYS = {
  PRODUCTS: 'techcare_products_v12',
  COLLECTIONS: 'techcare_collections_v12',
  DISCOUNTS: 'techcare_discounts_v12',
  ORDERS: 'techcare_orders_v12'
};

function getStored(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setStored(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

function getAuthHeaders() {
  const token = localStorage.getItem('techcare_auth_token_v4');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const ORDER_STATUS_MAP = {
  pending: 'Menunggu Bayar',
  awaiting_verification: 'Menunggu Verifikasi',
  paid: 'Dibayar',
  processing: 'Dikemas & QC',
  shipped: 'Dikirim',
  completed: 'Selesai',
  cancelled: 'Dibatalkan'
};

// ============================================================================
// PRODUCTS & COLLECTIONS
// ============================================================================

export async function getProducts(filter = {}) {
  if (API_MODE === 'api') {
    try {
      const qs = new URLSearchParams();
      if (filter.koleksi) qs.set('collection', filter.koleksi);
      if (filter.search) qs.set('search', filter.search);
      if (filter.bestseller) qs.set('bestseller', 'true');
      const res = await fetch(`${API_URL}/products?${qs.toString()}`);
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, data: json.products, count: json.count };
      }
    } catch {
      // Fallback ke data lokal bila API tidak aktif
    }
  }

  await delay(140, 260);
  const products = getStored(STORAGE_KEYS.PRODUCTS, mockProducts);
  let filtered = [...products];

  if (filter.koleksi) {
    filtered = filtered.filter((p) => p.koleksiSlug === filter.koleksi);
  }

  if (filter.brand) {
    const targetBrand = filter.brand.toLowerCase();
    filtered = filtered.filter((p) => (p.brand || '').toLowerCase().includes(targetBrand));
  }

  if (filter.search) {
    const q = filter.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.nama.toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q) ||
        (p.tagline || '').toLowerCase().includes(q) ||
        (p.deskripsi || '').toLowerCase().includes(q) ||
        (p.koleksi || '').toLowerCase().includes(q)
    );
  }

  if (filter.bestseller) {
    filtered = filtered.filter((p) => p.isBestseller);
  }

  return { success: true, data: filtered, count: filtered.length };
}

export async function getProduct(slug) {
  await delay(120, 220);
  const products = getStored(STORAGE_KEYS.PRODUCTS, mockProducts);
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return { success: false, error: 'Produk tidak ditemukan.' };
  }
  return { success: true, data: product };
}

export async function getCollections() {
  await delay(100, 180);
  const collections = getStored(STORAGE_KEYS.COLLECTIONS, mockCollections);
  return { success: true, data: collections };
}

export async function createCollection(payload) {
  await delay(180, 300);
  const collections = getStored(STORAGE_KEYS.COLLECTIONS, mockCollections);
  const nama = sanitizeText(payload.nama, 80);
  if (!nama) {
    return { success: false, error: 'Nama kategori wajib diisi.' };
  }
  const slug =
    sanitizeText(payload.slug || nama, 80)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `cat-${Date.now()}`;

  if (collections.some((c) => c.slug === slug)) {
    return { success: false, error: 'Slug kategori sudah digunakan.' };
  }

  const newCol = {
    id: Date.now(),
    nama,
    slug,
    tagline: sanitizeText(payload.tagline, 150) || 'Perangkat IT pilihan bergaransi toko',
    gambar: payload.gambar || '/images/products/thinkpad-x1-carbon-front.jpg',
    buttonText: `LIHAT ${nama.toUpperCase()} →`
  };

  const updated = [...collections, newCol];
  setStored(STORAGE_KEYS.COLLECTIONS, updated);
  return { success: true, data: newCol, collections: updated };
}

export async function updateCollection(id, payload) {
  await delay(160, 260);
  const collections = getStored(STORAGE_KEYS.COLLECTIONS, mockCollections);
  const updated = collections.map((c) => {
    if (String(c.id) === String(id)) {
      const nama = payload.nama ? sanitizeText(payload.nama, 80) : c.nama;
      return {
        ...c,
        nama,
        tagline: payload.tagline !== undefined ? sanitizeText(payload.tagline, 150) : c.tagline,
        gambar: payload.gambar || c.gambar,
        buttonText: `LIHAT ${nama.toUpperCase()} →`
      };
    }
    return c;
  });
  setStored(STORAGE_KEYS.COLLECTIONS, updated);
  return { success: true, data: updated };
}

export async function deleteCollection(id) {
  await delay(160, 260);
  const collections = getStored(STORAGE_KEYS.COLLECTIONS, mockCollections);
  const updated = collections.filter((c) => String(c.id) !== String(id));
  setStored(STORAGE_KEYS.COLLECTIONS, updated);
  return { success: true, data: updated };
}

// ============================================================================
// DISCOUNTS / COUPONS
// ============================================================================

export async function getDiscounts() {
  await delay(120, 220);
  const discounts = getStored(STORAGE_KEYS.DISCOUNTS, mockDiscounts);
  return { success: true, data: discounts };
}

export async function validateDiscount(kode, subtotal = 0) {
  await delay(150, 260);
  const discounts = getStored(STORAGE_KEYS.DISCOUNTS, mockDiscounts);
  const normalized = sanitizeText(kode, 40).toUpperCase();
  const found = discounts.find((d) => d.kode === normalized && d.aktif);

  if (!found) {
    return { success: false, error: 'Kupon promo tidak valid atau sudah tidak aktif.' };
  }

  const today = new Date().toISOString().slice(0, 10);
  if (found.berlakuSampai && found.berlakuSampai < today) {
    return { success: false, error: 'Masa berlaku kupon promo ini sudah berakhir.' };
  }

  if (found.kuota && found.terpakai >= found.kuota) {
    return { success: false, error: 'Kuota kupon promo ini sudah habis.' };
  }

  if (subtotal < found.minBelanja) {
    return {
      success: false,
      error: `Minimal belanja untuk kupon ini Rp ${found.minBelanja.toLocaleString('id-ID')}.`
    };
  }

  let potong = 0;
  if (found.tipe === 'persen') {
    const pct = Math.min(100, Math.max(0, Number(found.nilai) || 0));
    potong = Math.round((subtotal * pct) / 100);
    if (found.maksDiskon > 0 && potong > found.maksDiskon) {
      potong = found.maksDiskon;
    }
  } else {
    potong = Math.max(0, Number(found.nilai) || 0);
  }
  potong = Math.min(potong, Math.max(0, Number(subtotal) || 0));

  return { success: true, data: { ...found, nominalDiskon: potong } };
}

export async function createDiscount(payload) {
  await delay(200, 320);
  const discounts = getStored(STORAGE_KEYS.DISCOUNTS, mockDiscounts);
  const kode = sanitizeText(payload.kode, 30).toUpperCase();

  if (!kode) {
    return { success: false, error: 'Kode kupon wajib diisi.' };
  }

  if (discounts.some((d) => d.kode === kode)) {
    return { success: false, error: 'Kode kupon sudah terdaftar.' };
  }

  const tipe = payload.tipe === 'nominal' ? 'nominal' : 'persen';
  const rawNilai = Number(payload.nilai);
  const nilai =
    tipe === 'persen'
      ? Math.min(100, Math.max(1, Number.isFinite(rawNilai) ? rawNilai : 10))
      : Math.max(1000, Number.isFinite(rawNilai) ? rawNilai : 10000);
  const rawMaks = Number(payload.maksDiskon);
  const maksDiskon = Number.isFinite(rawMaks) && rawMaks >= 0 ? rawMaks : 300000;

  const newDiscount = {
    id: Date.now(),
    kode,
    nama: sanitizeText(payload.nama, 100) || `Promo ${kode}`,
    tipe,
    nilai,
    minBelanja: Math.max(0, Number(payload.minBelanja) || 0),
    maksDiskon,
    aktif: true,
    kuota: Math.max(1, Number(payload.kuota) || 100),
    terpakai: 0,
    berlakuSampai: payload.berlakuSampai || '2026-12-31'
  };

  const updated = [newDiscount, ...discounts];
  setStored(STORAGE_KEYS.DISCOUNTS, updated);
  return { success: true, data: newDiscount, message: 'Kupon diskon berhasil dibuat!' };
}

export async function toggleDiscountStatus(id) {
  await delay(140, 240);
  const discounts = getStored(STORAGE_KEYS.DISCOUNTS, mockDiscounts);
  const updated = discounts.map((d) => (d.id === id ? { ...d, aktif: !d.aktif } : d));
  setStored(STORAGE_KEYS.DISCOUNTS, updated);
  return { success: true, data: updated };
}

// ============================================================================
// ORDERS, PAYMENT & EXPEDITION
// ============================================================================

export async function createOrder(payload) {
  if (API_MODE === 'api') {
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (res.ok && json.success) return { success: true, data: json.order };
      return { success: false, error: json.message || 'Gagal membuat pesanan.' };
    } catch {
      // Lanjutkan fallback lokal jika API offline
    }
  }

  await delay(280, 460);
  const orders = getStored(STORAGE_KEYS.ORDERS, mockOrders);
  const products = getStored(STORAGE_KEYS.PRODUCTS, mockProducts);

  // Validasi ketersediaan stok teragregasi per product.id sebelum mengurangi stok
  const qtyByProduct = new Map();
  for (const item of payload.items || []) {
    const qty = Math.max(1, parseInt(item.jumlah, 10) || 1);
    const key = String(item.id);
    qtyByProduct.set(key, (qtyByProduct.get(key) || 0) + qty);
  }
  for (const [prodId, totalQty] of qtyByProduct.entries()) {
    const prod = products.find((p) => String(p.id) === prodId);
    if (prod && Number(prod.stok) < totalQty) {
      return {
        success: false,
        error: `Stok "${prod.nama}" tidak mencukupi (tersedia ${prod.stok} unit, diminta ${totalQty} unit).`
      };
    }
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const nomorPesanan = `TC-${dateStr}-${randomNum}`;
  const now = new Date();
  const nowIso = now.toISOString();
  const paymentDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

  // Kode unik 3 digit (101 - 999) untuk verifikasi transfer lokal & QRIS
  const uniqueCode = Number(payload.uniqueCode) || Math.floor(101 + Math.random() * 898);

  const hasProof = Boolean(payload.paymentProofUrl);
  const initialPaymentStatus = hasProof ? 'awaiting_verification' : 'pending';
  const initialStatusKey = hasProof ? 'awaiting_verification' : 'pending';
  const initialStatusLabel = ORDER_STATUS_MAP[initialStatusKey];

  const initialHistory = [
    {
      waktu: nowIso,
      status: 'Pesanan Dibuat',
      lokasi: 'Online Store TECHCARE',
      keterangan: `Pesanan #${nomorPesanan} berhasil dibuat (${payload.metodeBayar || 'Transfer Bank (BCA)'}) dengan kode unik +Rp ${uniqueCode}. Batas bayar 24 jam.`
    }
  ];

  if (hasProof) {
    initialHistory.unshift({
      waktu: nowIso,
      status: 'Bukti Pembayaran Diunggah',
      lokasi: 'Online Store TECHCARE',
      keterangan:
        sanitizeText(payload.paymentNotes, 200) ||
        'Pembeli mengunggah bukti pembayaran saat checkout. Menunggu verifikasi Admin.'
    });
  }

  const safeCustomer = {
    nama: sanitizeText(payload.customer?.nama, 120),
    email: sanitizeText(payload.customer?.email, 190).toLowerCase(),
    telepon: sanitizeText(payload.customer?.telepon, 30),
    alamat: sanitizeText(payload.customer?.alamat, 300),
    kota: sanitizeText(payload.customer?.kota, 100),
    kodePos: sanitizeText(payload.customer?.kodePos, 15)
  };

  const subtotal = Math.max(0, Number(payload.subtotal) || 0);
  const diskon = Math.min(subtotal, Math.max(0, Number(payload.diskon) || 0));
  const ongkir = Math.max(0, Number(payload.ongkir) || 0);
  const totalWithUnique = Math.max(0, subtotal - diskon) + ongkir + uniqueCode;

  const newOrder = {
    id: `ord-${Date.now()}`,
    nomorPesanan,
    tanggal: nowIso,
    paymentDeadline,
    uniqueCode,
    userEmail: safeCustomer.email,
    customer: safeCustomer,
    items: payload.items,
    subtotal,
    diskon,
    kodeDiskon: payload.kodeDiskon || null,
    ongkir,
    total: totalWithUnique,
    totalWeightGram: Number(payload.totalWeightGram) || 1000,
    shippingZone: sanitizeText(payload.shippingZone, 100) || 'Jabodetabek',
    metodeBayar: payload.metodeBayar || 'Transfer Bank (BCA)',
    paymentMethodKey: payload.paymentMethodKey || 'bank_transfer',
    paymentStatus: initialPaymentStatus,
    paymentProofUrl: payload.paymentProofUrl || null,
    paymentNotes: sanitizeText(payload.paymentNotes, 250),
    kurir: payload.kurir || 'JNE Reguler + Asuransi',
    resi: null,
    status: initialStatusLabel,
    statusKey: initialStatusKey,
    trackingHistory: initialHistory
  };

  setStored(STORAGE_KEYS.ORDERS, [newOrder, ...orders]);

  // Kurangi stok produk yang dipesan secara otomatis
  const updatedProducts = products.map((p) => {
    const orderedQty = (payload.items || [])
      .filter((it) => String(it.id) === String(p.id))
      .reduce((sum, it) => sum + Math.max(1, Number(it.jumlah) || 1), 0);
    if (orderedQty > 0) {
      return { ...p, stok: Math.max(0, Number(p.stok) - orderedQty) };
    }
    return p;
  });
  setStored(STORAGE_KEYS.PRODUCTS, updatedProducts);

  // Tambah counter pemakaian kupon jika memakai kupon
  if (payload.kodeDiskon) {
    const discounts = getStored(STORAGE_KEYS.DISCOUNTS, mockDiscounts);
    const updatedDiscounts = discounts.map((d) =>
      d.kode === payload.kodeDiskon ? { ...d, terpakai: (Number(d.terpakai) || 0) + 1 } : d
    );
    setStored(STORAGE_KEYS.DISCOUNTS, updatedDiscounts);
  }

  return { success: true, data: newOrder, message: 'Pesanan berhasil dibuat!' };
}

export async function getOrders() {
  await delay(140, 260);
  const orders = getStored(STORAGE_KEYS.ORDERS, mockOrders);
  return { success: true, data: orders };
}

export async function getOrderByNumber(nomorPesanan) {
  await delay(120, 220);
  const orders = getStored(STORAGE_KEYS.ORDERS, mockOrders);
  const clean = sanitizeText(nomorPesanan, 60).toLowerCase();
  const order = orders.find(
    (o) =>
      o.nomorPesanan.toLowerCase() === clean ||
      (o.resi && o.resi.toLowerCase() === clean)
  );
  if (!order) {
    return {
      success: false,
      error: 'Pesanan tidak ditemukan. Periksa kembali nomor invoice atau nomor resi Anda.'
    };
  }
  return { success: true, data: order };
}

export async function uploadOrderPaymentProof(nomorPesanan, { proofUrl, notes = '' }) {
  await delay(220, 380);
  const orders = getStored(STORAGE_KEYS.ORDERS, mockOrders);
  const nowIso = new Date().toISOString();
  const cleanNotes = sanitizeText(notes, 250);
  let targetOrder = null;

  const updated = orders.map((o) => {
    if (o.nomorPesanan.toLowerCase() === (nomorPesanan || '').toLowerCase()) {
      const history = Array.isArray(o.trackingHistory) ? [...o.trackingHistory] : [];
      history.unshift({
        waktu: nowIso,
        status: 'Bukti Pembayaran Diunggah',
        lokasi: 'Online Store TECHCARE',
        keterangan: cleanNotes
          ? `Bukti pembayaran diterima (${cleanNotes}). Menunggu verifikasi Admin TECHCARE.`
          : 'Bukti pembayaran berhasil diunggah. Menunggu verifikasi Admin TECHCARE.'
      });

      targetOrder = {
        ...o,
        paymentProofUrl: proofUrl,
        paymentNotes: cleanNotes || o.paymentNotes,
        paymentStatus: 'awaiting_verification',
        statusKey: 'awaiting_verification',
        status: ORDER_STATUS_MAP.awaiting_verification,
        trackingHistory: history
      };
      return targetOrder;
    }
    return o;
  });

  if (!targetOrder) {
    return { success: false, error: 'Pesanan tidak ditemukan.' };
  }

  setStored(STORAGE_KEYS.ORDERS, updated);
  return { success: true, data: targetOrder, message: 'Bukti pembayaran berhasil dikirim!' };
}

/**
 * Helper internal: kembalikan stok jika pesanan dibatalkan
 */
function restoreStockForOrder(order) {
  if (!order || order.stockRestored) return;
  const products = getStored(STORAGE_KEYS.PRODUCTS, mockProducts);
  const restoredProducts = products.map((p) => {
    const qty = (order.items || [])
      .filter((it) => String(it.id) === String(p.id))
      .reduce((sum, it) => sum + Math.max(1, Number(it.jumlah) || 1), 0);
    if (qty > 0) {
      return { ...p, stok: Number(p.stok) + qty };
    }
    return p;
  });
  setStored(STORAGE_KEYS.PRODUCTS, restoredProducts);
}

/**
 * Admin: Verifikasi atau tolak pembayaran manual (QRIS / Transfer Bank)
 */
export async function verifyOrderPayment(orderId, action, notes = '') {
  await delay(200, 320);
  const orders = getStored(STORAGE_KEYS.ORDERS, mockOrders);
  const nowIso = new Date().toISOString();
  const cleanNotes = sanitizeText(notes, 250);
  let updatedOrder = null;

  const updated = orders.map((o) => {
    if (o.id === orderId || o.nomorPesanan === orderId) {
      const history = Array.isArray(o.trackingHistory) ? [...o.trackingHistory] : [];
      if (action === 'approve') {
        history.unshift({
          waktu: nowIso,
          status: 'Pembayaran Dikonfirmasi (Dibayar)',
          lokasi: 'Admin TECHCARE',
          keterangan:
            cleanNotes ||
            'Pembayaran valid sesuai kode unik. Pesanan lunas dan masuk antrean pengemasan & QC 32 titik teknisi.'
        });
        updatedOrder = {
          ...o,
          paymentStatus: 'paid',
          statusKey: 'paid',
          status: ORDER_STATUS_MAP.paid,
          paidAt: nowIso,
          paymentNotes: cleanNotes || 'Pembayaran terverifikasi oleh Admin TECHCARE.',
          trackingHistory: history
        };
      } else {
        history.unshift({
          waktu: nowIso,
          status: 'Bukti Pembayaran Perlu Diperbaiki',
          lokasi: 'Admin TECHCARE',
          keterangan:
            cleanNotes ||
            'Bukti transfer belum sesuai nominal/kode unik atau dana belum masuk. Mohon unggah ulang bukti yang jelas.'
        });
        updatedOrder = {
          ...o,
          paymentStatus: 'rejected',
          statusKey: 'pending',
          status: ORDER_STATUS_MAP.pending,
          paymentNotes: cleanNotes || 'Bukti pembayaran ditolak, mohon unggah ulang.',
          trackingHistory: history
        };
      }
      return updatedOrder;
    }
    return o;
  });

  setStored(STORAGE_KEYS.ORDERS, updated);
  return { success: true, data: updatedOrder, orders: updated };
}

const ALLOWED_ORDER_TRANSITIONS = {
  pending: ['awaiting_verification', 'paid', 'cancelled'],
  awaiting_verification: ['pending', 'paid', 'cancelled'],
  paid: ['processing', 'shipped', 'cancelled'],
  processing: ['shipped', 'completed'],
  shipped: ['completed'],
  completed: [],
  cancelled: []
};

/**
 * Helper internal: kembalikan kuota kupon bila pesanan dibatalkan
 */
function restoreDiscountForOrder(order) {
  if (!order?.kodeDiskon) return;
  const discounts = getStored(STORAGE_KEYS.DISCOUNTS, mockDiscounts);
  const updated = discounts.map((d) =>
    d.kode === order.kodeDiskon ? { ...d, terpakai: Math.max(0, (d.terpakai || 0) - 1) } : d
  );
  setStored(STORAGE_KEYS.DISCOUNTS, updated);
}

/**
 * Admin / Buyer: Update status pesanan, nomor resi, dan tambah checkpoint tracking
 */
export async function updateOrderStatus(
  orderId,
  statusKey,
  resi = null,
  trackingNote = null,
  trackingLocation = null
) {
  await delay(200, 340);
  const orders = getStored(STORAGE_KEYS.ORDERS, mockOrders);
  const existing = orders.find((o) => o.id === orderId || o.nomorPesanan === orderId);
  if (!existing) {
    return { success: false, error: 'Pesanan tidak ditemukan.' };
  }

  const currentKey = existing.statusKey || 'pending';
  const allowedNext = ALLOWED_ORDER_TRANSITIONS[currentKey] || [];
  if (statusKey !== currentKey && !allowedNext.includes(statusKey)) {
    return {
      success: false,
      error: `Status pesanan "${ORDER_STATUS_MAP[currentKey] || currentKey}" tidak dapat diubah ke "${ORDER_STATUS_MAP[statusKey] || statusKey}".`
    };
  }

  const nowIso = new Date().toISOString();
  const cleanResi = resi !== null ? sanitizeText(resi, 60).toUpperCase() : null;
  const cleanNote = trackingNote ? sanitizeText(trackingNote, 300) : null;
  const cleanLoc = trackingLocation ? sanitizeText(trackingLocation, 120) : null;

  const defaultTrackInfo = {
    pending: {
      title: 'Menunggu Pembayaran',
      lokasi: 'Sistem TECHCARE',
      ket: 'Menunggu konfirmasi pembayaran dari pembeli.'
    },
    awaiting_verification: {
      title: 'Menunggu Verifikasi Admin',
      lokasi: 'Sistem TECHCARE',
      ket: 'Bukti pembayaran sedang diperiksa oleh tim admin.'
    },
    paid: {
      title: 'Pembayaran Lunas (Dibayar)',
      lokasi: 'Admin TECHCARE',
      ket: 'Pembayaran telah dikonfirmasi lunas. Menunggu penyiapan unit.'
    },
    processing: {
      title: 'Dikemas & QC 32 Titik Teknisi',
      lokasi: 'Depok (Workshop TECHCARE)',
      ket: 'Teknisi sedang melakukan QC 32 titik, uji RAM/SSD, dan pengemasan aman.'
    },
    shipped: {
      title: 'Paket Dikirim via Ekspedisi',
      lokasi: 'Depok (Workshop TECHCARE)',
      ket: cleanResi
        ? `Paket telah diserahkan ke kurir dengan nomor resi ${cleanResi}.`
        : 'Paket telah diserahkan ke pihak ekspedisi.'
    },
    completed: {
      title: 'Pesanan Diterima & Selesai',
      lokasi: 'Alamat Penerima',
      ket: 'Pembeli telah menerima unit dalam kondisi baik. Garansi Toko TECHCARE resmi aktif.'
    },
    cancelled: {
      title: 'Pesanan Dibatalkan',
      lokasi: 'Sistem TECHCARE',
      ket: 'Pesanan dibatalkan dan stok unit dikembalikan ke katalog.'
    }
  };

  let targetOrder = null;

  const updated = orders.map((o) => {
    if (o.id === orderId || o.nomorPesanan === orderId) {
      const history = Array.isArray(o.trackingHistory) ? [...o.trackingHistory] : [];
      const info = defaultTrackInfo[statusKey] || {
        title: ORDER_STATUS_MAP[statusKey] || 'Pembaruan Status',
        lokasi: 'Depok (Workshop TECHCARE)',
        ket: 'Status pesanan diperbarui.'
      };

      const finalResi = cleanResi !== null && cleanResi !== '' ? cleanResi : o.resi;
      const finalPaymentStatus =
        ['paid', 'processing', 'shipped', 'completed'].includes(statusKey)
          ? 'paid'
          : o.paymentStatus;

      // Kembalikan stok & kuota kupon otomatis bila baru dibatalkan (hanya sekali)
      let stockRestored = Boolean(o.stockRestored);
      if (statusKey === 'cancelled' && o.statusKey !== 'cancelled' && !stockRestored) {
        restoreStockForOrder(o);
        restoreDiscountForOrder(o);
        stockRestored = true;
      }

      history.unshift({
        waktu: nowIso,
        status: info.title,
        lokasi: cleanLoc || info.lokasi,
        keterangan: cleanNote || info.ket
      });

      targetOrder = {
        ...o,
        statusKey,
        status: ORDER_STATUS_MAP[statusKey] || o.status,
        paymentStatus: finalPaymentStatus,
        resi: finalResi,
        stockRestored,
        trackingHistory: history
      };
      return targetOrder;
    }
    return o;
  });

  setStored(STORAGE_KEYS.ORDERS, updated);
  return { success: true, data: targetOrder, orders: updated };
}

export async function confirmOrderReceived(orderId) {
  return updateOrderStatus(
    orderId,
    'completed',
    null,
    'Pembeli mengonfirmasi barang diterima dalam kondisi baik & sesuai spesifikasi. Garansi Toko TECHCARE mulai berlaku.',
    'Alamat Penerima'
  );
}

export async function cancelOrder(orderId, reason = 'Dibatalkan oleh pembeli sebelum pembayaran.') {
  const orders = getStored(STORAGE_KEYS.ORDERS, mockOrders);
  const existing = orders.find((o) => o.id === orderId || o.nomorPesanan === orderId);
  if (!existing) return { success: false, error: 'Pesanan tidak ditemukan.' };
  if (existing.statusKey !== 'pending') {
    return {
      success: false,
      error: 'Pesanan hanya dapat dibatalkan saat masih menunggu pembayaran.'
    };
  }
  return updateOrderStatus(orderId, 'cancelled', null, reason, 'Online Store TECHCARE');
}

// ============================================================================
// ADMIN PRODUCTS CRUD
// ============================================================================

export async function createProduct(payload) {
  await delay(200, 340);
  const products = getStored(STORAGE_KEYS.PRODUCTS, mockProducts);
  const collections = getStored(STORAGE_KEYS.COLLECTIONS, mockCollections);

  const nama = sanitizeText(payload.nama, 150);
  const harga = Number(payload.harga);
  const stok = Math.max(0, Number(payload.stok) || 0);

  if (!nama || Number.isNaN(harga) || harga <= 0) {
    return { success: false, error: 'Nama produk dan harga valid wajib diisi.' };
  }

  const slug =
    nama
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') +
    '-' +
    Math.floor(100 + Math.random() * 900);

  const matchedCol = collections.find(
    (c) => c.nama === payload.koleksi || c.slug === payload.koleksiSlug
  );
  const koleksi = matchedCol?.nama || sanitizeText(payload.koleksi, 80) || 'Laptop Second';
  const koleksiSlug = matchedCol?.slug || payload.koleksiSlug || 'laptop-second';

  const defaultImg =
    matchedCol?.gambar || '/images/products/thinkpad-x1-carbon-front.jpg';

  const hargaCoret = payload.hargaCoret ? Number(payload.hargaCoret) : null;
  const newProd = {
    id: `tc-${Date.now()}`,
    brand: sanitizeText(payload.brand, 60).toUpperCase() || 'LENOVO',
    nama,
    slug,
    tagline: sanitizeText(payload.tagline, 120) || 'CERTIFIED SECOND-HAND • GRADE A',
    kondisi: sanitizeText(payload.kondisi, 80) || 'Grade A • Mulus 95%',
    garansi: sanitizeText(payload.garansi, 80) || 'Garansi Toko 60 Hari',
    qcSummary: 'Lulus 32 Titik QC Teknisi TECHCARE',
    harga,
    hargaCoret: hargaCoret && hargaCoret > harga ? hargaCoret : null,
    diskonPersen:
      hargaCoret && hargaCoret > harga ? Math.round(((hargaCoret - harga) / hargaCoret) * 100) : 0,
    stok,
    beratGram: Math.max(50, Number(payload.beratGram) || 1200),
    koleksi,
    koleksiSlug,
    gambar: [payload.gambar || defaultImg],
    varianWarna: [{ nama: 'Matte Black', hex: '#18181b' }],
    specOptions: payload.specOptions || null,
    specRangeLabel: sanitizeText(payload.specRangeLabel, 80) || 'Ready Stock • QC Tested',
    deskripsi:
      sanitizeText(payload.deskripsi, 800) ||
      `${nama} kondisi second berkualitas, sudah dicek 32 titik oleh teknisi TECHCARE dan bergaransi toko.`,
    fitur:
      Array.isArray(payload.fitur) && payload.fitur.length > 0
        ? payload.fitur
        : [
            'Lulus 32 Titik QC Teknisi TECHCARE',
            'Garansi Toko 60 Hari',
            'Free Konsultasi Upgrade & Jasa IT'
          ],
    isBestseller: Boolean(payload.isBestseller),
    rating: 4.9,
    ulasan: 1,
    createdAt: new Date().toISOString()
  };

  const updated = [newProd, ...products];
  setStored(STORAGE_KEYS.PRODUCTS, updated);
  return { success: true, data: newProd, message: 'Produk berhasil ditambahkan ke katalog!' };
}

export async function updateProduct(id, payload) {
  await delay(180, 300);
  const products = getStored(STORAGE_KEYS.PRODUCTS, mockProducts);
  const collections = getStored(STORAGE_KEYS.COLLECTIONS, mockCollections);

  const updated = products.map((p) => {
    if (p.id === id || String(p.id) === String(id)) {
      const nextHarga = payload.harga !== undefined ? Number(payload.harga) : p.harga;
      const nextCoret =
        payload.hargaCoret !== undefined
          ? payload.hargaCoret
            ? Number(payload.hargaCoret)
            : null
          : p.hargaCoret;
      const matchedCol = payload.koleksi
        ? collections.find((c) => c.nama === payload.koleksi || c.slug === payload.koleksi)
        : null;

      return {
        ...p,
        nama: payload.nama !== undefined ? sanitizeText(payload.nama, 150) : p.nama,
        brand: payload.brand !== undefined ? sanitizeText(payload.brand, 60).toUpperCase() : p.brand,
        kondisi: payload.kondisi !== undefined ? sanitizeText(payload.kondisi, 80) : p.kondisi,
        deskripsi: payload.deskripsi !== undefined ? sanitizeText(payload.deskripsi, 800) : p.deskripsi,
        koleksi: matchedCol ? matchedCol.nama : payload.koleksi || p.koleksi,
        koleksiSlug: matchedCol ? matchedCol.slug : payload.koleksiSlug || p.koleksiSlug,
        beratGram:
          payload.beratGram !== undefined ? Math.max(50, Number(payload.beratGram) || 1000) : p.beratGram,
        harga: nextHarga,
        hargaCoret: nextCoret && nextCoret > nextHarga ? nextCoret : null,
        diskonPersen:
          nextCoret && nextCoret > nextHarga
            ? Math.round(((nextCoret - nextHarga) / nextCoret) * 100)
            : 0,
        stok: payload.stok !== undefined ? Math.max(0, Number(payload.stok)) : p.stok
      };
    }
    return p;
  });

  setStored(STORAGE_KEYS.PRODUCTS, updated);
  return { success: true, data: updated, message: 'Produk berhasil diperbarui!' };
}

export async function deleteProduct(id) {
  await delay(160, 260);
  const products = getStored(STORAGE_KEYS.PRODUCTS, mockProducts);
  const updated = products.filter((p) => p.id !== id && String(p.id) !== String(id));
  setStored(STORAGE_KEYS.PRODUCTS, updated);
  return { success: true, data: updated, message: 'Produk berhasil dihapus dari katalog.' };
}
