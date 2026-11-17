/**
 * ============================================================================
 * TECHCARE DATA STORE (MOCK)
 * Toko Resmi Perangkat IT & Elektronik (ASUS, Logitech, Fantech, Lenovo, MSI, dll)
 * ============================================================================
 * 
 * Tipe Data Produk:
 * @typedef {Object} Product
 * @property {number} id - Unique identifier produk
 * @property {string} brand - Merek resmi (ASUS, LOGITECH, FANTECH, LENOVO, MSI)
 * @property {string} nama - Nama lengkap resmi produk
 * @property {string} slug - URL slug unik
 * @property {string} tagline - Tagline kategori produk
 * @property {number} harga - Harga jual aktif (dalam Rupiah)
 * @property {number} [hargaCoret] - Harga ritel resmi sebelum diskon
 * @property {number} [diskonPersen] - Persentase potongan harga
 * @property {number} stok - Jumlah inventaris tersedia
 * @property {string} koleksi - Nama kategori
 * @property {string} koleksiSlug - Slug kategori
 * @property {string[]} gambar - Array URL gambar produk
 * @property {Array<{nama: string, hex: string}>} varianWarna - Varian warna produk
 * @property {string} deskripsi - Deskripsi detail produk
 * @property {string[]} fitur - Spesifikasi resmi dari manufaktur
 * @property {boolean} isBestseller - Ditampilkan di strip Bestsellers
 * @property {number} rating - Skor ulasan pembeli (1-5)
 * @property {number} ulasan - Jumlah review pembeli terverifikasi
 */

