const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'techcare',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true
};

let pool = mysql.createPool(dbConfig);
let isConnected = false;

async function checkDbConnection() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    isConnected = true;
    console.log(`[DB] Berhasil terhubung ke database MySQL '${dbConfig.database}'`);
    return true;
  } catch (err) {
    isConnected = false;
    console.warn(`[DB] Peringatan koneksi database: ${err.message}`);
    return false;
  }
}

module.exports = {
  pool,
  checkDbConnection,
  isDbConnected: () => isConnected
};
