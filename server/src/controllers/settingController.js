const { pool } = require('../config/db');

exports.getPaymentInfo = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT setting_key, setting_value FROM store_settings');
    const settings = {};
    rows.forEach(r => {
      settings[r.setting_key] = r.setting_value;
    });

    return res.json({
      success: true,
      bank: {
        name: settings.bank_name || 'Bank Central Asia (BCA)',
        account_number: settings.bank_account_number || '8271039821',
        account_holder: settings.bank_account_holder || 'PT NOVAIRE INDONESIA',
        instructions: settings.bank_instructions || 'Silakan transfer sesuai total nominal pesanan.'
      },
      qris: {
        merchant_name: settings.qris_merchant_name || 'NOVAIRE OFFICIAL INDONESIA',
        image_url: settings.qris_image_url || '/uploads/settings/qris-dummy.png'
      },
      contact: {
        whatsapp: settings.contact_whatsapp || '081234567890',
        email: settings.contact_email || 'support@novaire.com'
      }
    });
  } catch (error) {
    console.error('getPaymentInfo error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil informasi pembayaran: ' + error.message });
  }
};

exports.updatePaymentSettings = async (req, res) => {
  try {
    const {
      bank_name,
      bank_account_number,
      bank_account_holder,
      bank_instructions,
      qris_merchant_name,
      contact_whatsapp,
      contact_email
    } = req.body;

    const updates = {
      bank_name,
      bank_account_number,
      bank_account_holder,
      bank_instructions,
      qris_merchant_name,
      contact_whatsapp,
      contact_email
    };

    if (req.file) {
      updates.qris_image_url = `/uploads/settings/${req.file.filename}`;
    }

    for (const [key, val] of Object.entries(updates)) {
      if (val !== undefined && val !== null) {
        await pool.query(`
          INSERT INTO store_settings (setting_key, setting_value)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
        `, [key, val]);
      }
    }

    return res.json({ success: true, message: 'Pengaturan pembayaran berhasil diperbarui.' });
  } catch (error) {
    console.error('updatePaymentSettings error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui pengaturan: ' + error.message });
  }
};
