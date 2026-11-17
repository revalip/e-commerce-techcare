export const initialProducts = [
  {
    id: 1,
    name: 'TECHCARE TITAN PRO 16',
    slug: 'techcare-titan-pro-16',
    tagline: 'ULTRABOOK WORKSTATION',
    description: 'Laptop performa tinggi dengan sasis aluminium unibody CNC, ditenagai prosesor Intel Core i9 Gen-14 & GPU RTX 4070. Layar OLED 3.2K 120Hz 100% DCI-P3 sangat ideal untuk programming, desain grafis, rendering 3D, dan analitika data berat.',
    features: [
      'Intel Core i9-14900H (14 Cores, up to 5.8 GHz)',
      'NVIDIA GeForce RTX 4070 8GB GDDR6',
      '32GB LPDDR5X 7467MHz Dual Channel',
      '1TB Gen4 PCIe NVMe SSD (Slot ekspansi M.2 ganda)',
      'Layar 16" 3.2K OLED 120Hz 500 nits HDR'
    ],
    original_price: 26999000,
    price: 23499000,
    discount_percentage: 13,
    stock: 12,
    collection_id: 1,
    collection_name: 'Laptop & PC',
    collection_slug: 'laptop-pc',
    image_url: '/images/products/laptop.svg',
    color: 'Space Titanium Grey',
    is_bestseller: true,
    is_active: true
  },
  {
    id: 2,
    name: 'TECHCARE VISION ULTRA 34"',
    slug: 'techcare-vision-ultra-34',
    tagline: '4K CURVED ULTRAWIDE',
    description: 'Monitor lengkung 34 inci 21:9 WQHD (3440 x 1440) dengan kurvatur 1500R alami. Dilengkapi port USB-C 90W Power Delivery untuk menghubungkan laptop dengan satu kabel sekaligus mengisi daya.',
    features: [
      'Resolusi UWQHD 3440 x 1440 IPS Panel 165Hz',
      'Konektivitas USB-C 90W PD, Dual HDMI 2.1 & DisplayPort 1.4',
      'Warna 99% sRGB / 95% DCI-P3 Delta E < 2',
      'Built-in KVM Switch & Speaker Stereo Hi-Fi'
    ],
    original_price: 8499000,
    price: 6999000,
    discount_percentage: 18,
    stock: 15,
    collection_id: 3,
    collection_name: 'Display & Monitor',
    collection_slug: 'display-monitor',
    image_url: '/images/products/monitor.svg',
    color: 'Matte Obsidian Black',
    is_bestseller: true,
    is_active: true
  },
  {
    id: 3,
    name: 'TECHCARE APEX 75 WIRELESS',
    slug: 'techcare-apex-75-wireless',
    tagline: 'GASKET MECHANICAL KEYBOARD',
    description: 'Keyboard mekanikal 75% kustom dengan konstruksi gasket mount 5-lapis peredam suara. Switch linear factory-lubed, kenop volume aluminium CNC, dan konektivitas tri-mode ultra-low latency.',
    features: [
      'Gasket Mount 5 Layer Foam Dampener (Thocky Sound)',
      'Tri-Mode: 2.4G Wireless (1ms), Bluetooth 5.2, Type-C',
      'Hot-swappable 3/5-pin PCB South-Facing RGB',
      'Keycaps PBT Doubleshot Cherry Profile'
    ],
    original_price: 1899000,
    price: 1499000,
    discount_percentage: 21,
    stock: 28,
    collection_id: 2,
    collection_name: 'Peripherals & Audio',
    collection_slug: 'peripherals',
    image_url: '/images/products/keyboard.svg',
    color: 'Retro Slate & Navy',
    is_bestseller: true,
    is_active: true
  },
  {
    id: 4,
    name: 'TECHCARE PULSE ERGO PRO',
    slug: 'techcare-pulse-ergo-pro',
    tagline: 'WIRELESS ERGONOMIC MOUSE',
    description: 'Mouse nirkabel ultra-ringan 49 gram dengan kontur ergonomis yang mencegah ketegangan pergelangan tangan (RSI). Menggunakan sensor optik flagship PixArt PAW3395 26.000 DPI.',
    features: [
      'Bobot Ultra Ringan hanya 49 gram',
      'Sensor PixArt PAW3395 (26.000 DPI, 650 IPS)',
      'Optical Micro Switches 90 Juta Klik Anti Double-Click',
      'Daya tahan baterai hingga 100 jam non-stop'
    ],
    original_price: 1199000,
    price: 899000,
    discount_percentage: 25,
    stock: 35,
    collection_id: 2,
    collection_name: 'Peripherals & Audio',
    collection_slug: 'peripherals',
    image_url: '/images/products/mouse.svg',
    color: 'Stealth Black Matte',
    is_bestseller: true,
    is_active: true
  },
  {
    id: 5,
    name: 'TECHCARE VELOCITY X NVME 2TB',
    slug: 'techcare-velocity-x-nvme-2tb',
    tagline: 'HIGH SPEED STORAGE',
    description: 'SSD NVMe M.2 PCIe Gen 4.0 berkecepatan baca hingga 7.400 MB/s. Dilengkapi heatsink aluminium graphene untuk stabilitas transfer file berukuran puluhan gigabyte tanpa throttling.',
    features: [
      'Kecepatan Baca 7.400 MB/s, Tulis 6.800 MB/s',
      'Teknologi 3D TLC NAND Flash dengan DRAM Cache 2GB',
      'Pendingin Graphene Heatsink Kompatibel PS5 & PC',
      'Garansi Resmi TechCare 5 Tahun Rusak Ganti Baru'
    ],
    original_price: 2799000,
    price: 2199000,
    discount_percentage: 21,
    stock: 20,
    collection_id: 4,
    collection_name: 'Storage & Komponen',
    collection_slug: 'storage-components',
    image_url: '/images/products/ssd.svg',
    color: 'Graphene Black',
    is_bestseller: false,
    is_active: true
  }
];

