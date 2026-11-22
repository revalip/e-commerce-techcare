const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../../uploads');
const productsDir = path.join(uploadsDir, 'products');
const proofsDir = path.join(uploadsDir, 'proofs');
const settingsDir = path.join(uploadsDir, 'settings');

[uploadsDir, productsDir, proofsDir, settingsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const ALLOWED_MIME_TO_EXT = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif']
]);
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

// Storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'payment_proof') {
      cb(null, proofsDir);
    } else if (file.fieldname === 'qris_image') {
      cb(null, settingsDir);
    } else {
      cb(null, productsDir);
    }
  },
  filename: function (req, file, cb) {
    const safeExt = ALLOWED_MIME_TO_EXT.get(file.mimetype) || '.jpg';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + safeExt);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || '').toLowerCase();
  const isValidMime = ALLOWED_MIME_TO_EXT.has(file.mimetype);
  const isValidExt = ALLOWED_EXTENSIONS.has(ext);

  if (isValidMime && isValidExt) {
    return cb(null, true);
  }
  const err = new Error('Hanya format gambar yang diizinkan (JPG, PNG, WEBP, GIF).');
  err.status = 400;
  return cb(err);
};

/**
 * Verifikasi magic bytes file gambar agar file non-gambar yang diganti ekstensinya tetap ditolak.
 */
function verifyImageMagicBytes(filePath) {
  let fd;
  try {
    fd = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(12);
    const bytesRead = fs.readSync(fd, buf, 0, 12, 0);
    if (bytesRead < 4) return false;

    // JPEG: FF D8 FF
    if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      bytesRead >= 8 &&
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47 &&
      buf[4] === 0x0d &&
      buf[5] === 0x0a &&
      buf[6] === 0x1a &&
      buf[7] === 0x0a
    ) {
      return true;
    }
    // GIF: GIF87a / GIF89a
    if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return true;
    // WEBP: RIFF....WEBP
    if (
      bytesRead >= 12 &&
      buf.toString('ascii', 0, 4) === 'RIFF' &&
      buf.toString('ascii', 8, 12) === 'WEBP'
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  } finally {
    if (fd !== undefined) {
      try {
        fs.closeSync(fd);
      } catch {
        // ignore close errors
      }
    }
  }
}

function safeUnlink(filePath) {
  if (!filePath) return;
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // ignore cleanup errors
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: fileFilter
});

module.exports = {
  upload,
  uploadsDir,
  proofsDir,
  verifyImageMagicBytes,
  safeUnlink
};
