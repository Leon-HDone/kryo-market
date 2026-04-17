import { Router } from 'express';
import Stripe from 'stripe';
import pool from '../db/pool.js';
import { reserveKeys, checkAvailability } from '../services/keyService.js';
import { createOrder } from '../services/orderService.js';

const router = Router();

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

/**
 * POST /api/checkout/create-session
 * Erstellt eine Stripe Checkout Session und reserviert Keys.
 */
router.post('/create-session', async (req, res) => {
  try {
    const { email, items } = req.body;

    // Validierung
    if (!email || !items || items.length === 0) {
      return res.status(400).json({ error: 'E-Mail und Produkte sind erforderlich.' });
    }

    // E-Mail-Format prüfen
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Ungültige E-Mail-Adresse.' });
    }

    // Produkte aus DB laden und Verfügbarkeit prüfen
    const lineItems = [];
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      // Produkt aus DB holen
      const { rows: [product] } = await pool.query(
        'SELECT * FROM products WHERE id = $1 AND active = true',
        [item.productId]
      );

      if (!product) {
        return res.status(400).json({ error: `Produkt ID ${item.productId} nicht gefunden.` });
      }

      // Verfügbarkeit prüfen
      const available = await checkAvailability(item.productId);
      if (available < item.quantity) {
        return res.status(400).json({ 
          error: `Nicht genügend "${product.title}" auf Lager. Verfügbar: ${available}` 
        });
      }

      const unitPrice = parseFloat(product.price_min);
      totalAmount += unitPrice * item.quantity;

      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: product.title },
          unit_amount: Math.round(unitPrice * 100), // In Cent
        },
        quantity: item.quantity,
      });

      orderItems.push({
        productId: product.id,
        productTitle: product.title,
        quantity: item.quantity,
        unitPrice,
      });
    }

    // Stripe Check
    if (!stripe) {
      // Dev-Modus: Simulierte Session
      console.warn('⚠️ STRIPE_SECRET_KEY nicht gesetzt – simuliere Checkout');
      
      const order = await createOrder({
        stripeSessionId: `sim_${Date.now()}`,
        customerEmail: email,
        totalAmount,
        items: orderItems,
      });

      // Keys reservieren
      for (const item of orderItems) {
        const result = await reserveKeys(item.productId, item.quantity, order.id);
        if (!result.success) {
          return res.status(400).json({ error: result.error });
        }
      }

      return res.json({ 
        sessionUrl: `/checkout/success?session_id=sim_${Date.now()}&order_id=${order.id}`,
        simulated: true,
        orderId: order.id
      });
    }

    // Bestellung in DB erstellen (Status: pending)
    const order = await createOrder({
      stripeSessionId: null, // Wird nach Session-Erstellung gesetzt
      customerEmail: email,
      totalAmount,
      items: orderItems,
    });

    // Keys reservieren
    for (const item of orderItems) {
      const result = await reserveKeys(item.productId, item.quantity, order.id);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
    }

    // Stripe Checkout Session erstellen
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${frontendUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/?checkout=cancelled`,
      metadata: {
        order_id: order.id.toString(),
      },
    });

    // Stripe Session ID in Order speichern
    await pool.query(
      'UPDATE orders SET stripe_session_id = $1 WHERE id = $2',
      [session.id, order.id]
    );

    res.json({ sessionUrl: session.url });
  } catch (err) {
    console.error('❌ KRITISCHER CHECKOUT FEHLER:', {
      message: err.message,
      type: err.type,
      raw: err.raw,
      stack: err.stack
    });
    res.status(500).json({ 
      error: 'Checkout fehlgeschlagen (Server Error).',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
});

export default router;
