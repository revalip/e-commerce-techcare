const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function seed() {
  console.log('--- TECHCARE Database Migration & Seeder ---');
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASS || '';
  const database = process.env.DB_NAME || 'techcare';

  const adminPass = process.env.SEED_ADMIN_PASSWORD;
  const buyerPass = process.env.SEED_BUYER_PASSWORD;

  if (!adminPass || !buyerPass) {
    console.warn('[!] Set SEED_ADMIN_PASSWORD dan SEED_BUYER_PASSWORD di server/.env untuk seeding akun demo.');
    return;
  }

  let connection;
  try {
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    console.log(`[OK] Database '${database}' checked/created.`);
    await connection.changeUser({ database });

    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(sql);
      console.log('[OK] Schema and seed data successfully applied.');
    }

    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash(adminPass, salt);
    const buyerHash = await bcrypt.hash(buyerPass, salt);

    await connection.query(
      `
      INSERT INTO users (name, email, password_hash, role, phone)
      VALUES ('Admin TechCare', 'admin@techcare.id', ?, 'admin', '081234567890')
      ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = 'admin';
    `,
      [adminHash]
    );

    await connection.query(
      `
      INSERT INTO users (name, email, password_hash, role, phone)
      VALUES ('Budi Santoso', 'buyer@techcare.id', ?, 'customer', '081298765432')
      ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);
    `,
      [buyerHash]
    );

    console.log('[OK] Demo users ensured: admin@techcare.id & buyer@techcare.id');
    console.log('--- Migration & Seeding Completed Successfully! ---');
  } catch (err) {
    console.error('[Error] Seeding failed:', err.message);
  } finally {
    if (connection) await connection.end();
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;
