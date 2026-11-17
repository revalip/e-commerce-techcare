const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function seed() {
  console.log('--- TECHCARE Database Migration & Seeder ---');
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = parseInt(process.env.DB_PORT || '3306');
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASS || '';
  const database = process.env.DB_NAME || 'techcare';

  let connection;
  try {
    // 1. Connect with multipleStatements enabled
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`[OK] Database '${database}' checked/created.`);
    await connection.changeUser({ database });

    // 2. Read and execute schema.sql in one go
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(sql);
      console.log('[OK] Schema and seed data successfully applied.');
    }

    // 3. Ensure admin account with valid bcrypt hash exists
    const adminPassword = 'admin123';
    const adminEmail = 'admin@novaire.com';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(adminPassword, salt);

    await connection.query(`
      INSERT INTO users (name, email, password_hash, role, phone)
      VALUES ('TechCare Administrator', ?, ?, 'admin', '081234567890')
      ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);
    `, [adminEmail, hash]);

    console.log(`[OK] Admin user ensured: ${adminEmail} (password: ${adminPassword})`);
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
