import { Router } from 'express';
import Stripe from 'stripe';
import { confirmKeys, releaseKeys, getKeysByOrder } from '../services/keyService.js';
import { findOrderByStripeSession, markOrderPaid, findOrderById } from '../services/orderService.js';
import { sendKeyDelivery } from '../services/emailService.js';
import { sendOrderWebhook } from '../services/discordService.js';

const router = Router();

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

/**
 * POST /api/webhook/stripe
 * Empfängt Stripe Webhook Events.
 * WICHTIG: Diese Route braucht den RAW Body (nicht JSON-parsed).
 */
router.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  // Im Dev-Modus ohne Stripe
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn('⚠️ Stripe Webhook nicht konfiguriert');
    return res.json({ received: true });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body, // Muss raw Buffer sein!
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook Signatur ungültig:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Event verarbeiten
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log(`✅ Zahlung erfolgreich: ${session.id}`);
        await handlePaymentSuccess(session);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        console.log(`⏰ Checkout abgelaufen: ${session.id}`);
        await handlePaymentExpired(session);
        break;
      }

      default:
        console.log(`ℹ️ Unbehandeltes Event: ${event.type}`);
    }
  } catch (err) {
    console.error(`❌ Event-Verarbeitung fehlgeschlagen (${event.type}):`, err);
    // Trotzdem 200 zurückgeben, damit Stripe nicht erneut sendet
  }

  res.json({ received: true });
});

/**
 * POST /api/webhook/simulate-payment
 * Simuliert eine erfolgreiche Zahlung (nur im Dev-Modus).
 */
router.post('/simulate-payment', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Nicht verfügbar in Produktion.' });
  }

  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ error: 'orderId erforderlich.' });
  }

  try {
    const order = await findOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Bestellung nicht gefunden.' });
    }

    const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unbekannt').toString().split(',')[0].trim();
    await processSuccessfulPayment(order, clientIp);
    res.json({ success: true, message: 'Zahlung simuliert und Keys versendet.' });
  } catch (err) {
    console.error('❌ Simulation Fehler:', err);
    res.status(500).json({ error: 'Simulation fehlgeschlagen.' });
  }
});

/**
 * Verarbeitet eine erfolgreiche Zahlung.
 */
async function handlePaymentSuccess(session) {
  const orderId = parseInt(session.metadata.order_id);
  const order = await findOrderById(orderId);

  if (!order) {
    console.error(`❌ Order ${orderId} nicht gefunden für Session ${session.id}`);
    return;
  }

  const clientIp = session.metadata.client_ip || 'Unbekannt';

  if (order.status === 'paid') {
    console.log(`ℹ️ Order ${orderId} bereits als bezahlt markiert`);
    return;
  }

  await processSuccessfulPayment(order, clientIp);
}

/**
 * Kernlogik für erfolgreiche Zahlung: Keys bestätigen + E-Mail senden.
 */
async function processSuccessfulPayment(order, clientIp) {
  // 1. Keys von reserved → sold
  const soldKeys = await confirmKeys(order.id);
  console.log(`🔑 ${soldKeys.length} Keys bestätigt für Order #${order.id}`);

  // 2. Keys nach Produkt gruppieren
  const keysByProduct = {};
  for (const key of soldKeys) {
    if (!keysByProduct[key.product_id]) {
      keysByProduct[key.product_id] = { productId: key.product_id, productTitle: '', keys: [] };
    }
    keysByProduct[key.product_id].keys.push(key.key_value);
  }

  // Produktnamen holen
  const groupedKeys = Object.values(keysByProduct);
  for (const group of groupedKeys) {
    const fullKeys = await getKeysByOrder(order.id);
    const match = fullKeys.find(k => k.product_id === group.productId);
    if (match) group.productTitle = match.product_title;
  }

  // 3. Order als bezahlt markieren + Keys speichern
  await markOrderPaid(order.id, groupedKeys);

  // 4. Keys per E-Mail senden
  const emailResult = await sendKeyDelivery(order.customer_email, order, groupedKeys);
  console.log(`📧 E-Mail Ergebnis für Order #${order.id}:`, emailResult);

  // 5. Discord Webhook abfeuern
  await sendOrderWebhook({
    orderId: order.id,
    email: order.customer_email,
    totalAmount: order.total_amount,
    ipAddress: clientIp,
    products: groupedKeys
  });
}

/**
 * Verarbeitet einen abgelaufenen Checkout.
 */
async function handlePaymentExpired(session) {
  const orderId = parseInt(session.metadata?.order_id);
  if (!orderId) return;

  const order = await findOrderById(orderId);
  if (!order || order.status !== 'pending') return;

  // Reservierte Keys freigeben
  await releaseKeys(orderId);
  console.log(`🔓 Keys freigegeben für abgelaufene Order #${orderId}`);
}

export default router;
