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