export const mockProducts = [
  {
    id: 1,
    brand: 'ASUS ROG',
    nama: 'ASUS ROG Zephyrus G16 (2024)',
    slug: 'asus-rog-zephyrus-g16-2024',
    tagline: 'ULTRA-SLIM OLED WORKSTATION & GAMING',
    harga: 38999000,
    hargaCoret: 42999000,
    diskonPersen: 9,
    stok: 8,
    koleksi: 'Laptop & PC',
    koleksiSlug: 'laptop-pc',
    gambar: [
      '/images/products/laptop.svg',
      '/images/products/laptop.svg'
    ],
    varianWarna: [
      { nama: 'Eclipse Gray', hex: '#2b2b2e' },
      { nama: 'Platinum White', hex: '#ebebef' }
    ],
    deskripsi: 'Laptop workstation & gaming ultra-tipis dengan sasis aluminium unibody CNC presisi tinggi. Menggabungkan performa AI prosesor Intel Core Ultra 9 dengan grafis NVIDIA GeForce RTX 4080 serta layar ROG Nebula OLED 2.5K 240Hz pertama di kelasnya.',
    fitur: [
      'Intel Core Ultra 9 185H (16 Cores, 22 Threads, NPU Intel AI Boost)',
      'NVIDIA GeForce RTX 4080 12GB GDDR6 (TGP 115W dengan Dynamic Boost)',
      '32GB LPDDR5X 7467MHz Dual-Channel onboard',
      '2TB PCIe 4.0 NVMe M.2 Performance SSD',
      '16" 2.5K (2560 x 1600) OLED 240Hz 0.2ms, 100% DCI-P3, G-SYNC, VESA DisplayHDR 500',
      'Bobot hanya 1.85 kg dengan ketebalan 1.49 cm, baterai 90WHrs'
    ],
    isBestseller: true,
    rating: 4.9,
    ulasan: 156
  },
  {
    id: 2,
    brand: 'LENOVO LEGION',
    nama: 'Lenovo Legion Pro 7i Gen 9',
    slug: 'lenovo-legion-pro-7i-gen-9',
    tagline: 'AI-TUNED FLAGSHIP WORKSTATION LAPTOP',
    harga: 46499000,
    hargaCoret: 49999000,
    diskonPersen: 7,
    stok: 6,
    koleksi: 'Laptop & PC',
    koleksiSlug: 'laptop-pc',
    gambar: [
      '/images/products/laptop.svg'
    ],
    varianWarna: [
      { nama: 'Onyx Grey', hex: '#1f2022' }
    ],
    deskripsi: 'Laptop performa ekstrem bertenaga Intel Core i9 Gen-14HX dan kartu grafis RTX 4090 16GB. Didukung chip Lenovo AI LA-2Q untuk tuning performa thermal dinamis dan sistem pendingin Legion ColdFront: Vapor Chamber ganda.',
    fitur: [
      'Intel Core i9-14900HX (24 Cores / 32 Threads, Turbo Boost hingga 5.8 GHz)',
      'NVIDIA GeForce RTX 4090 16GB GDDR6 (Maksimum TGP 175W)',
      '32GB (2x 16GB) SO-DIMM DDR5-5600MHz (Bisa upgrade hingga 64GB)',
      '2TB (2x 1TB) SSD M.2 2280 PCIe 4.0x4 NVMe RAID 0 Ready',
      '16" WQXGA (2560x1600) IPS 500 nits Anti-glare, 100% DCI-P3, 240Hz, HDR 400',
      'Keyboard Legion TrueStrike per-key RGB ditenagai Corsair iCUE'
    ],
    isBestseller: true,
    rating: 5.0,
    ulasan: 94
  },
  {
    id: 3,
    brand: 'LOGITECH G',
    nama: 'Logitech G PRO X SUPERLIGHT 2 DEX',
    slug: 'logitech-g-pro-x-superlight-2-dex',
    tagline: 'WIRELESS ESPORTS ERGONOMIC MOUSE',
    harga: 2390000,
    hargaCoret: 2690000,
    diskonPersen: 11,
    stok: 24,
    koleksi: 'Peripherals & Aksesoris',
    koleksiSlug: 'peripherals',
    gambar: [
      '/images/products/mouse.svg',
      '/images/products/mouse.svg'
    ],
    varianWarna: [
      { nama: 'Matte Black', hex: '#111113' },
      { nama: 'Ghost White', hex: '#f7f7f9' },
      { nama: 'Magenta Pink', hex: '#ec4899' }
    ],
    deskripsi: 'Mouse nirkabel esports generasi terbaru rancangan para atlet profesional dunia. Menggunakan desain bentuk asimetris ergonomis tangan kanan dengan bobot hanya 60 gram dan sensor mutakhir HERO 2 berpresisi 44.000 DPI.',
    fitur: [
      'Sensor HERO 2: Akurasi sub-mikron hingga 44.000 DPI, 888 IPS, akselerasi 88G',
      'Polling rate nirkabel true 8000Hz (8K Hz) dengan dongle LIGHTSPEED USB-C',
      'Switch hibrida optik-mekanikal LIGHTFORCE respons instan anti double-click',
      'Bobot sangat ringan 60 gram tanpa lubang honeycomb',
      'Daya tahan baterai hingga 95 jam pemakaian kompetitif non-stop'
    ],
    isBestseller: true,
    rating: 4.9,
    ulasan: 312
  },
  {
    id: 4,
    brand: 'FANTECH',
    nama: 'Fantech MAXFIT81 Frost Wireless',
    slug: 'fantech-maxfit81-frost-wireless',
    tagline: '75% GASKET MOUNT OLED MECHANICAL KEYBOARD',
    harga: 1150000,
    hargaCoret: 1450000,
    diskonPersen: 21,
    stok: 35,
    koleksi: 'Peripherals & Aksesoris',
    koleksiSlug: 'peripherals',
    gambar: [
      '/images/products/keyboard.svg'
    ],
    varianWarna: [
      { nama: 'Frost Translucent', hex: '#94a3b8' },
      { nama: 'Smoky Black', hex: '#1e293b' }
    ],
    deskripsi: 'Keyboard mekanikal 75% modular dengan layar OLED interaktif 1 inci dan kenop putar volume aluminium. Menggunakan struktur gasket mount multi-lapisan peredam busa untuk menghasilkan suara ketikan thocky yang empuk.',
    fitur: [
      'Layar OLED Interaktif kustom untuk info baterai, jam, dan animasi GIF',
      'Struktur Gasket Mount dengan plate busa silikon dan poron case dampener',
      'Koneksi Tri-Mode: 2.4GHz Wireless, Bluetooth 5.0 (3 perangkat), Kabel Type-C',
      'Universal Hot-Swappable 5-Pin South-Facing RGB PCB',
      'Keycaps PBT Dyesub / Translucent Retro Profile, Baterai 4000mAh'
    ],
    isBestseller: true,
    rating: 4.8,
    ulasan: 188
  },
  {
    id: 5,
    brand: 'MSI',
    nama: 'MSI MAG 341CQP QD-OLED',
    slug: 'msi-mag-341cqp-qd-oled',
    tagline: '34" CURVED QD-OLED 175HZ 0.03MS MONITOR',
    harga: 14999000,
    hargaCoret: 17500000,
    diskonPersen: 14,
    stok: 9,
    koleksi: 'Monitor & Display',
    koleksiSlug: 'display-monitor',
    gambar: [
      '/images/products/monitor.svg'
    ],
    varianWarna: [
      { nama: 'Titan Black', hex: '#18181b' }
    ],
    deskripsi: 'Monitor gaming ultrawide 34 inci lengkung berpanel Quantum Dot OLED generasi terbaru. Menawarkan rasio kontras tak terbatas, waktu respons 0.03ms instan, dan cakupan warna sinematik 99% DCI-P3 dengan garansi anti burn-in 3 tahun.',
    fitur: [
      'Panel 34" UWQHD (3440 x 1440) Next-Gen QD-OLED, Kurvatur 1800R',
      'Refresh rate 175Hz dengan waktu respon 0.03ms (GtG)',
      'Sertifikasi VESA DisplayHDR True Black 400 & ClearMR 9000',
      'Port USB Type-C dengan 90W Power Delivery untuk laptop',
      'Built-in KVM Switch untuk kontrol 2 PC menggunakan 1 mouse & keyboard',
      'MSI OLED Care 2.0 dengan proteksi pendingin pasif grafena tanpa kipas bising'
    ],
    isBestseller: false,
    rating: 5.0,
    ulasan: 47
  },
  {
    id: 6,
    brand: 'ASUS ROG',
    nama: 'ASUS ROG Azoth 75% Wireless',
    slug: 'asus-rog-azoth-75-wireless',
    tagline: 'CUSTOM DIY MECHANICAL GAMING KEYBOARD',
    harga: 3999000,
    hargaCoret: 4499000,
    diskonPersen: 11,
    stok: 15,
    koleksi: 'Peripherals & Aksesoris',
    koleksiSlug: 'peripherals',
    gambar: [
      '/images/products/keyboard.svg'
    ],
    varianWarna: [
      { nama: 'Gunmetal Gray', hex: '#374151' },
      { nama: 'Moonlight White', hex: '#f3f4f6' }
    ],
    deskripsi: 'Keyboard mekanikal premium dengan nuansa custom keyboard rakitan sendiri. Dilengkapi layar OLED 2 inci, tombol navigasi three-way knob, gasket mount silikon 3 lapis, dan switch ROG NX pre-lubed dari pabrik.',
    fitur: [
      'Layar OLED 2" intuitif untuk pemantau suhu CPU/GPU dan status baterai',
      'Silicon Gasket Mount dengan 3 lapisan busa peredam akustik metalik',
      'Teknologi nirkabel ROG SpeedNova 2.4GHz dengan daya tahan baterai 2.000+ jam',
      'Switch mekanikal ROG NX Red Linear pre-lubed dengan krytox',
      'Dilengkapi paket lengkap alat lube DIY: Krytox GPL-205-GD0, switch opener & brush'
    ],
    isBestseller: false,
    rating: 4.9,
    ulasan: 73
  },
  {
    id: 7,
    brand: 'LOGITECH',
    nama: 'Logitech MX Master 3S Performance',
    slug: 'logitech-mx-master-3s-performance',
    tagline: 'FLAGSHIP PRODUCTIVITY ERGONOMIC MOUSE',
    harga: 1689000,
    hargaCoret: 1899000,
    diskonPersen: 11,
    stok: 40,
    koleksi: 'Peripherals & Aksesoris',
    koleksiSlug: 'peripherals',
    gambar: [
      '/images/products/mouse.svg'
    ],
    varianWarna: [
      { nama: 'Graphite Black', hex: '#1f2937' },
      { nama: 'Pale Gray', hex: '#e5e7eb' }
    ],
    deskripsi: 'Standar emas mouse produktivitas para programmer, analis data, dan desainer profesional. Menghadirkan klik hening Quiet Clicks 90%, scroll elektromagnetik MagSpeed berkecepatan 1.000 baris per detik, dan sensor 8K DPI optik.',
    fitur: [
      'Sensor Darkfield 8.000 DPI yang dapat melacak di semua permukaan termasuk kaca',
      'Quiet Clicks: 90% lebih hening dibanding seri pendahulu dengan feel taktil empuk',
      'Roda gulir MagSpeed Electromagnetic: scrolling ultra-cepat dan ultra-presisi',
      'Roda gulir samping (thumb wheel) khusus untuk timeline video atau spreadsheet lebar',
      'Teknologi Logitech Flow: copy-paste teks dan file antar 3 komputer secara seamless'
    ],
    isBestseller: true,
    rating: 4.9,
    ulasan: 420
  },
  {
    id: 8,
    brand: 'FANTECH',
    nama: 'Fantech Aria XD7 Pro Wireless',
    slug: 'fantech-aria-xd7-pro-wireless',
    tagline: 'ULTRA-LIGHTWEIGHT 59G ESPORTS MOUSE',
    harga: 780000,
    hargaCoret: 990000,
    diskonPersen: 21,
    stok: 50,
    koleksi: 'Peripherals & Aksesoris',
    koleksiSlug: 'peripherals',
    gambar: [
      '/images/products/mouse.svg'
    ],
    varianWarna: [
      { nama: 'Solid Black', hex: '#111827' },
      { nama: 'Solid White', hex: '#ffffff' }
    ],
    deskripsi: 'Mouse gaming nirkabel berbentuk telur klasik dengan bobot super ringan 59 gram tanpa lubang bodi. Ditenagai sensor flagship PixArt PAW3395 26.000 DPI dan switch optik Kailh GM 8.0 Black Mamba.',
    fitur: [
      'Sensor PixArt PAW3395 Flagship (26.000 DPI, 650 IPS, 50G Akselerasi)',
      'Switch mekanikal Kailh GM 8.0 daya tahan 80 juta klik',
      'Bobot ultra-ringan 59 gram dengan penutup belakang yang dapat diganti',
      'Koneksi Tri-Mode: StrikeSpeed Wireless, Bluetooth 5.0, Kabel Paracord Type-C',
      'Pure virgin PTFE mouse skates untuk gliding super mulus'
    ],
    isBestseller: false,
    rating: 4.8,
    ulasan: 265
  }
];

