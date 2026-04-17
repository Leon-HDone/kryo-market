import { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import Reviews from './components/Reviews';
import ProductModal from './components/ProductModal';
import CheckoutModal from './components/CheckoutModal';
import OrdersModal from './components/OrdersModal';
import LegalModal from './components/LegalModal';
import AdminDashboard from './components/AdminDashboard';
import { useCart } from './hooks/useCart';
import { products } from './data/products';
import './index.css';
import backImg from './assets/back.png';

// Toast Notification
function Toast({ message, onHide }) {
  useEffect(() => {
    const t = setTimeout(onHide, 2500);
    return () => clearTimeout(t);
  }, [onHide]);

  return (
    <div className="toast">
      <span style={{ color: '#22c55e' }}>✓</span> {message}
    </div>
  );
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const [legalOpen, setLegalOpen] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);

  const { items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice } = useCart();

  // Prüfe URL-Parameter nach Stripe-Redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      setCheckoutSuccess(true);
      setToast('🎉 Zahlung erfolgreich! Deine Keys wurden per E-Mail gesendet.');
      clearCart();
      // URL bereinigen
      window.history.replaceState({}, '', window.location.pathname);
    } else if (params.get('checkout') === 'cancelled') {
      setToast('Checkout abgebrochen.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const handleAddToCart = (product) => {
    addItem(product);
    setToast(`${product.title} zum Warenkorb hinzugefügt`);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundImage: `url(${backImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative' 
    }}>
      {/* Background Overlay for Blur and Dimming */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(3, 3, 8, 0.4)' // slight dimming to keep text readable
      }} />

      {/* Background Ambient Effects */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 80% 40% at 50% -5%, rgba(0,180,255,0.08) 0%, transparent 60%)',
      }} />
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 60% 40% at 80% 100%, rgba(124,58,237,0.04) 0%, transparent 60%)',
      }} />

      {/* Subtle grid overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(0,180,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,180,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Scanlines */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,180,255,0.008) 3px, rgba(0,180,255,0.008) 4px)',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Header totalItems={totalItems} onCartOpen={() => setCartOpen(true)} onOrdersOpen={() => setOrdersOpen(true)} />

        {/* Hero + Search + Filter */}
        <div style={{ paddingTop: '72px' }}>
          <Hero
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>

        {/* Divider */}
        <div className="section-divider" style={{ marginBottom: '2.5rem' }} />

        {/* Products */}
        <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} onViewDetails={setSelectedProduct} />

        {/* Divider */}
        <div className="section-divider" style={{ marginBottom: '2.5rem' }} />

        {/* Reviews */}
        <Reviews />

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid rgba(0,180,255,0.06)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          color: '#3d4566',
          fontSize: '0.85rem',
        }}>
          <div style={{
            maxWidth: '1280px', margin: '0 auto',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
          }}>
            <span>
              © 2025{' '}
              <strong className="gradient-text-brand" style={{
                WebkitTextFillColor: 'unset',
                backgroundClip: 'unset',
                WebkitBackgroundClip: 'unset',
                background: 'none',
                color: '#00b4ff',
              }}>
                Kryo Market
              </strong>
              . Alle Rechte vorbehalten.
            </span>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {['Datenschutz', 'AGB', 'Impressum', 'Admin'].map(link => (
                <button
                  key={link}
                  onClick={() => {
                    if (link === 'Admin') setAdminOpen(true);
                    else setLegalOpen(link);
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3d4566', transition: 'color 0.3s', fontSize: '0.82rem', padding: 0 }}
                  onMouseEnter={e => e.target.style.color = '#00b4ff'}
                  onMouseLeave={e => e.target.style.color = '#3d4566'}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </footer>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        onRemove={removeItem}
        onUpdateQty={updateQty}
        totalPrice={totalPrice}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
      />

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={items}
        totalPrice={totalPrice}
        onSuccess={() => {
          clearCart();
          setCheckoutOpen(false);
          setToast('🎉 Zahlung erfolgreich! Deine Keys wurden per E-Mail gesendet.');
        }}
      />

      {/* Orders Modal */}
      <OrdersModal
        isOpen={ordersOpen}
        onClose={() => setOrdersOpen(false)}
      />

      {/* Legal Modal */}
      <LegalModal
        type={legalOpen}
        onClose={() => setLegalOpen(null)}
      />

      {/* Admin Dashboard Overlay */}
      {adminOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 4000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem', backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(15px)',
        }}>
          <div style={{ position: 'absolute', inset: 0 }} onClick={() => setAdminOpen(false)} />
          <div style={{ position: 'relative', width: '100%', maxWidth: '800px', zIndex: 1 }}>
            <AdminDashboard />
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onHide={() => setToast(null)} />}
    </div>
  );
}
