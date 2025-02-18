import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';
import { config } from 'dotenv';

config(); // Charger le fichier .env

// Convertir __dirname pour ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Créer le dossier 'out' si il n'existe pas
const outDir = path.join(__dirname, 'out');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Ensuite, écris le fichier 'inputProps.json'
fs.writeFileSync(propsPath, JSON.stringify({ questions, style }));

// Initialiser Express
const app = express();
app.use(express.json());
app.use(cors());

// Définir le port du serveur
const PORT = process.env.PORT || 5000;

app.post('/api/render', (req, res) => {
  const { questions, style } = req.body;
  const outputPath = path.join(__dirname, 'out', 'video.mp4');
  const propsPath = path.join(__dirname, 'out', 'inputProps.json');

  console.log('📌 Requête reçue avec les données :', { questions, style });

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'Les questions ne sont pas valides ou sont vides !' });
  }

  // Sauvegarder les props dans un fichier JSON
  fs.writeFileSync(propsPath, JSON.stringify({ questions, style }));

  const command = `npx remotion render src/components/remotionEntry.tsx VideoGenerator ${outputPath} --props=${propsPath} --no-sandbox`;

  console.log('🎥 Exécution de la commande :', command);

  exec(command, { maxBuffer: 1024 * 10000 }, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Erreur lors du rendu :', error);
      return res.status(500).json({ error: error.message, stderr });
    }

    console.log('✅ Vidéo générée avec succès !');
    console.log('📄 Logs stdout:', stdout);
    console.log('⚠️ Logs stderr:', stderr);

    res.json({
      message: 'Vidéo prête !',
      downloadLink: '/video.mp4',  // URL de la vidéo
    });
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});

export default app; // Exporte le serveur pour être utilisé dans d'autres fichiers ou comme handler Vercel
