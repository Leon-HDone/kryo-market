FROM node:22-alpine

# Arbeitsverzeichnis setzen
WORKDIR /app

# Nur die package.json Dateien kopieren
COPY package.json ./
COPY server/package.json server/

# Abhängigkeiten installieren (bewusst npm install, um den npm ci Fehler zu umgehen)
RUN npm install
RUN cd server && npm install

# Den kompletten restlichen Code kopieren
COPY . .

# Das Frontend (Vite) bauen
RUN npm run build

# Port freigeben und als Production markieren
EXPOSE 3001
ENV NODE_ENV=production

# Server starten
CMD ["node", "server/index.js"]
