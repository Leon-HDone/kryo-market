import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from './db/pool.js';
import checkoutRoutes from './routes/checkout.js';
import webhookRoutes from './routes/webhook.js';
import ordersRoutes from './routes/orders.js';
import productsRoutes from './routes/products.js';
import { cleanupExpiredReservations } from './services/keyService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// ─── CORS ───────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// ─── Webhook Route MUSS vor express.json() kommen (braucht Raw Body) ───
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoutes);

// ─── JSON Parsing für alle anderen Routes ───
app.use(express.json());

// ─── API Routes ─────────────────────────────────────────
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productsRoutes);

// ─── Health Check ───────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    stripe: !!process.env.STRIPE_SECRET_KEY,
    resend: !!process.env.RESEND_API_KEY,
    database: !!process.env.DATABASE_URL,
  });
});

// ─── Statische Dateien (Vite Build) in Production ───────
if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  
  // SPA Fallback: Alle nicht-API Routes → index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(join(distPath, 'index.html'));
    }
  });
}

// ─── Datenbank-Schema initialisieren ────────────────────
async function initDatabase() {
  try {
    const { readFileSync } = await import('fs');
    const schema = readFileSync(join(__dirname, 'db', 'schema.sql'), 'utf-8');
    await pool.query(schema);
    console.log('✅ Datenbank-Schema initialisiert');
  } catch (err) {
    console.error('❌ Schema-Init Fehler:', err.message);
    // Nicht fatal – Tabellen existieren vielleicht schon
  }
}

// ─── Periodische Bereinigung abgelaufener Reservierungen ─
setInterval(cleanupExpiredReservations, 5 * 60 * 1000); // Alle 5 Minuten

// ─── Server starten ────────────────────────────────────
app.listen(PORT, '0.0.0.0', async () => {
  console.log('');
  console.log('  ❄️  KRYO MARKET SERVER');
  console.log(`  🚀 Läuft auf Port ${PORT}`);
  console.log(`  🌍 Modus: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? '✅ Konfiguriert' : '⚠️  Testmodus'}`);
  console.log(`  📧 Resend: ${process.env.RESEND_API_KEY ? '✅ Konfiguriert' : '⚠️  Testmodus (Logs)'}`);
  console.log(`  🗄️  DB: ${process.env.DATABASE_URL ? '✅ Verbunden' : '⚠️  Nicht konfiguriert'}`);
  console.log('');

  if (process.env.DATABASE_URL) {
    await initDatabase();
  }
});

export default app;
