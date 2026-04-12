import { Router } from 'express';
import pool from '../db/pool.js';

const router = Router();

/**
 * GET /api/products
 * Gibt alle aktiven Produkte zurück (mit Verfügbarkeit).
 */
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*, 
             COALESCE(
               (SELECT COUNT(*) FROM product_keys pk 
                WHERE pk.product_id = p.id AND pk.status = 'available')::INTEGER, 
             0) as available_keys
      FROM products p
      WHERE p.active = true
      ORDER BY p.id ASC
    `);

    res.json({ products: rows });
  } catch (err) {
    console.error('❌ Products Fehler:', err);
    res.status(500).json({ error: 'Fehler beim Laden der Produkte.' });
  }
});

/**
 * GET /api/products/:id
 * Gibt ein einzelnes Produkt zurück.
 */
router.get('/:id', async (req, res) => {
  try {
    const { rows: [product] } = await pool.query(
      `SELECT p.*, 
              COALESCE(
                (SELECT COUNT(*) FROM product_keys pk 
                 WHERE pk.product_id = p.id AND pk.status = 'available')::INTEGER,
              0) as available_keys
       FROM products p
       WHERE p.id = $1 AND p.active = true`,
      [req.params.id]
    );

    if (!product) {
      return res.status(404).json({ error: 'Produkt nicht gefunden.' });
    }

    res.json({ product });
  } catch (err) {
    console.error('❌ Product Fehler:', err);
    res.status(500).json({ error: 'Fehler beim Laden des Produkts.' });
  }
});

export default router;
