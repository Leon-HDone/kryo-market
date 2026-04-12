import { Router } from 'express';
import { getOrdersByEmail, saveVerificationCode, verifyCode } from '../services/orderService.js';
import { sendVerificationCode } from '../services/emailService.js';

const router = Router();

/**
 * POST /api/orders/lookup
 * Sendet einen Verifikationscode an die angegebene E-Mail.
 */
router.post('/lookup', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'E-Mail ist erforderlich.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Ungültige E-Mail-Adresse.' });
    }

    // 6-stelligen Code generieren
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Code in DB speichern
    await saveVerificationCode(email, code);

    // Code per E-Mail senden
    await sendVerificationCode(email, code);

    res.json({ success: true, message: 'Bestätigungscode wurde gesendet.' });
  } catch (err) {
    console.error('❌ Lookup Fehler:', err);
    res.status(500).json({ error: 'Fehler beim Senden des Codes.' });
  }
});

/**
 * POST /api/orders/verify
 * Verifiziert den Code und gibt die Bestellungen zurück.
 */
router.post('/verify', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'E-Mail und Code sind erforderlich.' });
    }

    // Code verifizieren
    const isValid = await verifyCode(email, code);
    if (!isValid) {
      return res.status(401).json({ error: 'Ungültiger oder abgelaufener Code.' });
    }

    // Bestellungen laden
    const orders = await getOrdersByEmail(email);

    // Keys teilweise maskieren (Sicherheit: nur erste Hälfte zeigen)
    const maskedOrders = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        keys_delivered: (item.keys_delivered || []).map(key => maskKey(key)),
        keys_full: item.keys_delivered || [], // Volle Keys zum Kopieren
      })),
    }));

    res.json({ success: true, orders: maskedOrders });
  } catch (err) {
    console.error('❌ Verify Fehler:', err);
    res.status(500).json({ error: 'Fehler bei der Verifizierung.' });
  }
});

/**
 * Maskiert einen Key für die Anzeige.
 * Zeigt die erste Hälfte und maskiert den Rest.
 */
function maskKey(key) {
  if (!key || key.length < 6) return key;
  const showLen = Math.ceil(key.length / 2);
  return key.substring(0, showLen) + '•'.repeat(key.length - showLen);
}

export default router;
