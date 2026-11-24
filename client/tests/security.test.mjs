import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidEmail,
  isValidPhone,
  sanitizeText,
  hashPassword,
  verifyPassword
} from '../src/utils/security.js';

test('isValidEmail correctly identifies valid and invalid emails', () => {
  assert.strictEqual(isValidEmail('admin@techcare.id'), true);
  assert.strictEqual(isValidEmail('buyer@techcare.id'), true);
  assert.strictEqual(isValidEmail('user.test+demo@domain.co.id'), true);

  assert.strictEqual(isValidEmail(''), false);
  assert.strictEqual(isValidEmail('invalid-email'), false);
  assert.strictEqual(isValidEmail('@domain.com'), false);
  assert.strictEqual(isValidEmail('user@'), false);
});

test('isValidPhone validates Indonesian phone length and character sets', () => {
  assert.strictEqual(isValidPhone('081234567890'), true);
  assert.strictEqual(isValidPhone('+628123456789'), true);
  assert.strictEqual(isValidPhone('6289876543210'), true);

  assert.strictEqual(isValidPhone('123'), false); // Too short
  assert.strictEqual(isValidPhone('0812abc34567'), false); // Has letters
  assert.strictEqual(isValidPhone(''), false);
});

test('sanitizeText strips dangerous HTML tags and limits text length', () => {
  const dirty = '<script>alert("xss")</script>Halo TechCare';
  const clean = sanitizeText(dirty, 50);
  assert.ok(!clean.includes('<script>'), 'HTML script tags must be stripped');
  assert.ok(clean.includes('Halo TechCare'));

  const longText = 'A'.repeat(100);
  const truncated = sanitizeText(longText, 20);
  assert.strictEqual(truncated.length, 20);
});

test('hashPassword and verifyPassword work with salted SHA-256', async () => {
  const password = 'mypassword123';
  const hashed = await hashPassword(password);
  assert.ok(hashed.startsWith('sha256$'), 'Hash must follow sha256$ format');

  const matches = await verifyPassword(password, hashed);
  assert.strictEqual(matches, true);

  const wrongMatches = await verifyPassword('wrongpassword', hashed);
  assert.strictEqual(wrongMatches, false);
});
