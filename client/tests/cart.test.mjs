import test from 'node:test';
import assert from 'node:assert/strict';

// Helper functions mimicking Cart logic and Shipping Weight
function calculateItemPrice(basePrice, selectedRamDelta = 0, selectedSsdDelta = 0) {
  return Number(basePrice) + Number(selectedRamDelta) + Number(selectedSsdDelta);
}

function calculateSubtotal(items) {
  return items.reduce((sum, item) => {
    const itemPrice = calculateItemPrice(item.harga, item.ramPriceDelta, item.ssdPriceDelta);
    return sum + itemPrice * item.quantity;
  }, 0);
}

function calculateCartWeightGram(items) {
  return items.reduce((sum, item) => sum + (Number(item.beratGram) || 1000) * item.quantity, 0);
}

function getBillableWeightKg(weightGram) {
  return Math.max(1, Math.ceil(weightGram / 1000));
}

test('calculateItemPrice returns base price when no delta selected', () => {
  const price = calculateItemPrice(8250000, 0, 0);
  assert.strictEqual(price, 8250000);
});

test('calculateItemPrice correctly adds RAM and SSD deltas', () => {
  // MacBook Air M1 base 8.250.000 + 16GB (+1.100.000) + SSD 512GB (+550.000)
  const price = calculateItemPrice(8250000, 1100000, 550000);
  assert.strictEqual(price, 9900000);
});

test('calculateSubtotal sums multiple items correctly', () => {
  const items = [
    { harga: 8250000, ramPriceDelta: 0, ssdPriceDelta: 0, quantity: 1 },
    { harga: 7450000, ramPriceDelta: 750000, ssdPriceDelta: 0, quantity: 2 }
  ];
  // Item 1: 8.250.000 * 1 = 8.250.000
  // Item 2: (7.450.000 + 750.000) * 2 = 16.400.000
  // Total: 24.650.000
  assert.strictEqual(calculateSubtotal(items), 24650000);
});

test('calculateCartWeightGram and getBillableWeightKg calculates ceiling kg', () => {
  const items = [
    { beratGram: 1900, quantity: 1 } // 1900g -> 2kg billable
  ];
  const weight = calculateCartWeightGram(items);
  assert.strictEqual(weight, 1900);
  assert.strictEqual(getBillableWeightKg(weight), 2);
});

test('getBillableWeightKg floors minimum at 1kg', () => {
  assert.strictEqual(getBillableWeightKg(350), 1);
});
