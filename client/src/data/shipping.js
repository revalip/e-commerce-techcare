/**
 * ============================================================================
 * TABEL TARIF ONGKIR LOKAL TECHCARE (TANPA API BERBAYAR)
 * ============================================================================
 * Asal pengiriman: Workshop TECHCARE — Jakarta Barat
 * Perhitungan: tarifPerKg[zona] * Math.max(1, Math.ceil(totalWeightGram / 1000))
 * Promo UMKM: Gratis ongkir untuk layanan Reguler di Jabodetabek jika subtotal >= Rp 5.000.000
 */

export const SHIPPING_ZONES = [
  { id: 'jabodetabek', label: 'Jabodetabek (DKI Jakarta, Bogor, Depok, Tangerang, Bekasi)', multiplier: 1.0 },
  { id: 'jabar_banten', label: 'Jawa Barat & Banten (Bandung, Cirebon, Serang, dll.)', multiplier: 1.35 },
  { id: 'jateng_diy', label: 'Jawa Tengah & DIY (Semarang, Solo, Yogyakarta, dll.)', multiplier: 1.65 },
  { id: 'jatim', label: 'Jawa Timur (Surabaya, Malang, Sidoarjo, dll.)', multiplier: 1.85 },
  { id: 'sumatera', label: 'Sumatera (Medan, Palembang, Pekanbaru, Lampung, dll.)', multiplier: 2.5 },
  { id: 'bali_nusra', label: 'Bali & Nusa Tenggara (Denpasar, Mataram, Kupang)', multiplier: 2.6 },
  { id: 'kalimantan', label: 'Kalimantan (Balikpapan, Samarinda, Pontianak, Banjarmasin)', multiplier: 3.1 },
  { id: 'sulawesi_papua', label: 'Sulawesi, Maluku & Papua (Makassar, Manado, Jayapura)', multiplier: 3.8 }
];

export const COURIERS = [
  {
    id: 'jne_reg',
    code: 'JNE',
    name: 'JNE Reguler',
    label: 'JNE Reguler + Asuransi',
    baseRatePerKg: 12000,
    etaByZone: {
      jabodetabek: '1–2 hari kerja',
      jabar_banten: '2–3 hari kerja',
      jateng_diy: '2–4 hari kerja',
      jatim: '2–4 hari kerja',
      sumatera: '3–5 hari kerja',
      bali_nusra: '3–5 hari kerja',
      kalimantan: '4–6 hari kerja',
      sulawesi_papua: '5–8 hari kerja'
    },
    desc: 'Bubble wrap tebal + asuransi pengiriman unit IT'
  },
  {
    id: 'jne_yes',
    code: 'JNE',
    name: 'JNE YES',
    label: 'JNE YES + Packing Kayu Prioritas',
    baseRatePerKg: 24000,
    etaByZone: {
      jabodetabek: '1 hari sampai',
      jabar_banten: '1 hari sampai',
      jateng_diy: '1–2 hari kerja',
      jatim: '1–2 hari kerja',
      sumatera: '1–2 hari kerja',
      bali_nusra: '1–2 hari kerja',
      kalimantan: '2–3 hari kerja',
      sulawesi_papua: '2–4 hari kerja'
    },
    desc: 'Prioritas cepat + proteksi ekstra laptop/monitor'
  },
  {
    id: 'jnt_ez',
    code: 'J&T',
    name: 'J&T Express',
    label: 'J&T Express EZ',
    baseRatePerKg: 13000,
    etaByZone: {
      jabodetabek: '1–2 hari kerja',
      jabar_banten: '2–3 hari kerja',
      jateng_diy: '2–3 hari kerja',
      jatim: '2–3 hari kerja',
      sumatera: '3–5 hari kerja',
      bali_nusra: '3–4 hari kerja',
      kalimantan: '4–6 hari kerja',
      sulawesi_papua: '5–7 hari kerja'
    },
    desc: 'Pengiriman setiap hari termasuk akhir pekan'
  },
  {
    id: 'sicepat_best',
    code: 'SiCepat',
    name: 'SiCepat BEST',
    label: 'SiCepat BEST (Besok Sampai Tujuan)',
    baseRatePerKg: 16000,
    etaByZone: {
      jabodetabek: '1 hari sampai',
      jabar_banten: '1–2 hari kerja',
      jateng_diy: '1–2 hari kerja',
      jatim: '1–2 hari kerja',
      sumatera: '2–3 hari kerja',
      bali_nusra: '2–3 hari kerja',
      kalimantan: '2–4 hari kerja',
      sulawesi_papua: '3–5 hari kerja'
    },
    desc: 'Cepat & tracking otomatis real-time'
  },
  {
    id: 'workshop',
    code: 'PICKUP',
    name: 'Workshop TECHCARE',
    label: 'Ambil & Gratis Pasang di Workshop TECHCARE',
    baseRatePerKg: 0,
    etaByZone: {
      jabodetabek: 'Siap diambil hari ini (09:00–20:00 WIB)',
      jabar_banten: 'Ambil di Workshop Jakarta Barat',
      jateng_diy: 'Ambil di Workshop Jakarta Barat',
      jatim: 'Ambil di Workshop Jakarta Barat',
      sumatera: 'Ambil di Workshop Jakarta Barat',
      bali_nusra: 'Ambil di Workshop Jakarta Barat',
      kalimantan: 'Ambil di Workshop Jakarta Barat',
      sulawesi_papua: 'Ambil di Workshop Jakarta Barat'
    },
    desc: 'Cek fisik unit & gratis pasang RAM/SSD langsung bareng teknisi'
  }
];

