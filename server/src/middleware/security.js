/**
 * Security middleware & input validation helpers for TECHCARE Backend API
 */

function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.removeHeader('X-Powered-By');
  next();
}

/**
 * Simple in-memory rate limiter (anti brute-force untuk login/register/order)
 * Dilengkapi pembersihan berkala agar Map tidak menyebabkan memory leak.
 */
function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 30 } = {}) {
  const hits = new Map();

  const cleanup = () => {
    const now = Date.now();
    for (const [key, record] of hits.entries()) {
      if (now > record.resetAt) {
        hits.delete(key);
      }
    }
  };

  const interval = setInterval(cleanup, Math.min(windowMs, 5 * 60 * 1000));
  if (typeof interval.unref === 'function') {
    interval.unref();
  }

  return (req, res, next) => {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();

    if (hits.size > 10000) {
      cleanup();
    }

    const record = hits.get(ip);

    if (!record || now > record.resetAt) {
      hits.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    record.count += 1;
    if (record.count > max) {
      return res.status(429).json({
        success: false,
        message: 'Terlalu banyak percobaan. Silakan coba lagi beberapa menit kemudian.'
      });
    }
    return next();
  };
}

function sanitizeText(value, maxLength = 500) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function isPositiveInt(val, max = 1000) {
  const num = Number(val);
  return Number.isInteger(num) && num >= 1 && num <= max;
}

module.exports = {
  securityHeaders,
  createRateLimiter,
  sanitizeText,
  isValidEmail,
  isPositiveInt
};
