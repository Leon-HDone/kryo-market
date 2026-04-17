import { ShoppingCart, LayoutDashboard, Menu, X, Snowflake } from 'lucide-react';
import { useState } from 'react';

// SVG discord icon removed, using image now

// Kryo Snowflake Logo
const KryoLogo = () => (
  <div style={{
    width: '38px', height: '38px',
    background: 'linear-gradient(135deg, #00e5ff, #0070ff, #7c3aed)',
    borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 0 20px rgba(0, 180, 255, 0.5), 0 0 40px rgba(124, 58, 237, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
    }} />
    <img src="/K.png" alt="Kryo" style={{ width: '22px', height: '22px', filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))', zIndex: 1 }} />
  </div>
);

export default function Header({ totalItems, onCartOpen, onOrdersOpen }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const DISCORD_URL = 'https://discord.gg/5RFzaZXFYK'; // ← Hier deinen Discord-Link eintragen

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(3, 3, 8, 0.9)',
        backdropFilter: 'blur(24px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.3)',
        borderBottom: '1px solid rgba(0, 180, 255, 0.08)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

          {/* Logo */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', textDecoration: 'none' }}>
            <KryoLogo />
            <span className="brand-font" style={{ fontWeight: '800', fontSize: '1.2rem', letterSpacing: '0.08em' }}>
              <span className="gradient-text-brand">KRYO</span>
              <span style={{ color: '#7e8bb6', fontWeight: '400', marginLeft: '0.3rem', fontSize: '0.85rem', letterSpacing: '0.12em' }}>MARKET</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            <a href="#home" className="nav-link">Home</a>
            <a href="#products" className="nav-link">Products</a>
            <a href="#reviews" className="nav-link">Reviews</a>
          </div>

          {/* Right Side Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Discord */}
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              id="discord-btn"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '38px', height: '38px',
                background: 'rgba(88, 101, 242, 0.1)',
                border: '1px solid rgba(88, 101, 242, 0.25)',
                borderRadius: '10px', color: '#5865F2',
                transition: 'all 0.35s ease', textDecoration: 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(88, 101, 242, 0.25)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(88, 101, 242, 0.35)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(88, 101, 242, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <img src="/Discord.png" alt="Discord" style={{ width: '22px', height: '22px' }} />
            </a>

            {/* Cart */}
            <button
              id="cart-btn"
              className="btn-outline"
              onClick={onCartOpen}
              style={{ position: 'relative' }}
            >
              <ShoppingCart size={15} />
              Cart
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: '-8px', right: '-8px',
                  background: 'linear-gradient(135deg, #00e5ff, #0070ff)',
                  color: 'white', fontSize: '0.6rem', fontWeight: '800',
                  borderRadius: '50%', width: '20px', height: '20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(0, 180, 255, 0.6)',
                  border: '2px solid var(--bg-primary)',
                }}>
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* Dashboard */}
            <button id="dashboard-btn" className="btn-primary" onClick={onOrdersOpen}>
              <LayoutDashboard size={15} />
              Your Orders
            </button>

            {/* Mobile Hamburger */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'transparent', border: 'none',
                color: 'white', cursor: 'pointer', padding: '4px',
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{
            borderTop: '1px solid rgba(0, 180, 255, 0.08)',
            padding: '1rem 0',
            display: 'flex', flexDirection: 'column', gap: '0.75rem',
          }}>
            <a href="#home" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#products" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Products</a>
            <a href="#reviews" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
