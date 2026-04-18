
/**
 * Sendet eine Discord Webhook Benachrichtigung bei einem erfolgreichen Kauf.
 * @param {Object} params - Die Bestelldetails.
 */
export async function sendOrderWebhook({ orderId, email, totalAmount, ipAddress, products }) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const embed = {
    title: `🛒 Neuer Kauf erfolgreich! (Order #${orderId})`,
    color: 0x00b4ff, // Kryo Market Blue
    fields: [
      { name: '👤 Kunde (E-Mail)', value: email, inline: true },
      { name: '🌐 IP Adresse', value: ipAddress || 'Unbekannt', inline: true },
      { name: '💰 Umsatz', value: `€${parseFloat(totalAmount).toFixed(2)}`, inline: true },
    ],
    footer: {
      text: 'Kryo Market System',
    },
    timestamp: new Date().toISOString(),
  };

  const productList = products.map(p => `• ${p.productTitle}`).join('\n');
  embed.fields.push({ name: '📦 Gekaufte Produkte', value: productList || 'Keine Angabe', inline: false });

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: 'Kryo Market Bot',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
        embeds: [embed] 
      }),
    });
    console.log(`✅ Discord-Webhook gesendet für Order #${orderId}`);
  } catch (err) {
    console.error('❌ Fehler beim Senden des Discord-Webhooks:', err);
  }
}
