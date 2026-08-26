const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clothing_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
});

pool.on('connection', () => {
  console.log('✅ New MySQL connection established.');
});

let dbAvailable = false;

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connected successfully.');
    conn.release();
    dbAvailable = true;
  } catch (err) {
    console.warn('⚠️  MySQL unavailable — running in fallback (mock data) mode.');
    dbAvailable = false;
  }
}

function isDbAvailable() {
  return dbAvailable;
}

module.exports = { pool, testConnection, isDbAvailable };