export const initialCollections = [
  {
    id: 1,
    name: 'Laptop & PC',
    slug: 'laptop-pc',
    tagline: 'High Performance Computing',
    buttonText: 'LAPTOP & PC +'
  },
  {
    id: 2,
    name: 'Peripherals & Aksesoris',
    slug: 'peripherals',
    tagline: 'Keyboard, Mouse & Audio',
    buttonText: 'PERIPHERALS +'
  },
  {
    id: 3,
    name: 'Display & Monitor',
    slug: 'display-monitor',
    tagline: '4K & Ultrawide Productivity',
    buttonText: 'DISPLAY & MONITOR +'
  },
  {
    id: 4,
    name: 'Storage & Komponen',
    slug: 'storage-components',
    tagline: 'High Speed NVMe & Upgrades',
    buttonText: 'STORAGE & KOMPONEN +'
  }
];

// Available Promo Vouchers for Discount System
export const promoVouchers = [
  {
    code: 'TECHCARE10',
    name: 'Diskon Spesial 10%',
    type: 'percent',
    value: 10,
    maxDiscount: 500000,
    minPurchase: 500000,
    description: 'Diskon 10% hingga Rp 500.000 untuk semua perangkat IT.'
  },
  {
    code: 'HEMAT200K',
    name: 'Potongan Langsung 200 Ribu',
    type: 'fixed',
    value: 200000,
    minPurchase: 1000000,
    description: 'Potongan langsung Rp 200.000 minimal belanja Rp 1.000.000.'
  },
  {
    code: 'GAJIANPROMO',
    name: 'Promo Gajian Hemat 500K',
    type: 'fixed',
    value: 500000,
    minPurchase: 3000000,
    description: 'Potongan langsung Rp 500.000 khusus pembelian minimal Rp 3.000.000.'
  }
];
