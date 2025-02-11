# Utiliser l'image officielle Node.js comme base
FROM node:18

# Créer et définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Copier le fichier package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier tout le code du projet dans le répertoire de travail du conteneur
COPY . .

# Exposer le port sur lequel l'application sera exécutée
EXPOSE 3000

# Commande pour exécuter le serveur backend ou frontend
CMD ["npm", "run", "dev"]
