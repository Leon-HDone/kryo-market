import { Star, Quote } from 'lucide-react';

const reviews = [
  { id: 1, name: 'xXShadowXx', avatar: '🥷', rating: 5, text: 'Krasse Qualität! Discord Accounts kamen innerhalb von Sekunden. Beste Wahl für Massenbestellungen!', product: 'Discord Accounts' },
  { id: 2, name: 'GamingPro99', avatar: '🎮', rating: 5, text: 'FiveM Spoofer funktioniert einwandfrei, kein BAN seit 3 Monaten. Top Support vom Team!', product: 'FiveM Spoofer' },
  { id: 3, name: 'TurboReseller', avatar: '⚡', rating: 5, text: 'Ich bestelle hier täglich. Lieferung ist blitzschnell und Support antwortet sofort auf Discord.', product: 'Spotify Premium' },
  { id: 4, name: 'AnonymX', avatar: '👤', rating: 4, text: 'Sehr gutes VPN Angebot. Preis-Leistung ist unschlagbar. Weiter so!', product: 'NordVPN Premium' },
];

function StarRating({ count }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={12} fill={i < count ? '#FFB800' : 'none'} style={{ color: i < count ? '#FFB800' : '#3d4566' }} />
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section id="reviews" style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      {/* Section Title */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'linear-gradient(135deg, rgba(0,229,255,0.06), rgba(124,58,237,0.06))',
          border: '1px solid rgba(0,180,255,0.15)',
          borderRadius: '50px', padding: '0.4rem 1.2rem', marginBottom: '0.85rem',
          fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          <span className="gradient-text-brand">Kundenbewertungen</span>
        </div>
        <h2 style={{
          fontSize: '2.2rem', fontWeight: '800',
          letterSpacing: '-0.02em', lineHeight: 1.2,
        }}>
          <span className="gradient-text">Was unsere Kunden sagen</span>
        </h2>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
        gap: '1.15rem',
      }}>
        {reviews.map((review, idx) => (
          <div
            key={review.id}
            className="animate-fade-up"
            style={{
              background: 'linear-gradient(145deg, #0a0a18 0%, #080812 100%)',
              border: '1px solid rgba(0,180,255,0.08)',
              borderRadius: '16px',
              padding: '1.5rem',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              animationDelay: `${idx * 0.1}s`,
              animationFillMode: 'both',
              opacity: 0,
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(0,180,255,0.25)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0,180,255,0.1), 0 8px 32px rgba(0,0,0,0.3)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(0,180,255,0.08)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Quote icon */}
            <Quote size={22} style={{
              color: 'rgba(0,180,255,0.1)', position: 'absolute', top: '1.5rem', right: '1.5rem',
            }} />

            {/* Subtle corner glow */}
            <div style={{
              position: 'absolute', top: '-30px', right: '-30px',
              width: '100px', height: '100px',
              background: 'radial-gradient(circle, rgba(0,180,255,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            {/* User info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(0,180,255,0.1), rgba(124,58,237,0.08))',
                border: '1px solid rgba(0,180,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
              }}>
                {review.avatar}
              </div>
              <div>
                <p style={{ fontWeight: '700', fontSize: '0.88rem', marginBottom: '0.15rem' }}>{review.name}</p>
                <StarRating count={review.rating} />
              </div>
            </div>

            {/* Review text */}
            <p style={{ color: '#7e8bb6', fontSize: '0.84rem', lineHeight: 1.65, marginBottom: '0.85rem' }}>
              {review.text}
            </p>

            {/* Product tag */}
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              background: 'rgba(0,180,255,0.06)',
              border: '1px solid rgba(0,180,255,0.1)',
              borderRadius: '50px', padding: '0.2rem 0.75rem',
              fontSize: '0.68rem', color: '#00b4ff', fontWeight: '500',
            }}>
              📦 {review.product}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
