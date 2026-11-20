const { pool } = require('../config/db');
const { sanitizeText } = require('../middleware/security');

exports.getPaymentInfo = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT setting_key, setting_value FROM store_settings');
    const settings = {};
    rows.forEach((r) => {
      settings[r.setting_key] = r.setting_value;
    });

    return res.json({
      success: true,
      simulation: true,
      bank: {
        name: settings.bank_name || 'Bank Central Asia (BCA)',
        account_number: settings.bank_account_number || '8271039821',
        account_holder: settings.bank_account_holder || 'PT TECHCARE SOLUSI TEKNOLOGI',
        instructions:
          settings.bank_instructions ||
          'Transfer tepat sesuai total tagihan termasuk 3 digit kode unik dalam batas waktu 24 jam (Mode Simulasi).'
      },
      qris: {
        merchant_name: settings.qris_merchant_name || 'PT TECHCARE SOLUSI TEKNOLOGI',
        image_url: settings.qris_image_url || '/images/qris-techcare.svg'
      },
      contact: {
        whatsapp: settings.contact_whatsapp || '081234567890',
        email: settings.contact_email || 'care@techcare.id'
      }
    });
  } catch (error) {
    console.error('getPaymentInfo error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil informasi pembayaran.' });
  }
};

exports.updatePaymentSettings = async (req, res) => {
  try {
    const updates = {
      bank_name: req.body.bank_name !== undefined ? sanitizeText(req.body.bank_name, 100) : undefined,
      bank_account_number:
        req.body.bank_account_number !== undefined ? sanitizeText(req.body.bank_account_number, 50) : undefined,
      bank_account_holder:
        req.body.bank_account_holder !== undefined ? sanitizeText(req.body.bank_account_holder, 120) : undefined,
      bank_instructions:
        req.body.bank_instructions !== undefined ? sanitizeText(req.body.bank_instructions, 300) : undefined,
      qris_merchant_name:
        req.body.qris_merchant_name !== undefined ? sanitizeText(req.body.qris_merchant_name, 120) : undefined,
      contact_whatsapp:
        req.body.contact_whatsapp !== undefined ? sanitizeText(req.body.contact_whatsapp, 30) : undefined,
      contact_email:
        req.body.contact_email !== undefined ? sanitizeText(req.body.contact_email, 150) : undefined
    };

    if (req.file) {
      updates.qris_image_url = `/uploads/settings/${req.file.filename}`;
    }

    for (const [key, val] of Object.entries(updates)) {
      if (val !== undefined && val !== null) {
        await pool.query(
          `
          INSERT INTO store_settings (setting_key, setting_value)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
        `,
          [key, val]
        );
      }
    }

    return res.json({ success: true, message: 'Pengaturan pembayaran berhasil diperbarui.' });
  } catch (error) {
    console.error('updatePaymentSettings error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui pengaturan pembayaran.' });
  }
};