export const mockCollections = [
  {
    id: 1,
    nama: 'Laptop & PC',
    slug: 'laptop-pc',
    tagline: 'ASUS ROG, Lenovo Legion & Workstation',
    gambar: '/images/products/laptop.svg',
    buttonText: 'LAPTOP & PC +'
  },
  {
    id: 2,
    nama: 'Peripherals & Aksesoris',
    slug: 'peripherals',
    tagline: 'Logitech G, Fantech & ROG Gear',
    gambar: '/images/products/keyboard.svg',
    buttonText: 'PERIPHERALS +'
  },
  {
    id: 3,
    nama: 'Monitor & Display',
    slug: 'display-monitor',
    tagline: 'MSI QD-OLED & ASUS Pro Displays',
    gambar: '/images/products/monitor.svg',
    buttonText: 'MONITOR & DISPLAY +'
  },
  {
    id: 4,
    nama: 'Komponen & Storage',
    slug: 'storage-components',
    tagline: 'SSD PCIe Gen4, RAM DDR5 & Hub',
    gambar: '/images/products/ssd.svg',
    buttonText: 'KOMPONEN & STORAGE +'
  }
];

export const mockDiscounts = [
  {
    id: 1,
    kode: 'TECHCARE10',
    nama: 'Diskon Sambutan Pelanggan Baru 10%',
    tipe: 'persen',
    nilai: 10,
    minBelanja: 1000000,
    maksDiskon: 500000,
    aktif: true,
    kuota: 100,
    terpakai: 42,
    berlakuSampai: '2026-12-31'
  },
  {
    id: 2,
    kode: 'HEMATROGG',
    nama: 'Potongan Khusus Laptop ASUS ROG & Legion',
    tipe: 'nominal',
    nilai: 1000000,
    minBelanja: 25000000,
    maksDiskon: 1000000,
    aktif: true,
    kuota: 25,
    terpakai: 11,
    berlakuSampai: '2026-12-31'
  },
  {
    id: 3,
    kode: 'LOGITECH50K',
    nama: 'Voucher Mouse & Keyboard Logitech/Fantech',
    tipe: 'nominal',
    nilai: 150000,
    minBelanja: 1200000,
    maksDiskon: 150000,
    aktif: true,
    kuota: 50,
    terpakai: 29,
    berlakuSampai: '2026-11-30'
  }
];

