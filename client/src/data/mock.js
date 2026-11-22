/**
 * ============================================================================
 * TECHCARE DATA STORE (CERTIFIED PRE-OWNED IT HARDWARE & IT SERVICES)
 * Semua produk merupakan perangkat IT Second Berkualitas (< Rp 10.000.000)
 * yang telah melalui 30+ titik Quality Control oleh teknisi TECHCARE.
 * ============================================================================
 */

export const mockProducts = [
  {
    id: 1,
    brand: 'LENOVO THINKPAD',
    nama: 'Lenovo ThinkPad X1 Carbon Gen 9',
    slug: 'lenovo-thinkpad-x1-carbon-gen-9',
    tagline: 'ULTRABOOK BISNIS CARBON • GRADE A+',
    kondisi: 'Grade A+ • Mulus 97%',
    garansi: 'Garansi Toko 60 Hari',
    qcSummary: 'Lulus 32 Titik QC • Battery Health 91% • Thermal Repasted',
    harga: 7850000,
    hargaCoret: 9500000,
    diskonPersen: 17,
    stok: 5,
    beratGram: 1850,
    koleksi: 'Laptop Second',
    koleksiSlug: 'laptop-second',
    gambar: [
      '/assets/products/thinkpad-x1-carbon-front.png',
      '/assets/products/thinkpad-x1-carbon-side.png'
    ],
    varianWarna: [
      { nama: 'Carbon Matte Black', hex: '#1c1c1e' }
    ],
    specOptions: {
      ram: [
        { label: 'RAM 8GB', priceDelta: 0 },
        { label: 'RAM 16GB', priceDelta: 550000 },
        { label: 'RAM 32GB', priceDelta: 1150000 }
      ],
      ssd: [
        { label: 'SSD 256GB NVMe', priceDelta: 0 },
        { label: 'SSD 512GB NVMe', priceDelta: 350000 },
        { label: 'SSD 1TB NVMe', priceDelta: 750000 }
      ]
    },
    specRangeLabel: 'RAM 8-32GB • SSD 256GB-1TB',
    deskripsi: 'Laptop bisnis flagship bekas korporat dengan bodi carbon fiber super ringan (1,13 kg). Sudah melalui pembersihan kipas, penggantian thermal paste baru oleh teknisi TECHCARE, dan pengecekan layar 100% bebas dead pixel.',
    fitur: [
      'Intel Core i5-1145G7 vPro (4 Core / 8 Thread, Turbo 4.4GHz)',
      'Layar 14" FHD+ (1920x1200) IPS Anti-Glare 16:10, 400 nits',
      'Kondisi fisik Grade A+ (97% mulus), engsel kokoh & keyboard backlit responsif',
      'Dual Thunderbolt 4, HDMI 2.0, USB-A, Fingerprint Sensor',
      'Free instalasi Windows 11 Pro Original & software produktivitas',
      'Termasuk charger USB-C 65W original & garansi toko 60 hari'
    ],
    isBestseller: true,
    rating: 4.9,
    ulasan: 128
  },
  {
    id: 2,
    brand: 'APPLE',
    nama: 'MacBook Air M1 (2020) 13"',
    slug: 'macbook-air-m1-2020-second',
    tagline: 'APPLE SILICON FANLESS • GRADE A+',
    kondisi: 'Grade A+ • Mulus 96%',
    garansi: 'Garansi Toko 60 Hari',
    qcSummary: 'Lulus 32 Titik QC • Battery Cycle 142 (BH 92%) • TrueTone Aktif',
    harga: 8250000,
    hargaCoret: 9900000,
    diskonPersen: 17,
    stok: 4,
    beratGram: 1950,
    koleksi: 'Laptop Second',
    koleksiSlug: 'laptop-second',
    gambar: [
      '/assets/products/macbook-air-m1.png',
      '/assets/products/macbook-air-m1.png'
    ],
    varianWarna: [
      { nama: 'Space Gray', hex: '#4a4a4e' },
      { nama: 'Silver', hex: '#d4d4d8' }
    ],
    specOptions: {
      ram: [
        { label: 'RAM 8GB Unified', priceDelta: 0 },
        { label: 'RAM 16GB Unified', priceDelta: 1100000 }
      ],
      ssd: [
        { label: 'SSD 256GB', priceDelta: 0 },
        { label: 'SSD 512GB', priceDelta: 550000 }
      ]
    },
    specRangeLabel: 'RAM 8-16GB • SSD 256-512GB',
    deskripsi: 'MacBook Air M1 second pilihan terbaik untuk mahasiswa, programmer, dan kreator konten. Baterai super awet hingga 12 jam pemakaian nyata, hening tanpa kipas, dan telah lolos pengecekan iCloud Clean serta MDM Free oleh teknisi TECHCARE.',
    fitur: [
      'Chip Apple M1 (8-Core CPU, 7-Core GPU, 16-Core Neural Engine)',
      'Layar 13.3" Retina Display P3 Wide Color dengan True Tone aktif',
      'Dijamin Clean iCloud, Bebas MDM, & Touch ID normal 100%',
      'Battery Cycle rendah (<180 CC) dengan Battery Health di atas 90%',
      'Gratis konsultasi migrasi data & setup aplikasi di workshop TECHCARE',
      'Kelengkapan: Unit, Charger 30W USB-C, & Garansi Toko 60 Hari'
    ],
    isBestseller: true,
    rating: 5.0,
    ulasan: 164
  },
  {
    id: 3,
    brand: 'ASUS',
    nama: 'ASUS ZenBook 14 OLED UX3402',
    slug: 'asus-zenbook-14-oled-ux3402',
    tagline: '2.8K OLED ULTRABOOK • GRADE A',
    kondisi: 'Grade A • Mulus 95%',
    garansi: 'Garansi Toko 60 Hari',
    qcSummary: 'Lulus 32 Titik QC • Layar OLED Bebas Burn-In • Repasta Baru',
    harga: 7450000,
    hargaCoret: 8950000,
    diskonPersen: 17,
    stok: 6,
    beratGram: 1900,
    koleksi: 'Laptop Second',
    koleksiSlug: 'laptop-second',
    gambar: [
      '/assets/products/asus-zenbook-14-oled.png'
    ],
    varianWarna: [
      { nama: 'Aqua Celadon Silver', hex: '#cbd5e1' },
      { nama: 'Ponder Blue', hex: '#283446' }
    ],
    specOptions: {
      ram: [
        { label: 'RAM 8GB LPDDR5', priceDelta: 0 },
        { label: 'RAM 16GB LPDDR5', priceDelta: 750000 }
      ],
      ssd: [
        { label: 'SSD 512GB NVMe', priceDelta: 0 },
        { label: 'SSD 1TB NVMe', priceDelta: 550000 }
      ]
    },
    specRangeLabel: 'RAM 8-16GB • SSD 512GB-1TB',
    deskripsi: 'Ultrabook tipis layar 2.8K OLED 90Hz dengan akurasi warna Pantone Validated 100% DCI-P3 — cocok untuk desainer grafis dan mahasiswa kreatif. Unit bekas pemakaian ringan, sudah di-tuning thermal oleh tim teknisi TECHCARE.',
    fitur: [
      'Intel Core i5-1240P Gen-12 (12 Cores / 16 Threads)',
      'Layar 14" 2.8K (2880x1800) OLED 90Hz, 100% DCI-P3 (lolos cek anti burn-in)',
      'Audio Harman Kardon dengan Dolby Atmos jernih',
      'Bodi aluminium presisi berbobot 1,39 kg dengan NumberPad 2.0',
      'Free instalasi OS bersih + pengecekan kesehatan SSD (98% Health)',
      'Garansi Toko TECHCARE 60 Hari + free konsultasi upgrade'
    ],
    isBestseller: true,
    rating: 4.9,
    ulasan: 89
  },
  {
    id: 4,
    brand: 'DELL',
    nama: 'Dell Latitude 7420 Core i7 Gen-11',
    slug: 'dell-latitude-7420-i7-second',
    tagline: 'EX-CORPORATE WORKHORSE • GRADE A',
    kondisi: 'Grade A • Mulus 94%',
    garansi: 'Garansi Toko 60 Hari',
    qcSummary: 'Lulus 32 Titik QC • Stress-Test 4 Jam Stabil • SSD Health 97%',
    harga: 5450000,
    hargaCoret: 6900000,
    diskonPersen: 21,
    stok: 9,
    beratGram: 2100,
    koleksi: 'Laptop Second',
    koleksiSlug: 'laptop-second',
    gambar: [
      '/assets/products/dell-latitude-7420.png'
    ],
    varianWarna: [
      { nama: 'Carbon Fiber Grey', hex: '#2f3237' }
    ],
    specOptions: {
      ram: [
        { label: 'RAM 8GB', priceDelta: 0 },
        { label: 'RAM 16GB', priceDelta: 450000 },
        { label: 'RAM 32GB', priceDelta: 1050000 }
      ],
      ssd: [
        { label: 'SSD 256GB NVMe', priceDelta: 0 },
        { label: 'SSD 512GB NVMe', priceDelta: 300000 },
        { label: 'SSD 1TB NVMe', priceDelta: 700000 }
      ]
    },
    specRangeLabel: 'RAM 8-32GB • SSD 256GB-1TB',
    deskripsi: 'Laptop ex-kantor kelas enterprise paling worth-it di bawah 6 jutaan. Tangguh dipakai coding, multitasking puluhan tab, dan kuliah harian. Sudah dibersihkan tuntas luar dalam oleh teknisi jasa IT TECHCARE.',
    fitur: [
      'Intel Core i7-1185G7 (4 Core / 8 Thread, Turbo hingga 4.8GHz)',
      'Layar 14" Full HD IPS Anti-Glare nyaman untuk menatap layar lama',
      'Dual Thunderbolt 4, HDMI 2.0, MicroSD Reader, Webcam Privacy Shutter',
      'Baterai 63Wh sehat (ketahanan 6–8 jam pemakaian kerja normal)',
      'Siap custom upgrade RAM & SSD sebelum unit dikirim',
      'Garansi Toko 60 Hari + free service cleaning 1x di workshop'
    ],
    isBestseller: true,
    rating: 4.9,
    ulasan: 215
  },
  {
    id: 5,
    brand: 'CORSAIR',
    nama: 'Corsair Vengeance LPX Desktop RAM',
    slug: 'corsair-vengeance-lpx-desktop-ram',
    tagline: 'DESKTOP MEMORY KIT • TESTED MEMTEST86',
    kondisi: 'Second Tested 100%',
    garansi: 'Garansi Tukar Unit 90 Hari',
    qcSummary: 'Lulus MemTest86 4-Pass 0 Error • Pin Emas Bersih • XMP Stabil',
    harga: 385000,
    hargaCoret: 520000,
    diskonPersen: 26,
    stok: 24,
    beratGram: 180,
    koleksi: 'RAM & Memori',
    koleksiSlug: 'ram-memori',
    gambar: [
      '/assets/products/corsair-vengeance-ram.png'
    ],
    varianWarna: [
      { nama: 'Anodized Matte Black', hex: '#18181b' }
    ],
    specOptions: {
      ram: [
        { label: '8GB (1x8GB)', priceDelta: 0 },
        { label: '16GB (2x8GB Dual)', priceDelta: 340000 },
        { label: '32GB (2x16GB Dual)', priceDelta: 865000 }
      ],
      tier: [
        { label: 'DDR4 3200MHz', priceDelta: 0 },
        { label: 'DDR5 5200MHz', priceDelta: 320000 }
      ]
    },
    specRangeLabel: '8GB-32GB • DDR4 / DDR5',
    deskripsi: 'RAM PC Desktop second pilihan dengan heatspreader aluminium low-profile yang muat di hampir semua CPU cooler. Setiap keping sudah melewati uji MemTest86 penuh oleh teknisi TECHCARE untuk menjamin bebas blue-screen (BSOD).',
    fitur: [
      'Lolos uji MemTest86 4-pass dengan hasil 0 error sebelum masuk stok',
      'Mendukung Intel XMP 2.0 / 3.0 & AMD EXPO otomatis di BIOS',
      'Heatspreader aluminium murni untuk pembuangan panas lebih cepat',
      'Bisa sekalian pasang & setting dual-channel gratis di workshop TECHCARE',
      'Garansi ganti unit langsung 90 hari (tidak perlu tunggu RMA lama)'
    ],
    isBestseller: true,
    rating: 4.9,
    ulasan: 173
  },
  {
    id: 6,
    brand: 'KINGSTON FURY',
    nama: 'Kingston FURY Impact Laptop SODIMM RAM',
    slug: 'kingston-fury-impact-sodimm-ram',
    tagline: 'UPGRADE RAM LAPTOP • PLUG N PLAY',
    kondisi: 'Second Tested 100%',
    garansi: 'Garansi Tukar Unit 90 Hari',
    qcSummary: 'Lulus MemTest86 0 Error • Low Voltage 1.2V • Kompatibel Luas',
    harga: 345000,
    hargaCoret: 475000,
    diskonPersen: 27,
    stok: 30,
    beratGram: 150,
    koleksi: 'RAM & Memori',
    koleksiSlug: 'ram-memori',
    gambar: [
      '/assets/products/kingston-fury-sodimm-ram.png'
    ],
    varianWarna: [
      { nama: 'FURY Stealth Black', hex: '#141416' }
    ],
    specOptions: {
      ram: [
        { label: '8GB SODIMM', priceDelta: 0 },
        { label: '16GB SODIMM', priceDelta: 310000 },
        { label: '32GB (2x16GB Kit)', priceDelta: 890000 }
      ],
      tier: [
        { label: 'DDR4 3200MHz', priceDelta: 0 },
        { label: 'DDR5 4800MHz', priceDelta: 290000 }
      ]
    },
    specRangeLabel: '8GB-32GB • DDR4 / DDR5',
    deskripsi: 'Solusi paling hemat dan instan bikin laptop lemot jadi ngebut lagi! RAM laptop SODIMM second copotan unit grade A dengan fitur Plug N Play overclocking otomatis tanpa ribet setting BIOS.',
    fitur: [
      'Kompatibel untuk laptop ASUS, Lenovo ThinkPad, Dell, HP, Acer, & Mini PC',
      'Plug N Play otomatis berjalan di kecepatan optimal motherboard',
      'Konsumsi daya rendah (1.2V / 1.1V) menjaga baterai laptop tetap awet',
      'Gratis jasa pemasangan + pembersihan slot RAM jika ambil di workshop TECHCARE',
      'Garansi Tukar Unit Langsung 90 Hari dari TECHCARE'
    ],
    isBestseller: false,
    rating: 4.9,
    ulasan: 142
  },
  {
    id: 7,
    brand: 'SAMSUNG',
    nama: 'Samsung 990 PRO NVMe M.2 SSD',
    slug: 'samsung-990-pro-nvme-ssd-second',
    tagline: 'PCIE 4.0 NVME • HEALTH 97%+',
    kondisi: 'Second Health 97%+',
    garansi: 'Garansi Toko 90 Hari',
    qcSummary: 'CrystalDiskInfo Health 97-99% • TBW Rendah • Zero Bad Sector',
    harga: 980000,
    hargaCoret: 1350000,
    diskonPersen: 27,
    stok: 16,
    beratGram: 160,
    koleksi: 'SSD & Storage',
    koleksiSlug: 'ssd-storage',
    gambar: [
      '/images/products/samsung-990-pro-heatsink.png'
    ],
    varianWarna: [
      { nama: 'Stealth Heatsink Black', hex: '#18181b' }
    ],
    specOptions: {
      ssd: [
        { label: 'SSD 512GB', priceDelta: 0 },
        { label: 'SSD 1TB', priceDelta: 620000 },
        { label: 'SSD 2TB', priceDelta: 1590000 }
      ]
    },
    specRangeLabel: '512GB / 1TB / 2TB NVMe',
    deskripsi: 'SSD NVMe PCIe Gen4 kencang bekas pemakaian singkat dengan persentase kesehatan (Health) terverifikasi minimal 97% lewat CrystalDiskInfo & Samsung Magician. Ideal untuk upgrade laptop, PC desktop, atau PS5.',
    fitur: [
      'Kecepatan baca hingga 7.450 MB/s & tulis hingga 6.900 MB/s',
      'Laporan screenshot CrystalDiskInfo & Health >97% disertakan di paket',
      'Mendukung jasa cloning Windows/data lama tanpa install ulang di TECHCARE',
      'Zero bad sector & lolos uji transfer data kontinu oleh teknisi',
      'Garansi Toko 90 Hari Tukar Unit'
    ],
    isBestseller: false,
    rating: 4.9,
    ulasan: 118
  },
  {
    id: 8,
    brand: 'LG ULTRAGEAR',
    nama: 'LG UltraGear 27" IPS 144Hz Monitor',
    slug: 'lg-ultragear-27-ips-144hz-second',
    tagline: 'FRAMELESS IPS • NO DEAD PIXEL',
    kondisi: 'Grade A • Layar 100% Bersih',
    garansi: 'Garansi Toko 30 Hari',
    qcSummary: 'Lolos Uji Warna RGB/White • 0 Dead Pixel • 0 Whitespot',
    harga: 2150000,
    hargaCoret: 2990000,
    diskonPersen: 28,
    stok: 7,
    beratGram: 4800,
    koleksi: 'Monitor Second',
    koleksiSlug: 'display-monitor',
    gambar: [
      '/assets/products/lg-ultragear-27-ips.png'
    ],
    varianWarna: [
      { nama: 'Matte Black', hex: '#18181b' }
    ],
    specOptions: {
      tier: [
        { label: '24" FHD 144Hz', priceDelta: 0 },
        { label: '27" QHD 165Hz', priceDelta: 700000 }
      ]
    },
    specRangeLabel: '24" FHD / 27" QHD IPS',
    deskripsi: 'Monitor IPS frameless bekas setup studio desain dengan panel bersih bebas dead pixel, bebas whitespot, dan bebas garis. Cocok untuk layar kedua coding, editing warna sRGB 99%, maupun gaming mulus.',
    fitur: [
      'Panel IPS 1ms (GtG) dengan cakupan warna sRGB 99% akurat',
      'Sudah dicek teliti di ruang gelap: 0 dead pixel & 0 backlight bleed parah',
      'Port lengkap DisplayPort 1.4, Dual HDMI, & Audio Out + VESA Mount',
      'Termasuk kabel DisplayPort & adaptor power original',
      'Packing kayu opsional gratis untuk pengiriman luar kota'
    ],
    isBestseller: false,
    rating: 4.8,
    ulasan: 74
  },
  {
    id: 9,
    brand: 'LOGITECH',
    nama: 'Logitech MX Master 3S Wireless',
    slug: 'logitech-mx-master-3s-second',
    tagline: 'PRODUCTIVITY MOUSE • GRADE A+',
    kondisi: 'Grade A+ • Karet Mulus',
    garansi: 'Garansi Toko 30 Hari',
    qcSummary: 'Switch Normal Anti Double-Click • Scroll MagSpeed Halus • Sanitized',
    harga: 1090000,
    hargaCoret: 1689000,
    diskonPersen: 35,
    stok: 11,
    beratGram: 320,
    koleksi: 'Peripherals Second',
    koleksiSlug: 'peripherals',
    gambar: [
      '/images/products/logitech-mx-master-3s-graphite.png',
      '/images/products/logitech-mx-master-3s-grey.png'
    ],
    varianWarna: [
      { nama: 'Graphite Black', hex: '#1f2937' },
      { nama: 'Pale Grey', hex: '#9ca3af' }
    ],
    specRangeLabel: 'Include Logi Bolt Receiver',
    deskripsi: 'Mouse produktivitas favorit programmer dan editor video dalam kondisi second mulus Grade A+. Sudah dibersihkan higienis (ultrasonic sanitized), karet grip utuh tidak lengket, dan klik 100% aman dari double-click.',
    fitur: [
      'Sensor Darkfield 8.000 DPI bekerja mulus di kaca maupun meja kayu',
      'Quiet Clicks & MagSpeed Electromagnetic Scroll 1.000 baris/detik',
      'Koneksi Bluetooth + USB Logi Bolt Receiver (multi-device hingga 3 perangkat)',
      'Sudah disterilisasi & dicek daya baterai minimal 85%+ awet berminggu-minggu',
      'Garansi Toko TECHCARE 30 Hari'
    ],
    isBestseller: false,
    rating: 4.9,
    ulasan: 204
  },
  {
    id: 10,
    brand: 'LOGITECH G',
    nama: 'Logitech G PRO X Superlight 2 DEX',
    slug: 'logitech-g-pro-x-superlight-2-dex-second',
    tagline: '60G ESPORTS MOUSE • GRADE A',
    kondisi: 'Grade A • Mulus 95%',
    garansi: 'Garansi Toko 30 Hari',
    qcSummary: 'Switch Lightforce Normal • Feet PTFE Baru • Dongle 8K Lengkap',
    harga: 1590000,
    hargaCoret: 2390000,
    diskonPersen: 33,
    stok: 8,
    beratGram: 280,
    koleksi: 'Peripherals Second',
    koleksiSlug: 'peripherals',
    gambar: [
      '/images/products/logitech-superlight-2-dex-black.png',
      '/images/products/logitech-superlight-2-dex-white.png'
    ],
    varianWarna: [
      { nama: 'Matte Black', hex: '#111113' },
      { nama: 'Ghost White', hex: '#f4f4f6' }
    ],
    specRangeLabel: 'Free New PTFE Skates',
    deskripsi: 'Mouse gaming kompetitif super ringan 60 gram bekas pemakaian terawat. Telah dipasangi mouse feet PTFE baru oleh tim TECHCARE dan diuji tracking sensor HERO 2 tanpa spin-out.',
    fitur: [
      'Sensor HERO 2 hingga 44.000 DPI dengan dongle LIGHTSPEED USB-C',
      'Switch hybrid optik-mekanikal LIGHTFORCE responsif anti double-click',
      'Sudah ganti PTFE mouse skates baru & dibersihkan menyeluruh',
      'Kelengkapan fullset kabel charging & dongle receiver original',
      'Garansi Toko TECHCARE 30 Hari'
    ],
    isBestseller: false,
    rating: 4.9,
    ulasan: 97
  },
  {
    id: 11,
    brand: 'FANTECH',
    nama: 'Fantech MAXFIT81 Frost Wireless',
    slug: 'fantech-maxfit81-frost-second',
    tagline: '75% GASKET OLED KEYBOARD • GRADE A+',
    kondisi: 'Grade A+ • Keycaps Bersih',
    garansi: 'Garansi Toko 30 Hari',
    qcSummary: 'Semua Tombol & OLED Normal • Keycaps Ultrasonic Clean • Hot-Swap',
    harga: 740000,
    hargaCoret: 1150000,
    diskonPersen: 36,
    stok: 12,
    beratGram: 1150,
    koleksi: 'Peripherals Second',
    koleksiSlug: 'peripherals',
    gambar: [
      '/assets/products/fantech-maxfit81-frost.png'
    ],
    varianWarna: [
      { nama: 'Frost White PBT', hex: '#e2e8f0' }
    ],
    specRangeLabel: 'Tri-Mode • Hot-Swap 5-Pin',
    deskripsi: 'Keyboard mekanikal 75% gasket mount dengan layar OLED mini & rotary knob dalam kondisi second sangat terawat. Keycaps sudah dicuci ultrasonic dan seluruh socket hot-swap teruji aktif 100%.',
    fitur: [
      'Layar OLED 1" terang normal + knob volume aluminium lancar',
      'Koneksi Tri-Mode (2.4GHz Wireless, Bluetooth 5.0, Kabel USB-C)',
      'Universal Hot-Swappable 5-pin PCB & baterai 4000mAh sehat',
      'Keycaps & case sudah dibersihkan higienis sebelum dikemas',
      'Garansi Toko TECHCARE 30 Hari'
    ],
    isBestseller: false,
    rating: 4.8,
    ulasan: 81
  },
  {
    id: 12,
    brand: 'ASUS ROG',
    nama: 'ASUS ROG Azoth 75% Custom Wireless',
    slug: 'asus-rog-azoth-75-second',
    tagline: 'CUSTOM DIY KEYBOARD • GRADE A',
    kondisi: 'Grade A • Fullset Lube Kit',
    garansi: 'Garansi Toko 30 Hari',
    qcSummary: 'OLED & 3-Way Knob Normal • Switch NX Red Smooth • Sanitized',
    harga: 2450000,
    hargaCoret: 3999000,
    diskonPersen: 39,
    stok: 5,
    beratGram: 1350,
    koleksi: 'Peripherals Second',
    koleksiSlug: 'peripherals',
    gambar: [
      '/images/products/asus-rog-azoth-2.png',
      '/images/products/asus-rog-azoth.png'
    ],
    varianWarna: [
      { nama: 'Gunmetal Gray', hex: '#374151' },
      { nama: 'Moonlight White', hex: '#f3f4f6' }
    ],
    specRangeLabel: 'OLED 2" • ROG NX Red',
    deskripsi: 'Keyboard mekanikal kelas enthusiast dengan gasket silikon 3-lapis dan layar OLED 2 inci. Unit second mulus terawat, switch ROG NX linear terasa sangat halus, cocok untuk setup kerja maupun gaming minimalis.',
    fitur: [
      'Layar OLED 2" + 3-way control knob berfungsi 100%',
      'Koneksi ROG SpeedNova 2.4GHz super irit baterai, Bluetooth, & USB-C',
      'Switch ROG NX Red Linear pre-lubed halus tanpa chattering',
      'Kelengkapan kabel braided, dongle, & keycap puller lengkap',
      'Garansi Toko TECHCARE 30 Hari'
    ],
    isBestseller: false,
    rating: 4.9,
    ulasan: 62
  },
  {
    id: 13,
    brand: 'MSI',
    nama: 'MSI MAG 341CQP 34" Curved Ultrawide',
    slug: 'msi-mag-341cqp-34-curved-second',
    tagline: '34" UWQHD QD-OLED 175HZ • GRADE A+',
    kondisi: 'Grade A+ • Bebas Burn-In',
    garansi: 'Garansi Toko 60 Hari',
    qcSummary: 'Lolos Uji Warna DCI-P3 99% • 0 Dead Pixel • Stand Ergonomis Utuh',
    harga: 7650000,
    hargaCoret: 9850000,
    diskonPersen: 22,
    stok: 3,
    beratGram: 6800,
    koleksi: 'Monitor Second',
    koleksiSlug: 'display-monitor',
    gambar: [
      '/assets/products/msi-mag-341cqp-qd-oled.png'
    ],
    varianWarna: [
      { nama: 'Metallic Obsidian Black', hex: '#18181b' }
    ],
    specRangeLabel: '34" UWQHD • 175Hz • USB-C PD',
    deskripsi: 'Monitor lengkung ultrawide MSI 34 inci resolusi UWQHD (3440x1440) 175Hz bekas studio video editing. Telah lulus kalibrasi warna dan uji panel bebas dead pixel oleh tim teknisi TECHCARE.',
    fitur: [
      'Resolusi 3440x1440 (21:9) Curved 1800R untuk produktivitas multitasking',
      'Refresh rate 175Hz 0.03ms GtG super mulus untuk kerja & gaming',
      'Port HDMI 2.1, DisplayPort 1.4a, dan USB-C Power Delivery + KVM Switch',
      'Disertai laporan QC panel & packing kayu opsional untuk luar Jabodetabek',
      'Garansi Toko TECHCARE 60 Hari'
    ],
    isBestseller: false,
    rating: 4.9,
    ulasan: 41
  },
  {
    id: 14,
    brand: 'LENOVO THINKPAD',
    nama: 'Lenovo ThinkPad T480 Core i5 Gen-8',
    slug: 'lenovo-thinkpad-t480-i5-second',
    tagline: 'LEGENDARY BUSINESS LAPTOP • GRADE A',
    kondisi: 'Grade A • Mulus 95%',
    garansi: 'Garansi Toko 60 Hari',
    qcSummary: 'Lulus 32 Titik QC • Dual Battery Sehat • Thermal Repasted',
    harga: 3650000,
    hargaCoret: 4500000,
    diskonPersen: 19,
    stok: 8,
    beratGram: 1950,
    koleksi: 'Laptop Second',
    koleksiSlug: 'laptop-second',
    gambar: [
      '/assets/lenovo-thinkpad.png'
    ],
    varianWarna: [
      { nama: 'Matte Black', hex: '#1c1c1e' }
    ],
    specOptions: {
      ram: [
        { label: 'RAM 8GB', priceDelta: 0 },
        { label: 'RAM 16GB', priceDelta: 350000 }
      ],
      ssd: [
        { label: 'SSD 256GB NVMe', priceDelta: 0 },
        { label: 'SSD 512GB NVMe', priceDelta: 300000 }
      ]
    },
    specRangeLabel: 'RAM 8-16GB • SSD 256-512GB',
    deskripsi: 'ThinkPad T480 legendaris untuk mahasiswa dan pekerja kantoran dengan budget hemat di bawah 4 jutaan. Keyboard paling nyaman di kelasnya, mudah di-upgrade, dan sudah lolos 32 titik QC serta penggantian thermal paste baru di workshop TECHCARE.',
    fitur: [
      'Intel Core i5-8350U (4 Core / 8 Thread, Turbo 3.6GHz)',
      'Layar 14" Full HD IPS Anti-Glare nyaman untuk mengetik dan kuliah',
      '2 Slot RAM SO-DIMM upgradeable hingga 32GB & slot SSD NVMe',
      'Port lengkap: USB-C Thunderbolt 3, HDMI, RJ-45 LAN, SD Card Reader',
      'Free instalasi Windows 11 Pro & aplikasi dasar siap pakai',
      'Termasuk charger USB-C 65W & Garansi Toko TECHCARE 60 Hari'
    ],
    isBestseller: true,
    rating: 4.9,
    ulasan: 194
  },
  {
    id: 15,
    brand: 'HP ELITEBOOK',
    nama: 'HP EliteBook 840 G8 Core i5 Gen-11',
    slug: 'hp-elitebook-840-g8-i5-second',
    tagline: 'ALUMINUM BUSINESS ULTRABOOK • GRADE A+',
    kondisi: 'Grade A+ • Mulus 96%',
    garansi: 'Garansi Toko 60 Hari',
    qcSummary: 'Lulus 32 Titik QC • Audio Bang & Olufsen • Battery Health 90%',
    harga: 4750000,
    hargaCoret: 5950000,
    diskonPersen: 20,
    stok: 6,
    beratGram: 1750,
    koleksi: 'Laptop Second',
    koleksiSlug: 'laptop-second',
    gambar: [
      '/assets/products/hp-elitebook-840-g8.png'
    ],
    varianWarna: [
      { nama: 'Natural Silver Aluminum', hex: '#d4d4d8' }
    ],
    specOptions: {
      ram: [
        { label: 'RAM 8GB', priceDelta: 0 },
        { label: 'RAM 16GB', priceDelta: 400000 }
      ],
      ssd: [
        { label: 'SSD 256GB NVMe', priceDelta: 0 },
        { label: 'SSD 512GB NVMe', priceDelta: 300000 }
      ]
    },
    specRangeLabel: 'RAM 8-16GB • SSD 256-512GB',
    deskripsi: 'Laptop bisnis bodi full aluminium CNC ringan di bawah 5 jutaan dengan speaker Bang & Olufsen jernih untuk meeting online. Ex-korporat mulus pilihan teknisi TECHCARE, baterai awet dan layar bebas dead pixel.',
    fitur: [
      'Intel Core i5-1135G7 Gen-11 (4 Core / 8 Thread) + Intel Iris Xe Graphics',
      'Layar 14" Full HD IPS Anti-Glare bezel tipis',
      'Bodi CNC aluminium silver kokoh & ringan (1,35 kg) dengan keyboard backlit',
      'Dual Thunderbolt 4, HDMI 2.0, USB-A, & Audio by Bang & Olufsen',
      'Free instalasi OS bersih + pengecekan kesehatan SSD & baterai',
      'Termasuk charger original & Garansi Toko TECHCARE 60 Hari'
    ],
    isBestseller: true,
    rating: 4.9,
    ulasan: 112
  }
];

