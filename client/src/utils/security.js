/**
 * ============================================================================
 * TECHCARE CLIENT SECURITY & VALIDATION UTILITIES
 * ============================================================================
 * - Password hashing berbasis Web Crypto API (SHA-256 + per-user random salt)
 *   untuk mode standalone/demo agar tidak pernah menyimpan password plaintext.
 * - Sanitasi teks & validasi input untuk mencegah XSS dan data cacat.
 */

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Fallback deterministic hash hanya bila SubtleCrypto tidak tersedia (misal HTTP non-localhost lama).
 * Pada browser modern (HTTPS / localhost), selalu memakai crypto.subtle.digest('SHA-256').
 */
function fallbackHash(str) {
  let h1 = 0xdeadbeef ^ str.length;
  let h2 = 0x41c6ce57 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(16, '0');
}

export function generateSalt(byteLength = 12) {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint8Array(byteLength);
    crypto.getRandomValues(arr);
    return bytesToHex(arr);
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function hashPassword(password, salt = null) {
  const usedSalt = salt || generateSalt();
  const payload = `techcare_v4::${usedSalt}::${String(password)}`;

  if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
    const data = new TextEncoder().encode(payload);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return `sha256$${usedSalt}$${bytesToHex(new Uint8Array(digest))}`;
  }

  return `fb$${usedSalt}$${fallbackHash(payload)}`;
}

export async function verifyPassword(password, storedHash) {
  if (!storedHash || typeof storedHash !== 'string') return false;
  const parts = storedHash.split('$');
  if (parts.length !== 3) return false;
  const [, salt] = parts;
  const recomputed = await hashPassword(password, salt);
  return recomputed === storedHash;
}

/**
 * Sanitasi teks input untuk menghilangkan tag HTML/script berbahaya (proteksi XSS)
 */
export function sanitizeText(value, maxLength = 500) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim()
    .slice(0, maxLength);
}

export function isValidEmail(email) {
  const clean = String(email || '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
}

export function isValidPhone(phone) {
  const digits = String(phone || '').replace(/[\s\-()+]/g, '');
  return /^\d{9,15}$/.test(digits);
}

export function isStrongPassword(password) {
  return String(password || '').trim().length >= 6;
}
