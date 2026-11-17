-- =============================================
-- TECHCARE IT E-Commerce Database Schema
-- MySQL 8.0+
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
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    tagline VARCHAR(150) NULL,
    description TEXT NULL,
    features JSON NULL,
    original_price DECIMAL(12, 2) NULL,
    price DECIMAL(12, 2) NOT NULL,
    discount_percentage INT DEFAULT 0,
    stock INT NOT NULL DEFAULT 20,
    collection_id INT NULL,
    image_url VARCHAR(255) NULL,
    gallery_urls JSON NULL,
    color VARCHAR(100) DEFAULT 'Space Grey',
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

-- 5. Orders (Supports Guest Checkout & Registered Customers)
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
    shipping_notes TEXT NULL,
    courier VARCHAR(100) DEFAULT 'JNE Reguler (Gratis Ongkir & Asuransi)',
    tracking_number VARCHAR(100) NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    shipping_cost DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(12, 2) NOT NULL,
    payment_method ENUM('bank_transfer', 'qris') NOT NULL DEFAULT 'bank_transfer',
    payment_status ENUM('pending', 'awaiting_verification', 'paid', 'rejected') NOT NULL DEFAULT 'pending',
    order_status ENUM('pending', 'processing', 'shipped', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    payment_proof_url VARCHAR(255) NULL,
    payment_notes TEXT NULL,
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

-- Default Admin Account (password: admin123)
INSERT INTO users (name, email, password_hash, role, phone)
VALUES ('TechCare Administrator', 'admin@novaire.com', '$2b$10$Y14KkW/K0i1tA6uQjTfg7e5jJ6h8gZ.tFq5k5jR0yCg7Qo0iL5pWW', 'admin', '081234567890')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Default Payment & Store Settings
INSERT INTO store_settings (setting_key, setting_value) VALUES
('bank_name', 'Bank Central Asia (BCA)'),
('bank_account_number', '8271039821'),
('bank_account_holder', 'PT TECHCARE SOLUSI TEKNOLOGI'),
('bank_instructions', 'Silakan transfer sesuai total tagihan pesanan ke rekening resmi TechCare.'),
('qris_merchant_name', 'PT TECHCARE SOLUSI TEKNOLOGI'),
('qris_image_url', '/images/qris-novaire.svg'),
('contact_whatsapp', '081234567890'),
('contact_email', 'care@techcare.id')
ON DUPLICATE KEY UPDATE setting_key=VALUES(setting_key);

-- Collections
INSERT INTO collections (id, name, slug, tagline, description) VALUES
(1, 'Laptop & PC', 'laptop-pc', 'High Performance Computing', 'Workstation dan laptop performa tinggi untuk developer, desainer, dan profesional.'),
(2, 'Peripherals & Audio', 'peripherals', 'Pro Mechanical & Wireless', 'Mechanical keyboard, gaming mouse ultra-lightweight, dan aksesoris produktivitas.'),
(3, 'Display & Monitor', 'display-monitor', '4K & Ultrawide Productivity', 'Layar monitor 4K dan curved ultrawide dengan akurasi warna tinggi.'),
(4, 'Storage & Komponen', 'storage-components', 'Ultra Fast NVMe & Accessories', 'SSD PCIe Gen4, RAM DDR5, docking hub, dan kartu ekspansi hardware.')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Products IT
INSERT INTO products (id, name, slug, tagline, description, features, original_price, price, discount_percentage, stock, collection_id, image_url, color, is_bestseller, is_active) VALUES
(1, 'TECHCARE TITAN PRO 16', 'techcare-titan-pro-16', 'ULTRABOOK WORKSTATION', 'Laptop performa tinggi dengan sasis aluminium unibody CNC, ditenagai prosesor Intel Core i9 Gen-14 & GPU RTX 4070. Layar OLED 3.2K 120Hz 100% DCI-P3.', JSON_ARRAY('Intel Core i9-14900H (14 Cores)', 'NVIDIA GeForce RTX 4070 8GB', '32GB LPDDR5X RAM', '1TB Gen4 PCIe NVMe SSD'), 26999000.00, 23499000.00, 13, 12, 1, '/images/products/laptop.svg', 'Space Titanium Grey', TRUE, TRUE),
(2, 'TECHCARE VISION ULTRA 34"', 'techcare-vision-ultra-34', '4K CURVED ULTRAWIDE', 'Monitor lengkung 34 inci 21:9 WQHD (3440 x 1440) dengan kurvatur 1500R alami. Port USB-C 90W Power Delivery.', JSON_ARRAY('UWQHD 3440 x 1440 IPS 165Hz', 'USB-C 90W PD & Dual HDMI 2.1', '99% sRGB / 95% DCI-P3', 'Built-in KVM Switch'), 8499000.00, 6999000.00, 18, 15, 3, '/images/products/monitor.svg', 'Matte Obsidian Black', TRUE, TRUE),
(3, 'TECHCARE APEX 75 WIRELESS', 'techcare-apex-75-wireless', 'GASKET MECHANICAL KEYBOARD', 'Keyboard mekanikal 75% kustom dengan konstruksi gasket mount 5-lapis peredam suara. Switch linear factory-lubed, kenop volume aluminium CNC.', JSON_ARRAY('Gasket Mount 5 Layer Foam', 'Tri-Mode Wireless / Bluetooth / Type-C', 'Hot-swappable 3/5-pin PCB', 'Keycaps PBT Doubleshot'), 1899000.00, 1499000.00, 21, 28, 2, '/images/products/keyboard.svg', 'Retro Slate & Navy', TRUE, TRUE),
(4, 'TECHCARE PULSE ERGO PRO', 'techcare-pulse-ergo-pro', 'WIRELESS ERGONOMIC MOUSE', 'Mouse nirkabel ultra-ringan 49 gram dengan kontur ergonomis yang mencegah ketegangan pergelangan tangan (RSI). Sensor optik PixArt PAW3395 26.000 DPI.', JSON_ARRAY('Ultra Ringan 49 gram', 'Sensor PixArt PAW3395 26.000 DPI', 'Optical Micro Switches 90 Juta Klik', 'Baterai 100 Jam Non-Stop'), 1199000.00, 899000.00, 25, 35, 2, '/images/products/mouse.svg', 'Stealth Black Matte', TRUE, TRUE),
(5, 'TECHCARE VELOCITY X NVME 2TB', 'techcare-velocity-x-nvme-2tb', 'HIGH SPEED STORAGE', 'SSD NVMe M.2 PCIe Gen 4.0 berkecepatan baca hingga 7.400 MB/s. Dilengkapi heatsink aluminium graphene.', JSON_ARRAY('Read 7.400 MB/s, Write 6.800 MB/s', '3D TLC NAND Flash + 2GB DRAM', 'Graphene Heatsink', 'Garansi Resmi 5 Tahun'), 2799000.00, 2199000.00, 21, 20, 4, '/images/products/ssd.svg', 'Graphene Black', FALSE, TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);
