import { X, Mail, CreditCard, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { useState, useEffect} from 'react';

const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:3001';

export default function CheckoutModal({ isOpen, onClose, items, totalPrice, onSuccess }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setError(null);
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen || items.length === 0) return null;

  const handleCheckout = async () => {
    if (!email) {
      setError('Bitte gib deine E-Mail-Adresse ein.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Ungültige E-Mail-Adresse.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/checkout/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout fehlgeschlagen.');
      }

      if (data.simulated) {
        // Dev-Modus: Simulierte Zahlung direkt verarbeiten
        const simRes = await fetch(`${API_BASE}/api/webhook/simulate-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: data.orderId }),
        });
        if (simRes.ok) {
          onSuccess?.();
          onClose();
        }
      } else if (data.sessionUrl) {
        // Zur Stripe Checkout Seite weiterleiten
        window.location.href = data.sessionUrl;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />

      <div className="animate-fade-up" style={{
        position: 'relative', width: '100%', maxWidth: '520px',
        background: 'linear-gradient(180deg, #0c0c1c 0%, #080812 100%)',
        border: '1px solid rgba(0, 180, 255, 0.15)',
        borderRadius: '20px', overflow: 'hidden',
        boxShadow: '0 25px 80px rgba(0,0,0,0.8), 0 0 60px rgba(0,180,255,0.08)',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          padding: '1.5rem 1.5rem 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(0,229,255,0.12), rgba(124,58,237,0.08))',
              border: '1px solid rgba(0,180,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CreditCard size={16} style={{ color: '#00b4ff' }} />
            </div>
            <h2 style={{ fontWeight: '700', fontSize: '1.1rem' }}>Checkout</h2>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', cursor: 'pointer',
          }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* Bestellübersicht */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              fontSize: '0.7rem', color: '#7e8bb6', fontWeight: '600',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem',
            }}>Bestellübersicht</div>

            <div style={{
              background: 'rgba(0,180,255,0.03)',
              border: '1px solid rgba(0,180,255,0.1)',
              borderRadius: '12px', overflow: 'hidden',
            }}>
              {items.map((item, idx) => (
                <div key={item.id} style={{
                  padding: '0.75rem 1rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderBottom: idx < items.length - 1 ? '1px solid rgba(0,180,255,0.06)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{item.title}</div>
                      <div style={{ color: '#7e8bb6', fontSize: '0.75rem' }}>× {item.quantity}</div>
                    </div>
                  </div>
                  <span className="price-text" style={{ fontSize: '0.9rem' }}>
                    €{(item.priceMin * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              {/* Gesamt */}
              <div style={{
                padding: '0.85rem 1rem',
                background: 'rgba(0,180,255,0.04)',
                borderTop: '1px solid rgba(0,180,255,0.1)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Gesamt</span>
                <span style={{
                  fontWeight: '800', fontSize: '1.15rem',
                  background: 'linear-gradient(135deg, #00e5ff, #0070ff)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>€{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* E-Mail Eingabe */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              fontSize: '0.7rem', color: '#7e8bb6', fontWeight: '600',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem',
            }}>E-Mail Adresse</div>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{
                position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                color: '#7e8bb6', pointerEvents: 'none',
              }} />
              <input
                type="email"
                placeholder="deine@email.de"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(null); }}
                style={{
                  width: '100%', background: 'rgba(10, 10, 24, 0.95)',
                  border: `1px solid ${error ? 'rgba(255,80,80,0.4)' : 'rgba(0,180,255,0.18)'}`,
                  borderRadius: '12px', padding: '0.85rem 1rem 0.85rem 2.8rem',
                  color: 'white', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif',
                  outline: 'none', transition: 'all 0.3s',
                }}
                onFocus={e => { e.target.style.borderColor = '#00b4ff'; e.target.style.boxShadow = '0 0 20px rgba(0,180,255,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = error ? 'rgba(255,80,80,0.4)' : 'rgba(0,180,255,0.18)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
              <ShieldCheck size={12} style={{ color: '#22c55e' }} />
              <span style={{ fontSize: '0.7rem', color: '#7e8bb6' }}>
                Deine Keys werden an diese E-Mail gesendet
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '10px', padding: '0.7rem 1rem', marginBottom: '1rem',
              color: '#f87171', fontSize: '0.8rem',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{
              width: '100%',
              background: loading
                ? 'rgba(0,180,255,0.1)'
                : 'linear-gradient(135deg, #00e5ff, #0070ff, #7c3aed)',
              border: 'none', color: 'white', borderRadius: '12px',
              padding: '1rem', fontWeight: '700', fontSize: '0.95rem',
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
              transition: 'all 0.3s',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(0, 112, 255, 0.3)',
              fontFamily: 'Inter, sans-serif',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 6px 30px rgba(0, 112, 255, 0.5)'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 112, 255, 0.3)'; }}
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" style={{ animation: 'rotate-slow 1s linear infinite' }} /> Verarbeite...</>
            ) : (
              <>Mit Stripe bezahlen <ArrowRight size={16} /></>
            )}
          </button>

          {/* Zahlungsinfos */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem',
            marginTop: '1rem', color: '#3d4566', fontSize: '0.7rem',
          }}>
            <span>🔒 SSL verschlüsselt</span>
            <span>💳 Stripe Payments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