export const mockOrders = [
  {
    id: 'ord-101',
    nomorPesanan: 'TC-261117-9102',
    tanggal: '2026-11-17T07:15:00Z',
    customer: {
      nama: 'Budi Pratama',
      email: 'budi.pratama@email.com',
      telepon: '081289102911',
      alamat: 'Jl. Senopati No. 42, Kebayoran Baru',
      kota: 'Jakarta Selatan',
      kodePos: '12190'
    },
    items: [
      {
        id: 3,
        nama: 'Logitech G PRO X SUPERLIGHT 2 DEX',
        brand: 'LOGITECH G',
        slug: 'logitech-g-pro-x-superlight-2-dex',
        harga: 2390000,
        jumlah: 1,
        warna: 'Ghost White',
        gambar: '/images/products/mouse.svg'
      }
    ],
    subtotal: 2390000,
    diskon: 239000,
    kodeDiskon: 'TECHCARE10',
    ongkir: 0,
    total: 2151000,
    metodeBayar: 'QRIS Instan TechCare',
    status: 'Diproses',
    statusKey: 'processing',
    resi: 'JNE9812739182ID'
  },
  {
    id: 'ord-102',
    nomorPesanan: 'TC-261116-4310',
    tanggal: '2026-11-16T14:30:00Z',
    customer: {
      nama: 'Siti Rahmawati',
      email: 'siti.rahma@email.com',
      telepon: '085712398412',
      alamat: 'Jl. Dago Asri V No. 12',
      kota: 'Bandung',
      kodePos: '40135'
    },
    items: [
      {
        id: 4,
        nama: 'Fantech MAXFIT81 Frost Wireless',
        brand: 'FANTECH',
        slug: 'fantech-maxfit81-frost-wireless',
        harga: 1150000,
        jumlah: 1,
        warna: 'Frost Translucent',
        gambar: '/images/products/keyboard.svg'
      }
    ],
    subtotal: 1150000,
    diskon: 115000,
    kodeDiskon: 'TECHCARE10',
    ongkir: 0,
    total: 1035000,
    metodeBayar: 'Transfer Bank BCA TechCare',
    status: 'Selesai',
    statusKey: 'completed',
    resi: 'JNE7712093811ID'
  }
];
