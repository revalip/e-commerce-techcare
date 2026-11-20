/**
 * Automated Verification Suite for TECHCARE E-Commerce
 * Tests:
 * 1. Client security utilities (SHA-256 + salt password hash, XSS sanitization, email/phone validation)
 * 2. Local shipping tariff engine (JNE / J&T / SiCepat / Workshop x 8 regions x weight kg + free promo)
 * 3. Format utilities (IDR, weight, countdown, all 6+ order status badges)
 * 4. Mock catalog integrity (all 5 required brands present, weights valid, prices < 10jt, images exist)
 * 5. Server module syntax & security middleware validation
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

import {
  hashPassword,
  verifyPassword,
  sanitizeText,
  isValidEmail,
  isValidPhone,
  isStrongPassword
} from '../client/src/utils/security.js';

import {
  SHIPPING_ZONES,
  COURIERS,
  calculateCartWeightGram,
  getBillableWeightKg,
  calculateShippingCost,
  getShippingOptions
} from '../client/src/data/shipping.js';

import {
  formatIDR,
  formatWeight,
  getRemainingTime,
  getStatusBadge
} from '../client/src/utils/format.js';

import { mockProducts, mockCollections, mockDiscounts, mockOrders } from '../client/src/data/mock.js';

const require = createRequire(import.meta.url);
const serverSecurity = require('../server/src/middleware/security.js');

let passed = 0;
async function test(name, fn) {
  try {
    await fn();
    passed += 1;
    console.log(`  [PASS] ${name}`);
  } catch (err) {
    console.error(`  [FAIL] ${name}`);
    console.error('        ', err.message);
    process.exitCode = 1;
  }
}

console.log('=== TECHCARE Automated Test Suite ===\n');

// 1. Security Utils
await test('Password hashing menghasilkan SHA-256 salted hash & terverifikasi benar', async () => {
  const hash = await hashPassword('Rahasia123');
  assert.ok(hash.startsWith('sha256$'), 'Hash harus menggunakan prefix sha256$');
  assert.equal(await verifyPassword('Rahasia123', hash), true);
  assert.equal(await verifyPassword('Salah123', hash), false);
});

await test('Precomputed demo admin & buyer hashes cocok dengan password demo', async () => {
  const adminHash = 'sha256$tcadm9021a7c4f1$be194f414834a9f2deb9e0c127228b4c2ecf70ee0c3333cf3dcb9ab1ce50a1e6';
  const buyerHash = 'sha256$tcbuy4418d9e2b3$e423c6f5ef967e78b42f59c2db68585dc1c43a0b8df954e0ddd23ca3029965fc';
  assert.equal(await verifyPassword('admin123', adminHash), true);
  assert.equal(await verifyPassword('buyer123', buyerHash), true);
});

await test('Sanitasi XSS & validasi input berjalan ketat', () => {
  assert.equal(sanitizeText('<script>alert(1)</script>Halo'), 'scriptalert(1)/scriptHalo');
  assert.equal(sanitizeText('javascript:alert(1)'), 'alert(1)');
  assert.equal(isValidEmail('budi@techcare.id'), true);
  assert.equal(isValidEmail('bukan-email'), false);
  assert.equal(isValidPhone('081234567890'), true);
  assert.equal(isValidPhone('12345'), false);
  assert.equal(isStrongPassword('123456'), true);
  assert.equal(isStrongPassword('123'), false);
});

// 2. Shipping Engine
await test('Tabel ongkir lokal mencakup 8 wilayah dan kurir JNE, J&T, SiCepat, Workshop', () => {
  assert.ok(SHIPPING_ZONES.length >= 8);
  const codes = COURIERS.map((c) => c.code);
  assert.ok(codes.includes('JNE'));
  assert.ok(codes.includes('J&T'));
  assert.ok(codes.includes('SiCepat'));
  assert.ok(codes.includes('PICKUP'));
});

await test('Kalkulasi berat & ongkir meningkat sesuai berat (kg) dan jarak wilayah', () => {
  const weight = calculateCartWeightGram([{ beratGram: 1850, jumlah: 1 }, { beratGram: 320, jumlah: 1 }]);
  assert.equal(weight, 2170);
  assert.equal(getBillableWeightKg(weight), 3);

  const jkt = calculateShippingCost({ courierId: 'jne_reg', zoneId: 'jabodetabek', totalWeightGram: 2170, subtotal: 1000000 });
  const papua = calculateShippingCost({ courierId: 'jne_reg', zoneId: 'sulawesi_papua', totalWeightGram: 2170, subtotal: 1000000 });
  assert.equal(jkt.weightKg, 3);
  assert.ok(papua.cost > jkt.cost, 'Ongkir Papua harus lebih mahal dari Jabodetabek');

  const freePromo = calculateShippingCost({ courierId: 'jnt_ez', zoneId: 'jabodetabek', totalWeightGram: 2000, subtotal: 6000000 });
  assert.equal(freePromo.cost, 0);
  assert.equal(freePromo.isFreePromo, true);

  const opts = getShippingOptions({ zoneId: 'jatim', totalWeightGram: 1500, subtotal: 2000000 });
  assert.equal(opts.length, COURIERS.length);
});

// 3. Formatting & Order Statuses
await test('Format IDR, berat, countdown, dan 6 status pesanan utama lengkap', () => {
  assert.ok(formatIDR(7850000).includes('7.850.000'));
  assert.equal(formatWeight(1850), '1.9 kg');
  assert.equal(formatWeight(350), '350 gram');

  const future = new Date(Date.now() + 3661 * 1000).toISOString();
  const rem = getRemainingTime(future);
  assert.equal(rem.expired, false);
  assert.ok(rem.hours >= 1);

  for (const st of ['pending', 'awaiting_verification', 'paid', 'processing', 'shipped', 'completed', 'cancelled']) {
    const badge = getStatusBadge(st);
    assert.ok(badge.label && badge.bg);
  }
});

// 4. Catalog Integrity
await test('Katalog demo mencakup 5 brand utama (ASUS, Logitech, Lenovo, Fantech, MSI) & semua gambar tersedia', () => {
  const brandsJoined = mockProducts.map((p) => p.brand.toUpperCase()).join(' ');
  for (const requiredBrand of ['ASUS', 'LOGITECH', 'LENOVO', 'FANTECH', 'MSI']) {
    assert.ok(brandsJoined.includes(requiredBrand), `Brand ${requiredBrand} wajib ada di katalog`);
  }

  for (const p of mockProducts) {
    assert.ok(p.beratGram > 0, `Produk ${p.nama} harus punya beratGram`);
    assert.ok(p.harga > 0 && p.harga < 10000000, `Harga ${p.nama} harus valid < 10jt`);
    for (const img of p.gambar) {
      const absImg = path.join(process.cwd(), 'client', 'public', img.replace(/^\//, ''));
      assert.ok(fs.existsSync(absImg), `File gambar tidak ditemukan: ${img}`);
    }
  }

  assert.ok(fs.existsSync(path.join(process.cwd(), 'client', 'public', 'images', 'qris-techcare.svg')));
  assert.ok(mockCollections.length >= 5);
  assert.ok(mockDiscounts.length >= 3);
  assert.ok(mockOrders.length >= 3);
});

// 5. Server Security Middleware Check
await test('Server security helpers memvalidasi positive integer & sanitasi', () => {
  assert.equal(serverSecurity.isPositiveInt(3, 50), true);
  assert.equal(serverSecurity.isPositiveInt(-5, 50), false);
  assert.equal(serverSecurity.isPositiveInt(0, 50), false);
  assert.equal(serverSecurity.isPositiveInt(1.5, 50), false);
  assert.equal(serverSecurity.isValidEmail('admin@techcare.id'), true);
  assert.equal(serverSecurity.sanitizeText('<b>Test</b>'), 'bTest/b');
});

console.log(`\nTotal lulus: ${passed} pengujian.`);
if (process.exitCode && process.exitCode !== 0) {
  process.exit(1);
}
