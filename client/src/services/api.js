/**
 * ============================================================================
 * NOVAIRE API SERVICE LAYER
 * ============================================================================
 * Semua pemanggilan data dari komponen dilakukan melalui service ini.
 * Memiliki latency simulasi 400-800ms agar efek Skeleton Loading terlihat nyata.
 */

import {
  mockProducts,
  mockCollections,
  mockDiscounts,
  mockOrders
} from '../data/mock';

// Helper jeda waktu palsu (400-800ms)
const delay = (min = 400, max = 800) => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Local storage keys for mutable mock state
const STORAGE_KEYS = {
  PRODUCTS: 'techcare_mock_products_v2',
  DISCOUNTS: 'techcare_mock_discounts_v2',
  ORDERS: 'techcare_mock_orders_v2'
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

/**
 * Mengambil semua daftar produk (bisa difilter koleksi dan pencarian)
 */
export async function getProducts(filter = {}) {
  await delay(450, 750);
  const products = getStored(STORAGE_KEYS.PRODUCTS, mockProducts);

  let filtered = [...products];

  if (filter.koleksi) {
    filtered = filtered.filter(p => p.koleksiSlug === filter.koleksi);
  }

  if (filter.search) {
    const q = filter.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.nama.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.deskripsi.toLowerCase().includes(q)
    );
  }

  if (filter.bestseller) {
    filtered = filtered.filter(p => p.isBestseller);
  }

  return { success: true, data: filtered, count: filtered.length };
}

/**
 * Mengambil satu produk berdasarkan slug
 */
export async function getProduct(slug) {
  await delay(400, 650);
  const products = getStored(STORAGE_KEYS.PRODUCTS, mockProducts);
  const product = products.find(p => p.slug === slug);

  if (!product) {
    return { success: false, error: 'Produk tidak ditemukan.' };
  }
  return { success: true, data: product };
}

/**
 * Mengambil semua koleksi/kategori
 */
export async function getCollections() {
  await delay(350, 600);
  return { success: true, data: mockCollections };
}

/**
 * Mengambil daftar diskon & promo
 */
export async function getDiscounts() {
  await delay(350, 600);
  const discounts = getStored(STORAGE_KEYS.DISCOUNTS, mockDiscounts);
  return { success: true, data: discounts };
}

/**
 * Validasi dan klaim kupon diskon
 */
export async function validateDiscount(kode, subtotal = 0) {
  await delay(300, 500);
  const discounts = getStored(STORAGE_KEYS.DISCOUNTS, mockDiscounts);
  const normalized = (kode || '').trim().toUpperCase();
  const found = discounts.find(d => d.kode === normalized && d.aktif);

  if (!found) {
    return { success: false, error: 'Kupon promo tidak valid atau telah kedaluwarsa.' };
  }

  if (subtotal < found.minBelanja) {
    return {
      success: false,
      error: `Minimal transaksi untuk voucher ini adalah Rp ${found.minBelanja.toLocaleString('id-ID')}.`
    };
  }

  let potong = 0;
  if (found.tipe === 'persen') {
    potong = Math.round((subtotal * found.nilai) / 100);
    if (found.maksDiskon && potong > found.maksDiskon) {
      potong = found.maksDiskon;
    }
  } else {
    potong = found.nilai;
  }

  return { success: true, data: { ...found, nominalDiskon: potong } };
}

/**
 * Admin membuat promo/diskon baru
 */
export async function createDiscount(payload) {
  await delay(500, 800);
  const discounts = getStored(STORAGE_KEYS.DISCOUNTS, mockDiscounts);

  const newDiscount = {
    id: Date.now(),
    kode: payload.kode.trim().toUpperCase(),
    nama: payload.nama.trim(),
    tipe: payload.tipe || 'persen',
    nilai: Number(payload.nilai) || 10,
    minBelanja: Number(payload.minBelanja) || 0,
    maksDiskon: Number(payload.maksDiskon) || 500000,
    aktif: true,
    kuota: Number(payload.kuota) || 100,
    terpakai: 0,
    berlakuSampai: payload.berlakuSampai || '2026-12-31'
  };

  const updated = [newDiscount, ...discounts];
  setStored(STORAGE_KEYS.DISCOUNTS, updated);
  return { success: true, data: newDiscount, message: 'Kupon diskon berhasil dibuat!' };
}

/**
 * Admin menonaktifkan atau menghapus diskon
 */
export async function toggleDiscountStatus(id) {
  await delay(300, 500);
  const discounts = getStored(STORAGE_KEYS.DISCOUNTS, mockDiscounts);
  const updated = discounts.map(d => d.id === id ? { ...d, aktif: !d.aktif } : d);
  setStored(STORAGE_KEYS.DISCOUNTS, updated);
  return { success: true, data: updated };
}

/**
 * Membuat pesanan baru (Checkout Stepper)
 */
export async function createOrder(payload) {
  await delay(700, 1000);
  const orders = getStored(STORAGE_KEYS.ORDERS, mockOrders);

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const nomorPesanan = `TC-${dateStr}-${randomNum}`;

  const newOrder = {
    id: `ord-${Date.now()}`,
    nomorPesanan,
    tanggal: new Date().toISOString(),
    customer: payload.customer,
    items: payload.items,
    subtotal: payload.subtotal,
    diskon: payload.diskon || 0,
    kodeDiskon: payload.kodeDiskon || null,
    ongkir: 0,
    total: payload.total,
    metodeBayar: payload.metodeBayar || 'Transfer Bank (BCA)',
    status: 'Diproses',
    statusKey: 'processing',
    resi: null
  };

  const updated = [newOrder, ...orders];
  setStored(STORAGE_KEYS.ORDERS, updated);

  return { success: true, data: newOrder, message: 'Pesanan berhasil dibuat!' };
}

