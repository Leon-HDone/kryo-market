import ProductCard from './ProductCard';

export default function ProductGrid({ products, onAddToCart, onViewDetails }) {
  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1.5rem', color: '#8b9cc8' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
        <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Keine Produkte gefunden.</p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.7 }}>Andere Suchbegriffe oder Kategorie versuchen.</p>
      </div>
    );
  }

  return (
    <section id="products" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem',
      }}>
        {products.map((product, idx) => (
          <div
            key={product.id}
            className="animate-fade-up"
            style={{ animationDelay: `${idx * 0.06}s`, animationFillMode: 'both', opacity: 0 }}
          >
            <ProductCard product={product} onAddToCart={onAddToCart} onViewDetails={onViewDetails} />
          </div>
        ))}
      </div>
    </section>
  );
}
