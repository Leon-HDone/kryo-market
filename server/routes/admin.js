import { Router } from 'express';
import pool from '../db/pool.js';

const router = Router();

router.post('/keys', async (req, res) => {
  const adminToken = req.headers['x-admin-token'];
  if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { productId, keys } = req.body;
  if (!productId || !Array.isArray(keys) || keys.length === 0) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const insertValues = keys.map((k, idx) => `($1, $2, $${idx + 3})`).join(',');
    const values = [productId, 'available', ...keys];
    const query = `INSERT INTO product_keys (product_id, status, key_value) VALUES ${insertValues}`;
    await client.query(query, values);
    await client.query('COMMIT');
    res.json({ inserted: keys.length });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Admin key upload error:', err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    client.release();
  }
});

export default router;
