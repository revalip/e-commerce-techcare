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
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Hanya format gambar yang diizinkan (JPG, PNG, WEBP, GIF)!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: fileFilter
});

module.exports = {
  upload,
  uploadsDir
};
