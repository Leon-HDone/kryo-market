import pool from '../db/pool.js';

/**
 * Reserviert N verfügbare Keys für ein Produkt.
 * Keys werden 30 Minuten lang reserviert (für Checkout-Fenster).
 */
export async function reserveKeys(productId, quantity, orderId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Verfügbare Keys holen und sperren (FOR UPDATE verhindert Race Conditions)
    const { rows } = await client.query(
      `UPDATE product_keys 
       SET status = 'reserved', reserved_at = NOW(), order_id = $3
       WHERE id IN (
         SELECT id FROM product_keys 
         WHERE product_id = $1 AND status = 'available'
         ORDER BY id ASC
         LIMIT $2
         FOR UPDATE SKIP LOCKED
       )
       RETURNING id, key_value`,
      [productId, quantity, orderId]
    );

    if (rows.length < quantity) {
      // Nicht genug Keys verfügbar → Rollback
      await client.query('ROLLBACK');
      return { success: false, error: 'Nicht genügend Keys verfügbar', reserved: rows.length, requested: quantity };
    }

    await client.query('COMMIT');
    return { success: true, keys: rows };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Bestätigt reservierte Keys als verkauft (nach erfolgreicher Zahlung).
 */
export async function confirmKeys(orderId) {
  const { rows } = await pool.query(
    `UPDATE product_keys 
     SET status = 'sold', sold_at = NOW() 
     WHERE order_id = $1 AND status = 'reserved'
     RETURNING id, key_value, product_id`,
    [orderId]
  );
  return rows;
}

/**
 * Gibt reservierte Keys frei (bei Checkout-Abbruch oder Timeout).
 */
export async function releaseKeys(orderId) {
  await pool.query(
    `UPDATE product_keys 
     SET status = 'available', reserved_at = NULL, order_id = NULL 
     WHERE order_id = $1 AND status = 'reserved'`,
    [orderId]
  );
}

/**
 * Gibt gelieferte Keys für eine Bestellung zurück.
 */
export async function getKeysByOrder(orderId) {
  const { rows } = await pool.query(
    `SELECT pk.key_value, pk.product_id, p.title as product_title
     FROM product_keys pk
     JOIN products p ON p.id = pk.product_id
     WHERE pk.order_id = $1 AND pk.status = 'sold'
     ORDER BY pk.product_id, pk.id`,
    [orderId]
  );
  return rows;
}

/**
 * Prüft die Verfügbarkeit von Keys für ein Produkt.
 */
export async function checkAvailability(productId) {
  const { rows } = await pool.query(
    `SELECT COUNT(*) as count FROM product_keys 
     WHERE product_id = $1 AND status = 'available'`,
    [productId]
  );
  return parseInt(rows[0].count);
}

/**
 * Bereinigt abgelaufene Reservierungen (älter als 30 Minuten).
 * Wird periodisch aufgerufen.
 */
export async function cleanupExpiredReservations() {
  const { rowCount } = await pool.query(
    `UPDATE product_keys 
     SET status = 'available', reserved_at = NULL, order_id = NULL
     WHERE status = 'reserved' AND reserved_at < NOW() - INTERVAL '30 minutes'`
  );
  if (rowCount > 0) {
    console.log(`🔄 ${rowCount} abgelaufene Reservierungen freigegeben`);
  }
  
  // Auch die dazugehörigen Orders auf expired setzen
  await pool.query(
    `UPDATE orders SET status = 'expired' 
     WHERE status = 'pending' AND created_at < NOW() - INTERVAL '30 minutes'`
  );
}