export const FREE_SHIPPING_THRESHOLD = 5000000;

/**
 * Hitung total berat keranjang dalam gram (fallback 1000g per item jika tidak diset)
 */
export function calculateCartWeightGram(items = []) {
  return items.reduce((sum, item) => {
    const unitWeight = Number(item.beratGram) || 1000;
    const qty = Math.max(1, Number(item.jumlah) || 1);
    return sum + unitWeight * qty;
  }, 0);
}

/**
 * Konversi gram ke kilogram tertagih (pembulatan ke atas minimal 1 kg)
 */
export function getBillableWeightKg(totalWeightGram) {
  return Math.max(1, Math.ceil((Number(totalWeightGram) || 500) / 1000));
}

/**
 * Hitung estimasi ongkos kirim berdasarkan kurir, wilayah, berat (gram), dan subtotal
 */
export function calculateShippingCost({ courierId, zoneId = 'jabodetabek', totalWeightGram = 1000, subtotal = 0 }) {
  const courier = COURIERS.find((c) => c.id === courierId) || COURIERS[0];
  const zone = SHIPPING_ZONES.find((z) => z.id === zoneId) || SHIPPING_ZONES[0];
  const weightKg = getBillableWeightKg(totalWeightGram);

  if (courier.id === 'workshop' || courier.baseRatePerKg === 0) {
    return {
      cost: 0,
      originalCost: 0,
      isFreePromo: false,
      weightKg,
      eta: courier.etaByZone[zone.id] || 'Siap diambil di workshop',
      courier,
      zone
    };
  }

  const rawRate = Math.round((courier.baseRatePerKg * zone.multiplier) / 1000) * 1000;
  const originalCost = rawRate * weightKg;

  // Promo gratis ongkir Jabodetabek untuk kurir reguler / J&T jika belanja >= Rp 5 juta
  const eligibleFree =
    subtotal >= FREE_SHIPPING_THRESHOLD &&
    zone.id === 'jabodetabek' &&
    (courier.id === 'jne_reg' || courier.id === 'jnt_ez');

  return {
    cost: eligibleFree ? 0 : originalCost,
    originalCost,
    isFreePromo: eligibleFree,
    weightKg,
    eta: courier.etaByZone[zone.id] || '2–4 hari kerja',
    courier,
    zone
  };
}

/**
 * Daftar semua kurir dengan kalkulasi harga & estimasi waktu untuk wilayah + berat tertentu
 */
export function getShippingOptions({ zoneId = 'jabodetabek', totalWeightGram = 1000, subtotal = 0 }) {
  return COURIERS.map((courier) => ({
    ...courier,
    ...calculateShippingCost({
      courierId: courier.id,
      zoneId,
      totalWeightGram,
      subtotal
    })
  }));
}