export const mockCollections = [
  {
    id: 1,
    nama: 'Laptop Second',
    slug: 'laptop-second',
    tagline: 'ThinkPad, MacBook Air, ZenBook & Dell di bawah 10 Juta',
    gambar: '/assets/products/thinkpad-x1-carbon-front.png',
    buttonText: 'LIHAT LAPTOP →'
  },
  {
    id: 2,
    nama: 'RAM & Memori',
    slug: 'ram-memori',
    tagline: 'Corsair Vengeance & Kingston FURY DDR4/DDR5 Tested',
    gambar: '/assets/products/corsair-vengeance-ram.png',
    buttonText: 'LIHAT RAM →'
  },
  {
    id: 3,
    nama: 'SSD & Storage',
    slug: 'ssd-storage',
    tagline: 'Samsung NVMe PCIe Gen4 Health 97%+ Siap Upgrade',
    gambar: '/images/products/samsung-990-pro-heatsink.png',
    buttonText: 'LIHAT SSD →'
  },
  {
    id: 4,
    nama: 'Monitor Second',
    slug: 'display-monitor',
    tagline: 'Monitor IPS Frameless Bebas Dead Pixel & Garansi Toko',
    gambar: '/assets/products/lg-ultragear-27-ips.png',
    buttonText: 'LIHAT MONITOR →'
  },
  {
    id: 5,
    nama: 'Peripherals Second',
    slug: 'peripherals',
    tagline: 'Mouse Logitech MX/Superlight & Keyboard Mechanical Grade A',
    gambar: '/images/products/logitech-mx-master-3s-graphite.png',
    buttonText: 'LIHAT PERIPHERAL →'
  }
];

