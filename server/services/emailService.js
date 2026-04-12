import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.FROM_EMAIL || 'Kryo Market <onboarding@resend.dev>';

/**
 * Sendet die gekauften Keys per E-Mail an den Kunden.
 */
export async function sendKeyDelivery(email, order, keysByProduct) {
  if (!resend) {
    console.warn('⚠️ RESEND_API_KEY nicht gesetzt – E-Mail wird nur geloggt:');
    console.log(`📧 An: ${email}`);
    console.log(`📦 Bestellung #${order.id}`);
    keysByProduct.forEach(({ productTitle, keys }) => {
      console.log(`  → ${productTitle}: ${keys.join(', ')}`);
    });
    return { success: true, simulated: true };
  }

  // Hübsche HTML E-Mail im Kryo-Stil
  const keyRows = keysByProduct.map(({ productTitle, keys }) => `
    <div style="margin-bottom: 16px;">
      <div style="color: #00b4ff; font-weight: 700; font-size: 14px; margin-bottom: 8px;">
        ${productTitle}
      </div>
      ${keys.map(key => `
        <div style="background: rgba(0,180,255,0.05); border: 1px solid rgba(0,180,255,0.15); 
                    border-radius: 8px; padding: 10px 14px; margin-bottom: 6px; 
                    font-family: 'Courier New', monospace; font-size: 14px; color: #f0f4ff;
                    word-break: break-all;">
          ${key}
        </div>
      `).join('')}
    </div>
  `).join('');

  const html = `
    <div style="background: #030308; color: #f0f4ff; font-family: 'Inter', Arial, sans-serif; padding: 0; margin: 0;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 24px;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; background: linear-gradient(135deg, #00e5ff, #0070ff, #7c3aed); 
                      padding: 12px 16px; border-radius: 12px; margin-bottom: 16px;">
            <span style="color: white; font-weight: 800; font-size: 18px; letter-spacing: 2px;">❄️ KRYO MARKET</span>
          </div>
          <h1 style="font-size: 24px; font-weight: 800; margin: 8px 0 4px;">Deine Bestellung ist da! 🎉</h1>
          <p style="color: #7e8bb6; font-size: 14px;">Bestellung #${order.id}</p>
        </div>

        <!-- Divider -->
        <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(0,180,255,0.3), transparent); margin: 24px 0;"></div>

        <!-- Keys -->
        <div style="margin-bottom: 24px;">
          <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 16px; color: white;">
            🔑 Deine Keys
          </h2>
          ${keyRows}
        </div>

        <!-- Info -->
        <div style="background: rgba(0,180,255,0.03); border: 1px solid rgba(0,180,255,0.1); 
                    border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <p style="color: #7e8bb6; font-size: 13px; line-height: 1.6; margin: 0;">
            💡 <strong style="color: white;">Tipp:</strong> Bewahre diese E-Mail sicher auf. 
            Du kannst deine Bestellungen jederzeit auf unserer Website unter 
            <strong style="color: #00b4ff;">Your Orders</strong> mit deiner E-Mail abrufen.
          </p>
        </div>

        <!-- Betrag -->
        <div style="text-align: center; padding: 16px; background: rgba(124,58,237,0.05); 
                    border: 1px solid rgba(124,58,237,0.1); border-radius: 12px; margin-bottom: 24px;">
          <span style="color: #7e8bb6; font-size: 13px;">Gesamtbetrag: </span>
          <span style="color: #00b4ff; font-weight: 800; font-size: 20px;">€${order.total_amount}</span>
        </div>

        <!-- Footer -->
        <div style="text-align: center; color: #3d4566; font-size: 12px; padding-top: 16px; 
                    border-top: 1px solid rgba(0,180,255,0.06);">
          <p>© ${new Date().getFullYear()} Kryo Market. Alle Rechte vorbehalten.</p>
          <p style="margin-top: 4px;">Bei Fragen kontaktiere uns auf Discord.</p>
        </div>
      </div>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `🔑 Deine Keys – Bestellung #${order.id} | Kryo Market`,
      html,
    });

    if (error) {
      console.error('❌ E-Mail Fehler:', error);
      return { success: false, error };
    }

    console.log(`📧 Key-E-Mail gesendet an ${email} (ID: ${data.id})`);
    return { success: true, id: data.id };
  } catch (err) {
    console.error('❌ E-Mail Exception:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Sendet einen 6-stelligen Verifikationscode per E-Mail.
 */
export async function sendVerificationCode(email, code) {
  if (!resend) {
    console.warn('⚠️ RESEND_API_KEY nicht gesetzt – Code wird nur geloggt:');
    console.log(`📧 Verifikationscode für ${email}: ${code}`);
    return { success: true, simulated: true };
  }

  const html = `
    <div style="background: #030308; color: #f0f4ff; font-family: 'Inter', Arial, sans-serif; padding: 0;">
      <div style="max-width: 480px; margin: 0 auto; padding: 40px 24px; text-align: center;">
        <div style="display: inline-block; background: linear-gradient(135deg, #00e5ff, #0070ff, #7c3aed); 
                    padding: 10px 14px; border-radius: 12px; margin-bottom: 20px;">
          <span style="color: white; font-weight: 800; font-size: 16px; letter-spacing: 2px;">❄️ KRYO MARKET</span>
        </div>
        
        <h1 style="font-size: 22px; font-weight: 800; margin-bottom: 8px;">Dein Bestätigungscode</h1>
        <p style="color: #7e8bb6; font-size: 14px; margin-bottom: 30px;">
          Gib diesen Code auf der Website ein, um deine Bestellungen einzusehen.
        </p>
        
        <div style="background: rgba(0,180,255,0.05); border: 2px solid rgba(0,180,255,0.3); 
                    border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #00b4ff;
                       font-family: 'Courier New', monospace;">
            ${code}
          </span>
        </div>
        
        <p style="color: #3d4566; font-size: 12px;">
          Dieser Code ist <strong>5 Minuten</strong> gültig. Falls du ihn nicht angefordert hast, ignoriere diese E-Mail.
        </p>
      </div>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `🔒 Dein Code: ${code} | Kryo Market`,
      html,
    });

    if (error) {
      console.error('❌ Verifikations-E-Mail Fehler:', error);
      return { success: false, error };
    }

    console.log(`📧 Verifikationscode gesendet an ${email}`);
    return { success: true, id: data.id };
  } catch (err) {
    console.error('❌ E-Mail Exception:', err.message);
    return { success: false, error: err.message };
  }
}
