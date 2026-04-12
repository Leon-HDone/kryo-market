import { X, Trash2, ShoppingBag, Plus, Minus, CreditCard, Snowflake } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, items, onRemove, onUpdateQty, totalPrice, onCheckout }) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay${isOpen ? ' open' : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className={`cart-drawer${isOpen ? ' open' : ''}`} id="cart-drawer">
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(0,180,255,0.08)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(124,58,237,0.1))',
              border: '1px solid rgba(0,180,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShoppingBag size={15} style={{ color: '#00b4ff' }} />
            </div>
            <span style={{ fontWeight: '700', fontSize: '1rem' }}>Warenkorb</span>
            {items.length > 0 && (
              <span style={{
                background: 'linear-gradient(135deg, rgba(0,229,255,0.12), rgba(124,58,237,0.08))',
                border: '1px solid rgba(0,180,255,0.2)',
                color: '#00b4ff', fontSize: '0.68rem', fontWeight: '700',
                borderRadius: '50px', padding: '2px 10px',
              }}>
                {items.length}
              </span>
            )}
          </div>
          <button
            id="cart-close-btn"
            onClick={onClose}
            style={{
              background: 'rgba(0,180,255,0.06)', border: '1px solid rgba(0,180,255,0.1)',
              borderRadius: '8px',
              color: '#7e8bb6', cursor: 'pointer',
              display: 'flex', padding: '6px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = 'rgba(0,180,255,0.3)';
              e.currentTarget.style.background = 'rgba(0,180,255,0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#7e8bb6';
              e.currentTarget.style.borderColor = 'rgba(0,180,255,0.1)';
              e.currentTarget.style.background = 'rgba(0,180,255,0.06)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '5rem', color: '#7e8bb6' }}>
              <div style={{
                width: '70px', height: '70px', borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(0,180,255,0.06), rgba(124,58,237,0.04))',
                border: '1px solid rgba(0,180,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}>
                <Snowflake size={28} style={{ color: 'rgba(0,180,255,0.4)' }} />
              </div>
              <p style={{ fontWeight: '600', fontSize: '0.95rem', color: '#f0f4ff' }}>Warenkorb ist leer</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '0.4rem' }}>Füge Produkte hinzu!</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-item">
                {/* Product Icon */}
                <div style={{
                  width: '52px', height: '52px', flexShrink: 0,
                  background: `linear-gradient(135deg, ${item.imageColor}15, #080812)`,
                  border: `1px solid ${item.imageColor}22`,
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem',
                }}>
                  {item.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title}
                  </p>
                  <p className="price-text" style={{ fontSize: '0.8rem' }}>
                    €{(item.priceMin * item.quantity).toFixed(2)}
                  </p>

                  {/* Qty controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.45rem' }}>
                    <button
                      onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                      style={{
                        width: '24px', height: '24px', borderRadius: '6px',
                        background: 'rgba(0,180,255,0.06)', border: '1px solid rgba(0,180,255,0.15)',
                        color: '#00b4ff', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Minus size={11} />
                    </button>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', minWidth: '18px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                      style={{
                        width: '24px', height: '24px', borderRadius: '6px',
                        background: 'rgba(0,180,255,0.06)', border: '1px solid rgba(0,180,255,0.15)',
                        color: '#00b4ff', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  id={`remove-cart-${item.id}`}
                  onClick={() => onRemove(item.id)}
                  style={{
                    background: 'transparent', border: 'none',
                    color: '#3d4566', cursor: 'pointer', padding: '4px',
                    alignSelf: 'flex-start', transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={e => e.currentTarget.style.color = '#3d4566'}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid rgba(0,180,255,0.08)',
            flexShrink: 0,
            background: 'rgba(0,180,255,0.02)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.15rem' }}>
              <span style={{ color: '#7e8bb6', fontSize: '0.9rem' }}>Gesamt</span>
              <span className="price-text" style={{ fontSize: '1.2rem' }}>
                €{totalPrice.toFixed(2)}
              </span>
            </div>
            <button
              id="checkout-btn"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}
              onClick={onCheckout}
            >
              <CreditCard size={16} />
              Jetzt kaufen
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
