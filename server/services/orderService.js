import pool from '../db/pool.js';

/**
 * Erstellt eine neue Bestellung in der Datenbank.
 */
export async function createOrder({ stripeSessionId, customerEmail, totalAmount, items }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Order erstellen
    const { rows: [order] } = await client.query(
      `INSERT INTO orders (stripe_session_id, customer_email, total_amount, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
      [stripeSessionId, customerEmail, totalAmount]
    );

    // Order Items erstellen
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_title, quantity, unit_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.productId, item.productTitle, item.quantity, item.unitPrice]
      );
    }

    await client.query('COMMIT');
    return order;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Setzt eine Bestellung auf "paid" und speichert die gelieferten Keys.
 */
export async function markOrderPaid(orderId, keysByProduct) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Order auf paid setzen
    await client.query(
      `UPDATE orders SET status = 'paid', paid_at = NOW() WHERE id = $1`,
      [orderId]
    );

    // Keys in den order_items speichern
    for (const { productId, keys } of keysByProduct) {
      await client.query(
        `UPDATE order_items SET keys_delivered = $1 
         WHERE order_id = $2 AND product_id = $3`,
        [keys, orderId, productId]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Findet eine Bestellung anhand der Stripe Session ID.
 */
export async function findOrderByStripeSession(stripeSessionId) {
  const { rows } = await pool.query(
    `SELECT * FROM orders WHERE stripe_session_id = $1`,
    [stripeSessionId]
  );
  return rows[0] || null;
}

/**
 * Findet eine Bestellung anhand der ID.
 */
export async function findOrderById(orderId) {
  const { rows } = await pool.query(
    `SELECT * FROM orders WHERE id = $1`,
    [orderId]
  );
  return rows[0] || null;
}

/**
 * Holt alle bezahlten Bestellungen für eine E-Mail-Adresse.
 */
export async function getOrdersByEmail(email) {
  const { rows: orders } = await pool.query(
    `SELECT o.id, o.total_amount, o.status, o.paid_at, o.created_at,
            json_agg(json_build_object(
              'product_title', oi.product_title,
              'quantity', oi.quantity,
              'unit_price', oi.unit_price,
              'keys_delivered', oi.keys_delivered
            ) ORDER BY oi.id) as items
     FROM orders o
     JOIN order_items oi ON oi.order_id = o.id
     WHERE o.customer_email = $1 AND o.status = 'paid'
     GROUP BY o.id
     ORDER BY o.created_at DESC`,
    [email]
  );
  return orders;
}

/**
 * Speichert einen Verifikationscode.
 */
export async function saveVerificationCode(email, code) {
  // Alte Codes für diese E-Mail löschen
  await pool.query(
    `DELETE FROM verification_codes WHERE email = $1`,
    [email]
  );
  
  // Neuen Code speichern (5 Minuten gültig)
  await pool.query(
    `INSERT INTO verification_codes (email, code, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '5 minutes')`,
    [email, code]
  );
}

/**
 * Verifiziert einen Code.
 */
export async function verifyCode(email, code) {
  const { rows } = await pool.query(
    `SELECT * FROM verification_codes 
     WHERE email = $1 AND code = $2 AND expires_at > NOW() AND used = false`,
    [email, code]
  );

  if (rows.length === 0) {
    return false;
  }

  // Code als verwendet markieren
  await pool.query(
    `UPDATE verification_codes SET used = true WHERE id = $1`,
    [rows[0].id]
  );

  return true;
}
