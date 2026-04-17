// Produktdaten für Kryo Market
// Du kannst hier eigene Bilder hinzufügen: Ersetze imageUrl mit dem Pfad deines Bildes
// z.B. imageUrl: '/images/discord.jpg'  (Bilder in public/images/ ablegen)

export const categories = [
  'All',
  'Accounts',
  'Social',
  'Games',
  'Generators',
  'Methods',
  'Spoofers',
  'VPN',
  'Boosting',
  'FiveM',
  'Tools',
];

export const products = categories.filter(c => c !== 'All').map((cat, idx) => ({
  id: idx + 1,
  title: `Test ${cat}`,
  category: cat,
  priceMin: 0.99,
  priceMax: 9.99,
  stock: 100,
  featured: idx < 3, // Mach die ersten 3 zu "Featured"
  imageUrl: null,
  imageLabel: `TEST\n${cat.toUpperCase()}`,
  imageColor: `hsl(${idx * 36}, 80%, 55%)`,
  icon: '🧪',
  description: `Dies ist ein Platzhalter-Produkt für die Kategorie ${cat}.`,
}));
