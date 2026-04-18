import { Search } from 'lucide-react';
import { categories } from '../data/products';

export default function Hero({ searchQuery, setSearchQuery, activeCategory, setActiveCategory }) {
  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: '480px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '5rem',
        paddingBottom: '3rem',
        overflow: 'hidden',
      }}
    >
      {/* Background orbs */}
      <div className="hero-orb" style={{
        width: '700px', height: '700px',
        background: 'radial-gradient(circle, #00b4ff 0%, #0070ff 50%, transparent 70%)',
        top: '-300px', left: '50%', transform: 'translateX(-50%)',
      }} />
      <div className="hero-orb" style={{
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
        bottom: '-150px', left: '15%',
        opacity: 0.08,
      }} />
      <div className="hero-orb" style={{
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, #00e5ff 0%, transparent 70%)',
        top: '10%', right: '10%',
        opacity: 0.06,
      }} />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${8 + (i * 7.5) % 85}%`,
            top: `${15 + (i * 11) % 65}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${2.5 + (i % 3)}s`,
            width: `${1 + (i % 3)}px`,
            height: `${1 + (i % 3)}px`,
            opacity: 0.3 + (i % 4) * 0.1,
          }}
        />
      ))}



      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '740px', padding: '0 1.5rem', textAlign: 'center' }}>
        {/* Label Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'linear-gradient(135deg, rgba(0,229,255,0.08), rgba(124,58,237,0.08))',
          border: '1px solid rgba(0,180,255,0.2)',
          borderRadius: '50px', padding: '0.4rem 1.2rem', marginBottom: '1.25rem',
          fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #00e5ff, #0070ff)',
            display: 'inline-block',
            animation: 'pulse-glow 2s infinite',
          }} />
          <span className="gradient-text-brand">Premium Products</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: '800',
          marginBottom: '0.6rem',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}>
          <span className="gradient-text">Browse Products</span>
        </h1>

        <p style={{ color: '#7e8bb6', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Entdecke unsere riesige Kollektion an digitalen Produkten aus verschiedenen Kategorien.
        </p>

        {/* Search */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{
            fontSize: '0.68rem', color: '#7e8bb6', fontWeight: '600',
            letterSpacing: '0.12em', textAlign: 'left', marginBottom: '0.5rem',
            textTransform: 'uppercase',
          }}>
            Keyword
          </div>
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{
                position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)',
                color: '#7e8bb6', pointerEvents: 'none',
              }}
            />
            <input
              id="search-input"
              type="text"
              className="search-input"
              placeholder="Produkte suchen..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <div style={{
            fontSize: '0.68rem', color: '#7e8bb6', fontWeight: '600',
            letterSpacing: '0.12em', textAlign: 'left', marginBottom: '0.65rem',
            textTransform: 'uppercase',
          }}>
            Category
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                id={`filter-${cat.toLowerCase()}`}
                className={`filter-pill${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
