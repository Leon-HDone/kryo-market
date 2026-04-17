import { useState, useEffect } from 'react';
import { products } from '../data/products';

export default function AdminDashboard() {
  const [adminToken, setAdminToken] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [keysText, setKeysText] = useState('');
  const [message, setMessage] = useState(null);

  // Simple auth: ask for token once per session
  useEffect(() => {
    const token = prompt('Bitte Admin-Token eingeben (aus .env)');
    if (token) setAdminToken(token);
  }, []);

  const handleUpload = async () => {
    if (!adminToken) return setMessage('Kein Admin-Token');
    if (!selectedProductId) return setMessage('Produkt auswählen');
    const keys = keysText.split('\n').map(k => k.trim()).filter(k => k);
    if (keys.length === 0) return setMessage('Keine Keys eingegeben');

    try {
      const res = await fetch('/api/admin/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify({ productId: Number(selectedProductId), keys }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${data.inserted} Keys wurden gespeichert`);
        setKeysText('');
      } else {
        setMessage(`❌ Fehler: ${data.error}`);
      }
    } catch (e) {
      setMessage('❌ Netzwerkfehler');
    }
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      background: 'rgba(10,10,24,0.9)',
      color: '#fff',
      borderRadius: '12px',
    }}>
      <h2>🔧 Admin Dashboard – Keys verwalten</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>Produkt auswählen:</label>
        <select
          value={selectedProductId}
          onChange={e => setSelectedProductId(e.target.value)}
          style={{
            marginLeft: '0.5rem',
            padding: '0.4rem',
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid #00b4ff',
          }}
        >
          <option value="">-- Produkt --</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Keys (eine pro Zeile):</label>
        <textarea
          rows={10}
          value={keysText}
          onChange={e => setKeysText(e.target.value)}
          style={{
            width: '100%',
            marginTop: '0.5rem',
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid #00b4ff',
            padding: '0.5rem',
          }}
        />
      </div>
      <button
        onClick={handleUpload}
        style={{
          background: '#00b4ff',
          color: '#000',
          border: 'none',
          padding: '0.6rem 1.2rem',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        📤 Keys hochladen
      </button>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
