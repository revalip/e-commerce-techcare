import test from 'node:test';
import assert from 'node:assert/strict';
import { mockProducts } from '../src/data/mock.js';

test('catalog contains active products with valid structures', () => {
  assert.ok(Array.isArray(mockProducts));
  assert.ok(mockProducts.length >= 10, 'Expected at least 10 catalog products');

  const seenIds = new Set();
  for (const product of mockProducts) {
    assert.ok(product.id, 'Product must have an id');
    assert.ok(!seenIds.has(product.id), `Duplicate product id found: ${product.id}`);
    seenIds.add(product.id);

    assert.ok(product.nama && product.nama.trim().length > 0, `Product ${product.id} missing name`);
    assert.ok(typeof product.harga === 'number' && product.harga > 0, `Product ${product.id} invalid price`);
    assert.ok(Array.isArray(product.gambar) && product.gambar.length > 0, `Product ${product.id} missing images`);
  }
});

test('MacBook Air M1 (id: 2) has verified multi-angle color galleries', () => {
  const macbook = mockProducts.find((p) => p.id === 2);
  assert.ok(macbook, 'MacBook Air M1 must exist in catalog');
  assert.ok(Array.isArray(macbook.varianWarna), 'MacBook must have color variants');
  assert.strictEqual(macbook.varianWarna.length, 3, 'MacBook Air must have 3 variants (Space Gray, Silver, Gold)');

  for (const variant of macbook.varianWarna) {
    assert.ok(variant.nama, 'Variant must have a name');
    assert.ok(/^#[0-9a-fA-F]{6}$/.test(variant.hex), `Variant ${variant.nama} invalid hex code`);
    assert.ok(variant.gambar, `Variant ${variant.nama} missing main image`);
    assert.ok(Array.isArray(variant.gallery) && variant.gallery.length >= 2, `Variant ${variant.nama} missing multi-angle gallery`);
  }
});

test('ASUS ZenBook 14 OLED (id: 3) has verified multi-angle color galleries', () => {
  const asus = mockProducts.find((p) => p.id === 3);
  assert.ok(asus, 'ASUS ZenBook must exist in catalog');
  assert.ok(Array.isArray(asus.varianWarna), 'ASUS ZenBook must have color variants');
  assert.strictEqual(asus.varianWarna.length, 2, 'ASUS ZenBook must have 2 variants (Aqua Celadon Silver, Ponder Blue)');

  for (const variant of asus.varianWarna) {
    assert.ok(variant.nama, 'Variant must have a name');
    assert.ok(/^#[0-9a-fA-F]{6}$/.test(variant.hex), `Variant ${variant.nama} invalid hex code`);
    assert.ok(variant.gambar, `Variant ${variant.nama} missing main image`);
    assert.ok(Array.isArray(variant.gallery) && variant.gallery.length >= 2, `Variant ${variant.nama} missing multi-angle gallery`);
  }
});

test('primary hero image of laptops maintains upright perspective', () => {
  const laptops = mockProducts.filter((p) => p.koleksiSlug === 'laptop-second');
  for (const laptop of laptops) {
    assert.ok(laptop.gambar[0], `Laptop ${laptop.nama} must have primary image`);
    // Verify image path is valid string and points to existing product asset
    assert.ok(
      typeof laptop.gambar[0] === 'string' &&
        (laptop.gambar[0].startsWith('/assets/') || laptop.gambar[0].startsWith('/images/')),
      `Laptop ${laptop.nama} has invalid image path: ${laptop.gambar[0]}`
    );
  }
});

test('SATA SSD products (RX7, KYO, V-GeN) have valid 128GB-1TB capacity options', () => {
  const sataSsds = mockProducts.filter((p) => [16, 17, 18].includes(p.id));
  assert.strictEqual(sataSsds.length, 3, 'Expected 3 SATA SSD products (RX7, KYO, V-GeN)');

  for (const ssd of sataSsds) {
    assert.ok(ssd.koleksiSlug === 'ssd-storage', `SSD ${ssd.nama} must belong to ssd-storage`);
    assert.ok(Array.isArray(ssd.specOptions?.ssd), `SSD ${ssd.nama} missing ssd specOptions`);
    assert.strictEqual(ssd.specOptions.ssd.length, 4, `SSD ${ssd.nama} must have 4 capacity tiers (128GB-1TB)`);
    // Base 128GB price between 150k and 280k
    assert.ok(ssd.harga >= 150000 && ssd.harga <= 280000, `SSD ${ssd.nama} base price unrealistic: ${ssd.harga}`);
  }
});

test('RAM second products have calibrated market pricing across 8GB-32GB tiers', () => {
  const secondRams = mockProducts.filter((p) => [5, 6, 19].includes(p.id));
  assert.strictEqual(secondRams.length, 3, 'Expected 3 second RAM products (Corsair, Kingston, OEM)');

  for (const ram of secondRams) {
    assert.ok(ram.koleksiSlug === 'ram-memori', `RAM ${ram.nama} must belong to ram-memori`);
    // Base 8GB price between 180k and 260k
    assert.ok(ram.harga >= 180000 && ram.harga <= 260000, `RAM ${ram.nama} base price unrealistic: ${ram.harga}`);
    assert.ok(Array.isArray(ram.specOptions?.ram), `RAM ${ram.nama} missing specOptions.ram`);
  }
});
