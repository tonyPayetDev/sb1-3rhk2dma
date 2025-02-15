# Étape 1 : Utiliser une image de base Node.js
FROM node:18

# Étape 2 : Créer et définir le répertoire de travail
WORKDIR /app

# Étape 3 : Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Étape 4 : Installer les dépendances
RUN npm install

# Étape 5 : Copier le reste des fichiers du projet
COPY . .

# Étape 6 : Exposer le port sur lequel l'application sera exécutée
EXPOSE 3000

# Étape 7 : Démarrer le serveur backend et le frontend en parallèle
CMD ["sh", "-c", "npm run server & npm run dev"]
