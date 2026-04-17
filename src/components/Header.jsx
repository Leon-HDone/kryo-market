import { ShoppingCart, LayoutDashboard, Menu, X, Snowflake } from 'lucide-react';
import { useState } from 'react';

const DiscordIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.07.11 18.086.12 18.09a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

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
    <img src="/K.png" alt="K Logo" style={{ width: '22px', height: '22px', filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))', zIndex: 1 }} />
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
              <DiscordIcon />
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
