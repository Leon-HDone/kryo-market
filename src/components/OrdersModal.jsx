import { X, Mail, ShieldCheck, Loader2, ArrowRight, Package, Copy, Check, KeyRound } from 'lucide-react';
import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:3001';

export default function OrdersModal({ isOpen, onClose }) {
  const [step, setStep] = useState('email'); // 'email' | 'code' | 'orders'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep('email');
      setEmail('');
      setCode('');
      setError(null);
      setOrders([]);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendCode = async () => {
    if (!email) { setError('Bitte E-Mail eingeben.'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setError('Ungültige E-Mail.'); return; }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/orders/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep('code');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!code || code.length !== 6) { setError('Bitte 6-stelligen Code eingeben.'); return; }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/orders/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrders(data.orders);
      setStep('orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (key, keyId) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />

      <div className="animate-fade-up" style={{
        position: 'relative', width: '100%', maxWidth: step === 'orders' ? '680px' : '480px',
        maxHeight: '85vh', overflowY: 'auto',
        background: 'linear-gradient(180deg, #0c0c1c 0%, #080812 100%)',
        border: '1px solid rgba(0, 180, 255, 0.15)',
        borderRadius: '20px',
        boxShadow: '0 25px 80px rgba(0,0,0,0.8), 0 0 60px rgba(0,180,255,0.08)',
        transition: 'max-width 0.3s ease',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          padding: '1.5rem 1.5rem 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 2,
          background: 'linear-gradient(180deg, #0c0c1c, rgba(12,12,28,0.95))',
          paddingBottom: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(0,229,255,0.12), rgba(124,58,237,0.08))',
              border: '1px solid rgba(0,180,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Package size={16} style={{ color: '#00b4ff' }} />
            </div>
            <h2 style={{ fontWeight: '700', fontSize: '1.1rem' }}>Your Orders</h2>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', cursor: 'pointer',
          }}><X size={16} /></button>
        </div>

        <div style={{ padding: '0 1.5rem 1.5rem' }}>

          {/* Step 1: E-Mail */}
          {step === 'email' && (
            <>
              <p style={{ color: '#7e8bb6', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Gib deine E-Mail-Adresse ein, um deine Bestellungen abzurufen. 
                Wir senden dir einen Bestätigungscode.
              </p>

              <div style={{ marginBottom: '1.25rem' }}>
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
                    onKeyDown={e => e.key === 'Enter' && handleSendCode()}
                    style={{
                      width: '100%', background: 'rgba(10, 10, 24, 0.95)',
                      border: '1px solid rgba(0,180,255,0.18)', borderRadius: '12px',
                      padding: '0.85rem 1rem 0.85rem 2.8rem',
                      color: 'white', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif',
                      outline: 'none', transition: 'all 0.3s',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#00b4ff'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(0,180,255,0.18)'; }}
                  />
                </div>
              </div>

              {error && (
                <div style={{
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '10px', padding: '0.7rem 1rem', marginBottom: '1rem',
                  color: '#f87171', fontSize: '0.8rem',
                }}>⚠️ {error}</div>
              )}

              <button onClick={handleSendCode} disabled={loading} style={{
                width: '100%', background: 'linear-gradient(135deg, #00e5ff, #0070ff, #7c3aed)',
                border: 'none', color: 'white', borderRadius: '12px',
                padding: '0.9rem', fontWeight: '700', fontSize: '0.9rem',
                cursor: loading ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                fontFamily: 'Inter, sans-serif', opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 20px rgba(0, 112, 255, 0.3)',
              }}>
                {loading ? <><Loader2 size={16} style={{ animation: 'rotate-slow 1s linear infinite' }} /> Sende...</> : <>Code senden <ArrowRight size={15} /></>}
              </button>
            </>
          )}

          {/* Step 2: Code eingeben */}
          {step === 'code' && (
            <>
              <div style={{
                background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)',
                borderRadius: '10px', padding: '0.7rem 1rem', marginBottom: '1.25rem',
                color: '#4ade80', fontSize: '0.8rem',
              }}>
                ✅ Code gesendet an <strong>{email}</strong>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{
                  fontSize: '0.7rem', color: '#7e8bb6', fontWeight: '600',
                  letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem',
                }}>Bestätigungscode</div>
                <div style={{ position: 'relative' }}>
                  <ShieldCheck size={16} style={{
                    position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                    color: '#7e8bb6', pointerEvents: 'none',
                  }} />
                  <input
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    value={code}
                    onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setError(null); }}
                    onKeyDown={e => e.key === 'Enter' && handleVerify()}
                    style={{
                      width: '100%', background: 'rgba(10, 10, 24, 0.95)',
                      border: '1px solid rgba(0,180,255,0.18)', borderRadius: '12px',
                      padding: '0.85rem 1rem 0.85rem 2.8rem',
                      color: 'white', fontSize: '1.2rem', fontFamily: "'Courier New', monospace",
                      letterSpacing: '0.3em', fontWeight: '700',
                      outline: 'none', textAlign: 'center',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#00b4ff'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(0,180,255,0.18)'; }}
                    autoFocus
                  />
                </div>
                <div style={{ color: '#3d4566', fontSize: '0.7rem', marginTop: '0.4rem', textAlign: 'center' }}>
                  Code ist 5 Minuten gültig
                </div>
              </div>

              {error && (
                <div style={{
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '10px', padding: '0.7rem 1rem', marginBottom: '1rem',
                  color: '#f87171', fontSize: '0.8rem',
                }}>⚠️ {error}</div>
              )}

              <button onClick={handleVerify} disabled={loading} style={{
                width: '100%', background: 'linear-gradient(135deg, #00e5ff, #0070ff, #7c3aed)',
                border: 'none', color: 'white', borderRadius: '12px',
                padding: '0.9rem', fontWeight: '700', fontSize: '0.9rem',
                cursor: loading ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                fontFamily: 'Inter, sans-serif', opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 20px rgba(0, 112, 255, 0.3)',
              }}>
                {loading ? <><Loader2 size={16} style={{ animation: 'rotate-slow 1s linear infinite' }} /> Prüfe...</> : <>Verifizieren <ArrowRight size={15} /></>}
              </button>

              <button onClick={() => { setStep('email'); setCode(''); setError(null); }} style={{
                background: 'none', border: 'none', color: '#7e8bb6', marginTop: '0.75rem',
                cursor: 'pointer', fontSize: '0.8rem', display: 'block', width: '100%', textAlign: 'center',
              }}>
                ← Andere E-Mail verwenden
              </button>
            </>
          )}

          {/* Step 3: Bestellungen anzeigen */}
          {step === 'orders' && (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '1.25rem',
              }}>
                <span style={{ color: '#7e8bb6', fontSize: '0.85rem' }}>
                  {orders.length} Bestellung{orders.length !== 1 ? 'en' : ''} für <strong style={{ color: 'white' }}>{email}</strong>
                </span>
              </div>

              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#7e8bb6' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📦</div>
                  <p style={{ fontWeight: '600', color: 'white' }}>Keine Bestellungen gefunden</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.4rem' }}>Für diese E-Mail gibt es noch keine bezahlten Bestellungen.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {orders.map(order => (
                    <div key={order.id} style={{
                      background: 'rgba(0,180,255,0.03)',
                      border: '1px solid rgba(0,180,255,0.1)',
                      borderRadius: '14px', overflow: 'hidden',
                    }}>
                      {/* Order Header */}
                      <div style={{
                        padding: '0.85rem 1rem',
                        background: 'rgba(0,180,255,0.03)',
                        borderBottom: '1px solid rgba(0,180,255,0.06)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}>
                        <div>
                          <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>
                            Bestellung #{order.id}
                          </span>
                          <span style={{ color: '#7e8bb6', fontSize: '0.75rem', marginLeft: '0.75rem' }}>
                            {new Date(order.paid_at || order.created_at).toLocaleDateString('de-DE', {
                              day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <span style={{
                          background: 'rgba(34,197,94,0.1)',
                          border: '1px solid rgba(34,197,94,0.2)',
                          color: '#22c55e', fontSize: '0.65rem', fontWeight: '700',
                          padding: '3px 8px', borderRadius: '50px', textTransform: 'uppercase',
                        }}>Bezahlt</span>
                      </div>

                      {/* Items & Keys */}
                      <div style={{ padding: '0.85rem 1rem' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{
                            marginBottom: idx < order.items.length - 1 ? '1rem' : 0,
                          }}>
                            <div style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              marginBottom: '0.5rem',
                            }}>
                              <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>
                                {item.product_title} <span style={{ color: '#7e8bb6' }}>× {item.quantity}</span>
                              </span>
                              <span style={{ color: '#00b4ff', fontWeight: '700', fontSize: '0.85rem' }}>
                                €{(item.unit_price * item.quantity).toFixed(2)}
                              </span>
                            </div>

                            {/* Keys */}
                            {item.keys_full && item.keys_full.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {item.keys_full.map((key, kIdx) => (
                                  <div key={kIdx} style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    background: 'rgba(10, 10, 24, 0.8)',
                                    border: '1px solid rgba(0,180,255,0.08)',
                                    borderRadius: '8px', padding: '0.5rem 0.75rem',
                                  }}>
                                    <KeyRound size={12} style={{ color: '#00b4ff', flexShrink: 0 }} />
                                    <span style={{
                                      fontFamily: "'Courier New', monospace",
                                      fontSize: '0.78rem', color: '#f0f4ff',
                                      flex: 1, wordBreak: 'break-all',
                                    }}>
                                      {key}
                                    </span>
                                    <button
                                      onClick={() => copyToClipboard(key, `${order.id}-${idx}-${kIdx}`)}
                                      style={{
                                        background: copiedKey === `${order.id}-${idx}-${kIdx}`
                                          ? 'rgba(34,197,94,0.1)' : 'rgba(0,180,255,0.06)',
                                        border: `1px solid ${copiedKey === `${order.id}-${idx}-${kIdx}` ? 'rgba(34,197,94,0.3)' : 'rgba(0,180,255,0.15)'}`,
                                        borderRadius: '6px', padding: '4px 8px',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem',
                                        color: copiedKey === `${order.id}-${idx}-${kIdx}` ? '#22c55e' : '#00b4ff',
                                        fontSize: '0.68rem', fontWeight: '600', flexShrink: 0,
                                        fontFamily: 'Inter, sans-serif',
                                      }}
                                    >
                                      {copiedKey === `${order.id}-${idx}-${kIdx}` ? <><Check size={11} /> Kopiert</> : <><Copy size={11} /> Copy</>}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Order Total */}
                      <div style={{
                        padding: '0.7rem 1rem',
                        borderTop: '1px solid rgba(0,180,255,0.06)',
                        display: 'flex', justifyContent: 'flex-end',
                      }}>
                        <span style={{ fontWeight: '800', fontSize: '0.95rem', color: '#00b4ff' }}>
                          Gesamt: €{parseFloat(order.total_amount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
