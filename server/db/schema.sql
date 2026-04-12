-- ============================================
-- Kryo Market – Datenbank-Schema
-- Ausführen auf deiner PostgreSQL Instanz (Railway)
-- ============================================

-- Produkte (Spiegel der Frontend-Daten, für serverseitige Validierung)
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price_min DECIMAL(10,2) NOT NULL,
    price_max DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Keys pro Produkt (dein Inventar – hier trägst du deine Keys ein)
CREATE TABLE IF NOT EXISTS product_keys (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    key_value TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
    reserved_at TIMESTAMP,
    sold_at TIMESTAMP,
    order_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Bestellungen
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    stripe_session_id VARCHAR(255) UNIQUE,
    customer_email VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'expired')),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Einzelne Positionen einer Bestellung
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    product_title VARCHAR(255),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    keys_delivered TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Verifikationscodes für Order-Lookup
CREATE TABLE IF NOT EXISTS verification_codes (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indizes für Performance
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_product_keys_status ON product_keys(status, product_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_verification_email ON verification_codes(email, code);