export const mockDiscounts = [
  {
    id: 1,
    kode: 'TECHCARE10',
    nama: 'Diskon Pelanggan Baru 10% (Maks. Rp 300rb)',
    tipe: 'persen',
    nilai: 10,
    minBelanja: 500000,
    maksDiskon: 300000,
    aktif: true,
    kuota: 100,
    terpakai: 38,
    berlakuSampai: '2026-12-31'
  },
  {
    id: 2,
    kode: 'UPGRADERAM',
    nama: 'Potongan Rp 50.000 Khusus Upgrade RAM & SSD',
    tipe: 'nominal',
    nilai: 50000,
    minBelanja: 300000,
    maksDiskon: 50000,
    aktif: true,
    kuota: 80,
    terpakai: 24,
    berlakuSampai: '2026-12-31'
  },
  {
    id: 3,
    kode: 'LAPTOP250K',
    nama: 'Hemat Rp 250.000 Pembelian Laptop Second',
    tipe: 'nominal',
    nilai: 250000,
    minBelanja: 5000000,
    maksDiskon: 250000,
    aktif: true,
    kuota: 40,
    terpakai: 15,
    berlakuSampai: '2026-12-31'
  }
];

export const mockOrders = [
  {
    id: 'ord-101',
    nomorPesanan: 'TC-261117-9102',
    tanggal: '2026-11-17T07:15:00Z',
    userEmail: 'buyer@techcare.id',
    customer: {
      nama: 'Budi Santoso',
      email: 'buyer@techcare.id',
      telepon: '081298765432',
      alamat: 'Jl. Senopati No. 42, Kebayoran Baru',
      kota: 'Jakarta Selatan',
      kodePos: '12190'
    },
    items: [
      {
        id: 1,
        nama: 'Lenovo ThinkPad X1 Carbon Gen 9',
        brand: 'LENOVO THINKPAD',
        slug: 'lenovo-thinkpad-x1-carbon-gen-9',
        harga: 8750000,
        jumlah: 1,
        warna: 'Carbon Matte Black',
        specLabel: 'RAM 16GB • SSD 512GB NVMe',
        gambar: '/assets/products/thinkpad-x1-carbon-front.png'
      }
    ],
    subtotal: 8750000,
    diskon: 250000,
    kodeDiskon: 'LAPTOP250K',
    ongkir: 48000,
    uniqueCode: 214,
    total: 8548214,
    totalWeightGram: 1850,
    shippingZone: 'Jabodetabek',
    paymentDeadline: '2026-11-18T07:15:00Z',
    metodeBayar: 'QRIS Instan',
    paymentMethodKey: 'qris',
    paymentStatus: 'paid',
    paymentProofUrl: null,
    paymentNotes: 'Pembayaran QRIS terverifikasi oleh Admin TECHCARE.',
    kurir: 'JNE YES + Packing Kayu (Gratis)',
    resi: 'JNE9812739182ID',
    status: 'Sedang Dikirim',
    statusKey: 'shipped',
    trackingHistory: [
      {
        waktu: '2026-11-18T02:30:00Z',
        status: 'Sedang Diantar Kurir',
        lokasi: 'Jakarta Selatan (Hub Kebayoran)',
        keterangan: 'Paket sedang dibawa kurir JNE menuju alamat penerima.'
      },
      {
        waktu: '2026-11-17T16:40:00Z',
        status: 'Paket Diserahkan ke Kurir',
        lokasi: 'Depok (Workshop TECHCARE)',
        keterangan: 'Paket diserahkan ke JNE YES dengan resi JNE9812739182ID + asuransi penuh.'
      },
      {
        waktu: '2026-11-17T11:20:00Z',
        status: 'Upgrade Spec & 32 Titik QC Teknisi',
        lokasi: 'Depok (Workshop TECHCARE)',
        keterangan: 'Upgrade RAM 16GB + SSD 512GB selesai, lulus stress-test thermal & layar.'
      },
      {
        waktu: '2026-11-17T08:00:00Z',
        status: 'Pembayaran Diverifikasi',
        lokasi: 'Sistem TECHCARE',
        keterangan: 'Pembayaran QRIS sebesar Rp 8.500.000 telah diverifikasi admin.'
      },
      {
        waktu: '2026-11-17T07:15:00Z',
        status: 'Pesanan Dibuat',
        lokasi: 'Online Store TECHCARE',
        keterangan: 'Pesanan #TC-261117-9102 berhasil dibuat.'
      }
    ]
  },
  {
    id: 'ord-102',
    nomorPesanan: 'TC-261118-5521',
    tanggal: '2026-11-18T01:05:00Z',
    userEmail: 'buyer@techcare.id',
    customer: {
      nama: 'Budi Santoso',
      email: 'buyer@techcare.id',
      telepon: '081298765432',
      alamat: 'Jl. Senopati No. 42, Kebayoran Baru',
      kota: 'Jakarta Selatan',
      kodePos: '12190'
    },
    items: [
      {
        id: 5,
        nama: 'Corsair Vengeance LPX Desktop RAM',
        brand: 'CORSAIR',
        slug: 'corsair-vengeance-lpx-desktop-ram',
        harga: 725000,
        jumlah: 1,
        warna: 'Anodized Matte Black',
        specLabel: '16GB (2x8GB Dual) • DDR4 3200MHz',
        gambar: '/assets/products/corsair-vengeance-ram.png'
      }
    ],
    subtotal: 725000,
    diskon: 50000,
    kodeDiskon: 'UPGRADERAM',
    ongkir: 16000,
    uniqueCode: 487,
    total: 691487,
    totalWeightGram: 180,
    shippingZone: 'Jabodetabek',
    paymentDeadline: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
    metodeBayar: 'Transfer Bank (BCA)',
    paymentMethodKey: 'bank_transfer',
    paymentStatus: 'awaiting_verification',
    paymentProofUrl: '/images/qris-techcare.svg',
    paymentNotes: 'Transfer BCA a.n. Budi Santoso pukul 08:10 WIB',
    kurir: 'SiCepat BEST (Gratis Ongkir)',
    resi: null,
    status: 'Menunggu Verifikasi',
    statusKey: 'awaiting_verification',
    trackingHistory: [
      {
        waktu: '2026-11-18T01:12:00Z',
        status: 'Bukti Pembayaran Diunggah',
        lokasi: 'Online Store TECHCARE',
        keterangan: 'Pembeli mengunggah bukti transfer BCA. Menunggu verifikasi Admin.'
      },
      {
        waktu: '2026-11-18T01:05:00Z',
        status: 'Pesanan Dibuat',
        lokasi: 'Online Store TECHCARE',
        keterangan: 'Pesanan #TC-261118-5521 berhasil dibuat, menunggu pembayaran.'
      }
    ]
  },
  {
    id: 'ord-103',
    nomorPesanan: 'TC-261115-4310',
    tanggal: '2026-11-15T14:30:00Z',
    userEmail: 'siti.rahma@email.com',
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
        id: 9,
        nama: 'Logitech MX Master 3S Wireless',
        brand: 'LOGITECH',
        slug: 'logitech-mx-master-3s-second',
        harga: 1090000,
        jumlah: 1,
        warna: 'Graphite Black',
        specLabel: 'Grade A+ • Include Logi Bolt',
        gambar: '/images/products/logitech-mx-master-3s-graphite.png'
      }
    ],
    subtotal: 1090000,
    diskon: 109000,
    kodeDiskon: 'TECHCARE10',
    ongkir: 16000,
    uniqueCode: 319,
    total: 997319,
    totalWeightGram: 320,
    shippingZone: 'Jawa Barat & Banten',
    paymentDeadline: '2026-11-16T14:30:00Z',
    metodeBayar: 'Transfer Bank (BCA)',
    paymentMethodKey: 'bank_transfer',
    paymentStatus: 'paid',
    paymentProofUrl: null,
    paymentNotes: 'Pembayaran lunas terverifikasi.',
    kurir: 'JNE Reguler (Gratis Ongkir)',
    resi: 'JNE7712093811ID',
    status: 'Selesai',
    statusKey: 'completed',
    trackingHistory: [
      {
        waktu: '2026-11-17T06:20:00Z',
        status: 'Pesanan Diterima & Selesai',
        lokasi: 'Bandung',
        keterangan: 'Pembeli mengonfirmasi barang diterima dalam kondisi mulus.'
      },
      {
        waktu: '2026-11-16T04:10:00Z',
        status: 'Paket Dikirim',
        lokasi: 'Depok (Workshop TECHCARE)',
        keterangan: 'Diserahkan ke JNE Reguler dengan resi JNE7712093811ID.'
      },
      {
        waktu: '2026-11-15T15:00:00Z',
        status: 'Pembayaran Diverifikasi & QC',
        lokasi: 'Workshop TECHCARE',
        keterangan: 'Pembayaran dikonfirmasi admin, unit disterilisasi & dikemas.'
      },
      {
        waktu: '2026-11-15T14:30:00Z',
        status: 'Pesanan Dibuat',
        lokasi: 'Online Store TECHCARE',
        keterangan: 'Pesanan #TC-261115-4310 berhasil dibuat.'
      }
    ]
  }
];
