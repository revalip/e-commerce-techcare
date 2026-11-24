-- =============================================
-- TECHCARE IT E-Commerce Database Schema
-- Compatible with MySQL 8.0+ / TiDB Cloud / MariaDB
-- =============================================

CREATE DATABASE IF NOT EXISTS techcare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE techcare;

-- 1. Users Table (Admin & Customers)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    phone VARCHAR(50) NULL,
    address TEXT NULL,
    city VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Collections / Categories
CREATE TABLE IF NOT EXISTS collections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    tagline VARCHAR(150) NULL,
    description TEXT NULL,
    image_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Products
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(80) NOT NULL DEFAULT 'TECHCARE',
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    tagline VARCHAR(150) NULL,
    description TEXT NULL,
    features JSON NULL,
    original_price DECIMAL(12, 2) NULL,
    price DECIMAL(12, 2) NOT NULL,
    discount_percentage INT DEFAULT 0,
    stock INT NOT NULL DEFAULT 10,
    weight_gram INT NOT NULL DEFAULT 1000,
    collection_id INT NULL,
    image_url VARCHAR(255) NULL,
    gallery_urls JSON NULL,
    color VARCHAR(100) DEFAULT 'Matte Black',
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Store Payment Settings
CREATE TABLE IF NOT EXISTS store_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Orders (Full Lifecycle: pending -> paid -> processing -> shipped -> completed / cancelled)
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id INT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(191) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_postal_code VARCHAR(20) NULL,
    shipping_zone VARCHAR(100) DEFAULT 'Jabodetabek',
    shipping_notes TEXT NULL,
    courier VARCHAR(120) DEFAULT 'JNE Reguler + Asuransi',
    total_weight_gram INT NOT NULL DEFAULT 1000,
    tracking_number VARCHAR(100) NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    shipping_cost DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    unique_code INT NOT NULL DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,
    payment_method ENUM('bank_transfer', 'qris') NOT NULL DEFAULT 'bank_transfer',
    payment_status ENUM('pending', 'awaiting_verification', 'paid', 'rejected') NOT NULL DEFAULT 'pending',
    order_status ENUM('pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    payment_proof_url VARCHAR(255) NULL,
    payment_notes TEXT NULL,
    payment_deadline TIMESTAMP NULL,
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NULL,
    product_name VARCHAR(150) NOT NULL,
    product_price DECIMAL(12, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    subtotal DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- SEED INITIAL TECHCARE DATA
-- =============================================

INSERT INTO store_settings (setting_key, setting_value) VALUES
('bank_name', 'Bank Central Asia (BCA)'),
('bank_account_number', '8271039821'),
('bank_account_holder', 'PT TECHCARE SOLUSI TEKNOLOGI'),
('bank_instructions', 'Transfer tepat sesuai total tagihan termasuk kode unik 3 digit (Simulasi Pembayaran).'),
('qris_merchant_name', 'PT TECHCARE SOLUSI TEKNOLOGI'),
('qris_image_url', '/images/qris-techcare.svg'),
('contact_whatsapp', '081234567890'),
('contact_email', 'care@techcare.id')
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);

INSERT INTO collections (id, name, slug, tagline, description, image_url) VALUES
(1, 'Laptop Second', 'laptop-second', 'ThinkPad, MacBook Air, ZenBook & Dell < 10 Juta', 'Laptop bisnis & produktivitas second lulus 32 titik QC.', '/images/products/thinkpad-x1-carbon-front.jpg'),
(2, 'RAM & Memori', 'ram-memori', 'Corsair Vengeance & Kingston FURY DDR4/DDR5 Tested', 'RAM PC & Laptop tested MemTest86 0-error.', '/images/products/corsair-vengeance-ram.jpg'),
(3, 'SSD & Storage', 'ssd-storage', 'Samsung NVMe PCIe Gen4 Health 97%+', 'SSD NVMe kencang dengan laporan kesehatan CrystalDiskInfo.', '/images/products/samsung-990-pro-heatsink.png'),
(4, 'Monitor Second', 'display-monitor', 'LG UltraGear & MSI Curved Bebas Dead Pixel', 'Monitor IPS & Ultrawide untuk kerja, desain, dan gaming.', '/images/products/lg-ultragear-27-ips.jpg'),
(5, 'Peripherals Second', 'peripherals', 'Logitech MX/Superlight, Fantech & ASUS ROG', 'Mouse dan keyboard mekanikal second higienis & bergaransi.', '/images/products/logitech-mx-master-3s-graphite.png')
ON DUPLICATE KEY UPDATE name=VALUES(name), tagline=VALUES(tagline);

INSERT INTO products (id, brand, name, slug, tagline, description, features, original_price, price, discount_percentage, stock, weight_gram, collection_id, image_url, color, is_bestseller, is_active) VALUES
(1, 'LENOVO THINKPAD', 'Lenovo ThinkPad X1 Carbon Gen 9', 'lenovo-thinkpad-x1-carbon-gen-9', 'ULTRABOOK BISNIS CARBON • GRADE A+', 'Laptop bisnis flagship bekas korporat dengan bodi carbon fiber super ringan, lulus 32 titik QC teknisi TECHCARE.', JSON_ARRAY('Intel Core i5-1145G7 vPro', 'Layar 14" FHD+ IPS 16:10', 'Grade A+ Mulus 97%', 'Garansi Toko 60 Hari'), 9500000.00, 7850000.00, 17, 5, 1850, 1, '/images/products/thinkpad-x1-carbon-front.jpg', 'Carbon Matte Black', TRUE, TRUE),
(2, 'ASUS', 'ASUS ZenBook 14 OLED UX3402', 'asus-zenbook-14-oled-ux3402', '2.8K OLED ULTRABOOK • GRADE A', 'Ultrabook tipis layar 2.8K OLED 90Hz Pantone Validated, bebas burn-in dan sudah repasta baru.', JSON_ARRAY('Intel Core i5-1240P Gen-12', 'Layar 14" 2.8K OLED 90Hz', 'Audio Harman Kardon', 'Garansi Toko 60 Hari'), 8950000.00, 7450000.00, 17, 6, 1900, 1, '/images/products/asus-zenbook-14-oled.jpg', 'Aqua Celadon Silver', TRUE, TRUE),
(3, 'LOGITECH', 'Logitech MX Master 3S Wireless', 'logitech-mx-master-3s-second', 'PRODUCTIVITY MOUSE • GRADE A+', 'Mouse produktivitas favorit programmer dengan MagSpeed Scroll, anti double-click, dan ultrasonic sanitized.', JSON_ARRAY('Sensor Darkfield 8.000 DPI', 'Quiet Clicks + Logi Bolt', 'Baterai Sehat 85%+', 'Garansi Toko 30 Hari'), 1689000.00, 1090000.00, 35, 11, 320, 5, '/images/products/logitech-mx-master-3s-graphite.png', 'Graphite Black', TRUE, TRUE),
(4, 'FANTECH', 'Fantech MAXFIT81 Frost Wireless', 'fantech-maxfit81-frost-second', '75% GASKET OLED KEYBOARD • GRADE A+', 'Keyboard mekanikal 75% gasket mount dengan layar OLED mini & rotary knob dalam kondisi second sangat terawat.', JSON_ARRAY('OLED 1" + Knob Aluminium', 'Tri-Mode Wireless/BT/USB-C', 'Hot-Swap 5-Pin PCB', 'Garansi Toko 30 Hari'), 1150000.00, 740000.00, 36, 12, 1150, 5, '/images/products/fantech-maxfit81-frost.webp', 'Frost White PBT', FALSE, TRUE),
(5, 'MSI', 'MSI MAG 341CQP 34" Curved Ultrawide', 'msi-mag-341cqp-34-curved-second', '34" UWQHD 175HZ CURVED • GRADE A+', 'Monitor lengkung ultrawide MSI 34 inci 175Hz bekas studio editing, lulus uji warna dan bebas dead pixel.', JSON_ARRAY('UWQHD 3440x1440 175Hz', 'USB-C PD + KVM Switch', '0 Dead Pixel & Bebas Burn-In', 'Garansi Toko 60 Hari'), 9850000.00, 7650000.00, 22, 3, 6800, 4, '/images/products/msi-mag-341cqp-qd-oled.webp', 'Metallic Obsidian Black', FALSE, TRUE),
(6, 'KINGSTON FURY', 'Kingston FURY Impact Laptop SODIMM RAM', 'kingston-fury-impact-sodimm-ram', 'PERFORMANCE GAMING SODIMM • INTEL XMP & RYZEN READY', 'Modul memori laptop performa tinggi Kingston FURY Impact SODIMM 3200MT/s CL20-22-22 Plug N Play 1.2V hemat daya.', JSON_ARRAY('SODIMM DDR4 3200MT/s CL20', 'Timing CL20-22-22 @ 1.2V', 'Intel XMP & Ryzen Ready', 'Garansi Tukar Unit 90 Hari'), 620000.00, 512000.00, 17, 24, 150, 2, '/assets/products/kingston-fury-impact.jpg', 'FURY Stealth Black', FALSE, TRUE),
(20, 'FORESEE', 'Foresee OEM M.2 NVMe PCIe SSD (Copotan Laptop Second)', 'foresee-oem-m2-nvme-ssd-second', 'SSD NVMe OEM COPOTAN LAPTOP • HEALTH 100%', 'SSD M.2 NVMe PCIe OEM Foresee original copotan laptop Lenovo, HP, ASUS saat upgrade, CrystalDiskInfo Health 99-100%.', JSON_ARRAY('PCIe 3.0 x4 M.2 2280 NVMe', 'CrystalDiskInfo Health 99-100%', 'Read 2100MB/s Write 1200MB/s', 'Garansi Toko 60 Hari'), 435000.00, 350000.00, 20, 28, 50, 3, '/assets/products/foresee-nvme-ssd.jpg', 'OEM Factory Matte PCB', TRUE, TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), stock=VALUES(stock);
