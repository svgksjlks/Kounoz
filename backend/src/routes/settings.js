const express = require('express');
const router = express.Router();
const { pool, isDbAvailable } = require('../db');

// Default in-memory settings
let storeSettings = {
  whatsapp_number: '01000943197',
  whatsapp_greeting: 'مرحباً، أود الاستفسار والطلب من متجر كنوز',
  store_phone: '01000943197',
  store_email: 'concierge@kounoz.sa',
};

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    if (isDbAvailable()) {
      const [rows] = await pool.query('SELECT `key`, `value` FROM settings');
      if (rows && rows.length > 0) {
        const dbSettings = { ...storeSettings };
        rows.forEach((row) => {
          dbSettings[row.key] = row.value;
        });
        return res.json({ success: true, data: dbSettings });
      }
    }
  } catch (err) {
    // If table doesn't exist or error, fallback to storeSettings
    console.warn('Database settings query error, using memory fallback:', err.message);
  }

  res.json({ success: true, data: storeSettings });
});

// POST / PUT /api/settings
router.post('/', async (req, res) => {
  const { whatsapp_number, whatsapp_greeting, store_phone, store_email } = req.body;

  if (whatsapp_number !== undefined) storeSettings.whatsapp_number = String(whatsapp_number).trim();
  if (whatsapp_greeting !== undefined) storeSettings.whatsapp_greeting = String(whatsapp_greeting).trim();
  if (store_phone !== undefined) storeSettings.store_phone = String(store_phone).trim();
  if (store_email !== undefined) storeSettings.store_email = String(store_email).trim();

  try {
    if (isDbAvailable()) {
      // Ensure settings table exists and update/insert
      await pool.query(`
        CREATE TABLE IF NOT EXISTS settings (
          \`key\` VARCHAR(100) PRIMARY KEY,
          \`value\` TEXT NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      for (const [key, value] of Object.entries(storeSettings)) {
        await pool.query(
          'INSERT INTO settings (\`key\`, \`value\`) VALUES (?, ?) ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`)',
          [key, String(value)]
        );
      }
    }
  } catch (err) {
    console.warn('Database settings save error, stored in memory fallback:', err.message);
  }

  res.json({
    success: true,
    message: 'تم حفظ الإعدادات بنجاح',
    data: storeSettings,
  });
});

module.exports = router;
