import { Crown, ShoppingCart, Package } from 'lucide-react';
import { useState } from 'react';

export function ProductImagePlaceholder({ product }) {
  const [imgError, setImgError] = useState(false);

  // Wenn ein eigenes Bild gesetzt ist und es keinen Fehler gab, zeige es
  if (product.imageUrl && !imgError) {
    return (
      <img
        src={product.imageUrl}
        alt={product.title}
        className="product-card-image"
        style={{ objectFit: 'cover' }}
        onError={(e) => { setImgError(true); e.target.style.display = 'none'; }}
      />
    );
  }

  // Generierter Placeholder im Kryo-Stil
  const lines = product.imageLabel ? product.imageLabel.split('\n') : [product.title];
  return (
    <div className="placeholder-image" style={{
      width: '100%',
      aspectRatio: '16/10',
      background: `linear-gradient(145deg, ${product.imageColor}12 0%, #080812 40%, ${product.imageColor}08 100%)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Hex grid pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(30deg, ${product.imageColor}08 12%, transparent 12.5%, transparent 87%, ${product.imageColor}08 87.5%, ${product.imageColor}08),
          linear-gradient(150deg, ${product.imageColor}08 12%, transparent 12.5%, transparent 87%, ${product.imageColor}08 87.5%, ${product.imageColor}08),
          linear-gradient(30deg, ${product.imageColor}08 12%, transparent 12.5%, transparent 87%, ${product.imageColor}08 87.5%, ${product.imageColor}08),
          linear-gradient(150deg, ${product.imageColor}08 12%, transparent 12.5%, transparent 87%, ${product.imageColor}08 87.5%, ${product.imageColor}08),
          linear-gradient(60deg, ${product.imageColor}0a 25%, transparent 25.5%, transparent 75%, ${product.imageColor}0a 75%),
          linear-gradient(60deg, ${product.imageColor}0a 25%, transparent 25.5%, transparent 75%, ${product.imageColor}0a 75%)
        `,
        backgroundSize: '40px 70px',
        backgroundPosition: '0 0, 0 0, 20px 35px, 20px 35px, 0 0, 20px 35px',
        opacity: 0.6,
      }} />

      {/* Glow center */}
      <div style={{
        position: 'absolute',
        width: '180px', height: '180px',
        background: `radial-gradient(circle, ${product.imageColor} 0%, transparent 70%)`,
        borderRadius: '50%',
        opacity: 0.12,
      }} />

      {/* Corner accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '60px', height: '60px',
        background: `linear-gradient(225deg, ${product.imageColor}20, transparent)`,
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        width: '60px', height: '60px',
        background: `linear-gradient(45deg, ${product.imageColor}15, transparent)`,
      }} />

      {/* Icon + text */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{
          fontSize: '2.8rem', marginBottom: '0.6rem',
          filter: `drop-shadow(0 0 12px ${product.imageColor}60)`,
        }}>
          {product.icon}
        </div>
        {lines.map((line, i) => (
          <div key={i} style={{
            fontWeight: '800',
            fontSize: i === 0 ? '1rem' : '0.78rem',
            color: i === 0 ? 'rgba(255,255,255,0.9)' : product.imageColor,
            letterSpacing: '0.1em',
            lineHeight: 1.3,
            textTransform: 'uppercase',
            textShadow: i === 0 ? 'none' : `0 0 20px ${product.imageColor}40`,
          }}>
            {line}
          </div>
        ))}
      </div>

      {/* Bottom info bar placeholder */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '3px',
        background: `linear-gradient(90deg, transparent, ${product.imageColor}60, transparent)`,
      }} />
    </div>
  );
}

export default function ProductCard({ product, onAddToCart, onViewDetails }) {
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isLowStock = product.stock > 0 && product.stock < 50;
  const isInStock = product.stock > 0;

  const priceDisplay = product.priceMin === product.priceMax
    ? `€${product.priceMin.toFixed(2)}`
    : `€${product.priceMin.toFixed(2)} - €${product.priceMax.toFixed(2)}`;

  const stockDisplay = product.stock >= 99999
    ? '∞ in stock'
    : `${product.stock.toLocaleString('de-DE')} in stock`;

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="product-card"
      id={`product-${product.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onViewDetails?.(product)}
    >
      {/* Image */}
      <div style={{ position: 'relative' }}>
        <ProductImagePlaceholder product={product} />
        
        {/* Crown Badge */}
        <div className="crown-badge" style={{
          background: hovered ? 'rgba(0,180,255,0.2)' : 'rgba(0,180,255,0.1)',
          transition: 'all 0.3s ease',
        }}>
          <Crown size={10} />
          {product.featured ? 'TOP' : 'NEW'}
        </div>
      </div>

      {/* Body */}
      <div className="product-card-body">
        <h3 style={{
          fontWeight: '700', fontSize: '0.95rem',
          marginBottom: '0.6rem', color: 'white',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {product.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <span className="price-text">{priceDisplay}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Package size={11} style={{ color: isLowStock ? '#f59e0b' : isInStock ? '#22c55e' : '#ef4444' }} />
            <span className={`stock-badge ${isLowStock ? 'low-stock' : isInStock ? 'in-stock' : ''}`}>
              {stockDisplay}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          id={`add-cart-${product.id}`}
          onClick={(e) => { e.stopPropagation(); handleAdd(); }}
          style={{
            width: '100%',
            background: added
              ? 'linear-gradient(135deg, #22c55e, #16a34a)'
              : 'linear-gradient(135deg, rgba(0,180,255,0.08), rgba(124,58,237,0.06))',
            border: `1px solid ${added ? 'rgba(34,197,94,0.4)' : 'rgba(0,180,255,0.2)'}`,
            color: added ? 'white' : '#00b4ff',
            borderRadius: '10px',
            padding: '0.6rem 0',
            cursor: 'pointer',
            fontWeight: '600', fontSize: '0.8rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontFamily: 'Inter, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
          onMouseEnter={e => {
            if (!added) {
              e.currentTarget.style.background = 'linear-gradient(135deg, #00e5ff, #0070ff, #7c3aed)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,180,255,0.35)';
              e.currentTarget.style.borderColor = 'rgba(0,180,255,0.5)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={e => {
            if (!added) {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,180,255,0.08), rgba(124,58,237,0.06))';
              e.currentTarget.style.color = '#00b4ff';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(0,180,255,0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          <ShoppingCart size={13} />
          {added ? '✓ Hinzugefügt' : 'In den Warenkorb'}
        </button>
      </div>
    </div>
  );
}
