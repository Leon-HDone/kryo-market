import { X, Shield, Package, ShoppingCart, Plus, Minus, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ProductImagePlaceholder } from './ProductCard';

export default function ProductModal({ product, onClose, onAddToCart }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent background scroll when modal open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  if (!product) return null;

  const isLowStock = product.stock > 0 && product.stock < 50;
  const isInStock = product.stock > 0;
  const maxQty = product.stock > 0 ? (product.stock >= 99999 ? 99 : product.stock) : 0;
  const price = product.priceMin;
  const total = price * qty;

  const handleAdd = () => {
    if (!isInStock) return;
    onAddToCart({ ...product, quantity: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    }}>
      {/* Background layer click to close */}
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />

      {/* Modal Container */}
      <div 
        className="animate-fade-up"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1000px',
          background: 'radial-gradient(ellipse at top right, rgba(0,180,255,0.08) 0%, transparent 60%), #0a0a18',
          border: '1px solid rgba(0, 180, 255, 0.15)',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.8), 0 0 40px rgba(0,180,255,0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(10, 10, 24, 0.6)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,0,0,0.2)'; e.currentTarget.style.borderColor = 'red'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(10, 10, 24, 0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
        >
          <X size={18} />
        </button>

        {/* Left Column (Image & Details) */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Image */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <ProductImagePlaceholder product={product} />
          </div>

          {/* Description Block */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
              <Shield size={16} color="#00b4ff" />
              <h4 style={{ fontWeight: '700', fontSize: '1rem', color: 'white' }}>
                {product.title}
              </h4>
            </div>
            <p style={{ color: '#7e8bb6', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            {/* Simulated Features List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#8b9cc8' }}>
                <span style={{ color: '#f59e0b' }}>📄</span>
                <strong>Full Source Code Access</strong> — complete access for {product.title.toLowerCase()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#8b9cc8' }}>
                <span style={{ color: '#f59e0b' }}>⚡</span>
                <strong>Instant Delivery</strong> — fast, efficient & automatic processing
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Purchase Box) */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '50px',
            padding: '0.3rem 0.75rem',
            color: '#f59e0b',
            fontSize: '0.7rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1rem',
            alignSelf: 'flex-start'
          }}>
            <Zap size={12} fill="#f59e0b" /> Instant Delivery
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem', color: 'white' }}>
            {product.title}
          </h2>

          <div style={{ marginBottom: '1.5rem', fontWeight: '600', color: 'white' }}>
            Purchase
          </div>

          {/* Product Block */}
          <div style={{
            background: 'rgba(0,180,255,0.03)',
            border: '1px solid rgba(0,180,255,0.2)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: '#8b9cc8' }}>{product.title}</span>
              <span style={{ fontSize: '0.8rem', color: '#7e8bb6' }}>
                {product.stock >= 99999 ? '∞ In Stock' : `${product.stock} In Stock`}
              </span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#00b4ff' }}>
              €{price.toFixed(2)}
            </div>
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#8b9cc8', marginBottom: '0.75rem' }}>Select Quantity</div>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden' }}>
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                style={{ padding: '0.75rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer', flex: 1, borderRight: '1px solid rgba(255,255,255,0.05)' }}
              >
                <Minus size={14} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 3, fontSize: '0.9rem', fontWeight: '600', color: 'white' }}>
                {qty}
              </div>
              <button 
                onClick={() => setQty(Math.min(maxQty, qty + 1))}
                style={{ padding: '0.75rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer', flex: 1, borderLeft: '1px solid rgba(255,255,255,0.05)' }}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Total */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#8b9cc8', marginBottom: '0.25rem' }}>Total</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>
              €{total.toFixed(2)}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
            <button
              onClick={handleAdd}
              disabled={!isInStock}
              style={{
                flex: 1,
                background: added ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${added ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
                color: added ? '#22c55e' : '#00b4ff',
                borderRadius: '8px',
                padding: '0.85rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: isInStock ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                opacity: isInStock ? 1 : 0.5
              }}
              onMouseEnter={e => { if(isInStock && !added) { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; } }}
              onMouseLeave={e => { if(isInStock && !added) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; } }}
            >
              <ShoppingCart size={16} /> 
              {added ? 'Added' : 'Add to Cart'}
            </button>
            
            <button
              onClick={() => {
                if(isInStock) {
                  handleAdd();
                  onClose();
                }
              }}
              disabled={!isInStock}
              style={{
                flex: 1,
                background: '#0070ff',
                backgroundImage: 'linear-gradient(135deg, #00e5ff, #0070ff)',
                border: 'none',
                color: 'white',
                borderRadius: '8px',
                padding: '0.85rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: isInStock ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                boxShadow: '0 4px 15px rgba(0, 112, 255, 0.3)',
                opacity: isInStock ? 1 : 0.5
              }}
              onMouseEnter={e => { if(isInStock) e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 112, 255, 0.5)'; }}
              onMouseLeave={e => { if(isInStock) e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 112, 255, 0.3)'; }}
            >
              Purchase »
            </button>
          </div>
        </div>

      </div>
      
      {/* Mobile responsive styling handled here via media query style injection isn't ideal but works for inline styles if needed, 
          though it's better to just rely on CSS for the layout grid if it needs to wrap.
          We can add a quick style tag. */}
      <style>{`
        @media (max-width: 768px) {
          .animate-fade-up {
            grid-template-columns: 1fr !important;
            max-height: 90vh;
            overflow-y: auto !important;
          }
          .animate-fade-up > div:first-child {
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.05);
          }
        }
      `}</style>
    </div>
  );
}
