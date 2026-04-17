import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function LegalModal({ type, onClose }) {
  useEffect(() => {
    if (type) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [type]);

  if (!type) return null;

  const content = {
    AGB: `
      <h2>Allgemeine Geschäftsbedingungen (AGB)</h2>
      <p>Willkommen bei Kryo Market. Durch den Kauf auf unserer Plattform stimmen Sie diesen Bedingungen zu.</p>
      
      <h3>1. Vertragsgegenstand</h3>
      <p>Wir verkaufen digitale Güter, Accounts und Software-Lizenzen. Alle Verkäufe sind endgültig.</p>

      <h3>2. Lieferung</h3>
      <p>Die Auslieferung erfolgt digital an die von Ihnen angegebene E-Mail-Adresse, meist sofort nach Zahlungseingang.</p>

      <h3 style="color: #ef4444;">3. Garantie und Gewährleistung (ACHTUNG)</h3>
      <p>Wir garantieren, dass die Produkte zum Zeitpunkt der Auslieferung voll funktionsfähig sind. <strong>WICHTIG: Wenn Produkte vor mehr als 3 Tagen (72 Stunden) gekauft wurden und danach nicht mehr funktionieren, übernehmen wir dafür KEINE Verantwortung und leisten keinen Ersatz.</strong> Sie sind selbst für die Sicherheit und vertragsgemäße Nutzung der Accounts/Keys verantwortlich.</p>
      
      <h3>4. Rückerstattungen</h3>
      <p>Da es sich um digitale Güter handelt, bei denen das Widerrufsrecht gemäß Verbraucherschutzrichtlinien vorzeitig erlischt, bieten wir keine Rückerstattungen an, sofern der gelieferte Artikel funktionsfähig war.</p>
    `,
    Datenschutz: `
      <h2>Datenschutzerklärung</h2>
      <p>Der Schutz Ihrer Daten ist uns wichtig. Hier erklären wir, wie wir Ihre Daten verarbeiten.</p>
      
      <h3>1. Erhobene Daten</h3>
      <p>Bei einer Bestellung erheben wir Ihre E-Mail-Adresse zur Auslieferung der digitalen Güter. Weitere Zahlungsdetails werden sicher und direkt durch unseren Zahlungsdienstleister (Stripe) verarbeitet.</p>

      <h3>2. Nutzung der Daten</h3>
      <p>Wir nutzen Ihre E-Mail-Adresse ausschließlich zur Zusendung Ihrer erworbenen Produkte (Order Fulfillment) und für Rückfragen bezüglich Ihrer Bestellung. Wir geben Ihre E-Mail nicht an Dritte für Marketingzwecke weiter.</p>
      
      <h3>3. Drittanbieter</h3>
      <p>Wir verwenden Stripe zur sicheren Abwicklung von Zahlungen. Stripe verarbeitet Ihre Daten gemäß deren eigenen Datenschutzrichtlinien. Zur E-Mail-Zustellung nutzen wir Resend.</p>

      <h3>4. Ihre Rechte</h3>
      <p>Sie haben jederzeit das Recht auf Auskunft, Löschung oder Sperrung Ihrer gespeicherten Daten. Kontaktieren Sie uns hierfür über unseren Support.</p>
    `,
    Impressum: `
      <h2>Impressum</h2>
      <p>Angaben gemäß Telemediengesetz (TMG):</p>
      
      <p>
        <strong>Seitenbetreiber:</strong><br/>
        Kryo Market Management<br/>
        (Hier kannst du später deinen echten Namen & Adresse eintragen, falls geschäftlich erforderlich)
      </p>

      <p>
        <strong>Kontakt:</strong><br/>
        E-Mail: support@kryomarket.example<br/>
        Discord: Kryo Community
      </p>

      <p>
        <strong>Haftungsausschluss:</strong><br/>
        Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
      </p>
    `
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 3000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />

      <div className="animate-fade-up" style={{
        position: 'relative', width: '100%', maxWidth: '600px', maxHeight: '85vh',
        background: 'linear-gradient(180deg, #0c0c1c 0%, #080812 100%)',
        border: '1px solid rgba(0, 180, 255, 0.15)',
        borderRadius: '20px',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 80px rgba(0,0,0,0.8), 0 0 60px rgba(0,180,255,0.08)',
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          padding: '1.5rem 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <h2 style={{ fontWeight: '700', fontSize: '1.25rem', color: 'white' }}>{type}</h2>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,0,0,0.2)'; e.currentTarget.style.borderColor = 'red'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          ><X size={16} /></button>
        </div>

        {/* Content */}
        <div style={{
          padding: '2rem 1.5rem',
          overflowY: 'auto',
          color: '#8b9cc8',
          fontSize: '0.9rem',
          lineHeight: '1.6',
        }}>
          <div 
            dangerouslySetInnerHTML={{ __html: content[type] }} 
            className="legal-content"
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          />
        </div>

      </div>
    </div>
  );
}
