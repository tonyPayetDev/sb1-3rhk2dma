FROM node:18


COPY package*.json ./
RUN npm install

COPY . .  # Copie tout le projet

CMD ["node", "server/server.js"]  # Chemin correct vers le fichier
