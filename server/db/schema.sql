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

-- Seed Test Products for Backend Validation
INSERT INTO products (id, title, category, price_min, price_max, stock, active) VALUES 
(1, 'FiveM Ready Account', 'FiveM', 0.15, 0.15, 100, true),
(2, 'Steam Ready Account', 'Games', 0.05, 0.05, 100, true),
(3, 'Discord Aged Account 2025', 'Accounts', 0.15, 0.15, 100, true),
(4, 'Discord Aged Account 2023', 'Accounts', 0.60, 0.60, 100, true),
(5, 'Discord Aged Account 2020', 'Accounts', 1.20, 1.20, 100, true),
(6, 'Discord Aged Account 2019', 'Accounts', 3.00, 3.00, 100, true),
(7, 'Discord Aged Account 2017', 'Accounts', 5.00, 5.00, 100, true),
(8, 'Discord Aged Account 2016', 'Accounts', 13.00, 13.00, 100, true),
(9, 'Discord Nitro Basic (Verified)', 'Accounts', 3.00, 3.00, 100, true),
(10, 'ChatGPT +', 'Accounts', 1.00, 1.00, 100, true),
(11, 'Disney Lifetime', 'Accounts', 1.00, 1.00, 100, true),
(12, 'Spotify Lifetime Account', 'Accounts', 2.00, 2.00, 100, true),
(13, 'Netflix Lifetime', 'Accounts', 1.50, 1.50, 100, true),
(14, 'Prime Video Lifetime', 'Accounts', 2.00, 2.00, 100, true),
(15, 'CapCut Pro Lifetime', 'Accounts', 3.00, 3.00, 100, true),
(16, 'HBO Max Lifetime Account', 'Accounts', 0.60, 0.60, 100, true),
(17, 'Discord Generator [LIFETIME]', 'Generators', 20.00, 20.00, 100, true),
(18, 'Steam Generator [LIFETIME]', 'Generators', 5.00, 5.00, 100, true),
(19, 'Mullvad VPN', 'VPN', 2.00, 2.00, 100, true),
(20, 'Nord VPN', 'VPN', 1.35, 1.35, 100, true),
(21, 'TunnelBear VPN LifeTime', 'VPN', 0.30, 0.30, 100, true),
(22, 'IP Vanish VPN 1 Year', 'VPN', 0.20, 0.20, 100, true)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    price_min = EXCLUDED.price_min,
    price_max = EXCLUDED.price_max,
    stock = EXCLUDED.stock,
    active = EXCLUDED.active;

-- Seed Test Keys for Backend Validation (Stock Check)
DO $$
DECLARE
    pid INT;
    i INT;
BEGIN
    FOR pid IN 1..22 LOOP
        FOR i IN 1..100 LOOP
            -- Check if key already exists to avoid spamming the DB on every start
            IF NOT EXISTS (SELECT 1 FROM product_keys WHERE product_id = pid AND key_value = 'TEST-KEY-' || pid || '-' || i) THEN
                INSERT INTO product_keys (product_id, key_value, status)
                VALUES (pid, 'TEST-KEY-' || pid || '-' || i, 'available');
            END IF;
        END LOOP;
    END LOOP;
END $$;
