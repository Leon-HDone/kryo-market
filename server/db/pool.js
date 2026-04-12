import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Verbindung testen
pool.on('connect', () => {
  console.log('✅ PostgreSQL verbunden');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL Fehler:', err.message);
});

export default pool;