/**
 * Mengambil daftar riwayat pesanan
 */
export async function getOrders() {
  await delay(400, 700);
  const orders = getStored(STORAGE_KEYS.ORDERS, mockOrders);
  return { success: true, data: orders };
}

/**
 * Mengambil satu pesanan berdasarkan nomor pesanan
 */
export async function getOrderByNumber(nomorPesanan) {
  await delay(400, 600);
  const orders = getStored(STORAGE_KEYS.ORDERS, mockOrders);
  const order = orders.find(o => o.nomorPesanan.toLowerCase() === (nomorPesanan || '').toLowerCase());
  if (!order) {
    return { success: false, error: 'Pesanan tidak ditemukan.' };
  }
  return { success: true, data: order };
}

/**
 * Admin: Update status pesanan & resi
 */
export async function updateOrderStatus(orderId, statusKey, resi = null) {
  await delay(400, 600);
  const orders = getStored(STORAGE_KEYS.ORDERS, mockOrders);

  const statusMap = {
    pending: 'Menunggu Pembayaran',
    processing: 'Diproses',
    shipped: 'Sedang Dikirim',
    completed: 'Selesai',
    cancelled: 'Dibatalkan'
  };

  const updated = orders.map(o => {
    if (o.id === orderId || o.nomorPesanan === orderId) {
      return {
        ...o,
        statusKey,
        status: statusMap[statusKey] || o.status,
        resi: resi !== null ? resi : o.resi
      };
    }
    return o;
  });

  setStored(STORAGE_KEYS.ORDERS, updated);
  return { success: true, data: updated };
}

/**
 * Admin: Menambah produk IT baru
 */
export async function createProduct(payload) {
  await delay(500, 800);
  const products = getStored(STORAGE_KEYS.PRODUCTS, mockProducts);

  const slug = (payload.nama || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + '-' + Math.floor(100 + Math.random() * 900);

  const categoryMap = {
    'Laptop & PC': 'laptop-pc',
    'Peripherals': 'peripherals',
    'Peripherals & Aksesoris': 'peripherals',
    'Monitor & Display': 'monitors',
    'Komponen & Storage': 'components'
  };

  const koleksi = payload.koleksi || 'Laptop & PC';
  const koleksiSlug = payload.koleksiSlug || categoryMap[koleksi] || 'laptop-pc';

  const defaultImg = koleksiSlug === 'laptop-pc'
    ? '/images/products/laptop.svg'
    : koleksiSlug === 'peripherals'
    ? '/images/products/mouse.svg'
    : koleksiSlug === 'monitors'
    ? '/images/products/monitor.svg'
    : '/images/products/keyboard.svg';

  const newProd = {
    id: `tc-${Date.now()}`,
    brand: payload.brand || 'ASUS',
    nama: payload.nama,
    slug,
    tagline: payload.tagline || 'HIGH PERFORMANCE IT HARDWARE',
    harga: Number(payload.harga),
    hargaCoret: payload.hargaCoret ? Number(payload.hargaCoret) : null,
    diskonPersen: payload.hargaCoret ? Math.round(((payload.hargaCoret - payload.harga) / payload.hargaCoret) * 100) : 0,
    stok: Number(payload.stok) || 10,
    koleksi,
    koleksiSlug,
    gambar: [payload.gambar || defaultImg],
    varianWarna: [{ nama: 'Original Black', hex: '#111113' }],
    deskripsi: payload.deskripsi || `${payload.nama} dengan performa tinggi dan garansi resmi unit baru.`,
    fitur: payload.fitur && payload.fitur.length > 0 ? payload.fitur : ['Garansi Resmi Indonesia', 'Quality Checked Unit Baru'],
    spesifikasi: payload.spesifikasi || {
      Garansi: '2 Tahun Resmi Indonesia',
      Kondisi: '100% Baru & Bersegel'
    },
    isBestseller: Boolean(payload.isBestseller),
    rating: 5.0,
    ulasan: 0
  };

  const updated = [newProd, ...products];
  setStored(STORAGE_KEYS.PRODUCTS, updated);
  return { success: true, data: newProd, message: 'Produk IT berhasil ditambahkan ke katalog!' };
}

/**
 * Admin: Memperbarui produk IT (harga, stok, nama)
 */
export async function updateProduct(id, payload) {
  await delay(400, 600);
  const products = getStored(STORAGE_KEYS.PRODUCTS, mockProducts);

  const updated = products.map((p) => {
    if (p.id === id || String(p.id) === String(id)) {
      return {
        ...p,
        ...payload,
        harga: payload.harga ? Number(payload.harga) : p.harga,
        stok: payload.stok !== undefined ? Number(payload.stok) : p.stok
      };
    }
    return p;
  });

  setStored(STORAGE_KEYS.PRODUCTS, updated);
  return { success: true, data: updated, message: 'Produk berhasil diperbarui!' };
}

/**
 * Admin: Menghapus produk dari katalog
 */
export async function deleteProduct(id) {
  await delay(350, 500);
  const products = getStored(STORAGE_KEYS.PRODUCTS, mockProducts);
  const updated = products.filter((p) => p.id !== id && String(p.id) !== String(id));
  setStored(STORAGE_KEYS.PRODUCTS, updated);
  return { success: true, data: updated, message: 'Produk berhasil dihapus dari katalog.' };
}
