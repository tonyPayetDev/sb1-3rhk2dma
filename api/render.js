import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { config } from 'dotenv';

config(); // Charger les variables d'environnement

const app = express();
app.use(express.json());
app.use(cors());

// Utiliser /tmp pour éviter les erreurs d'écriture sur Vercel
const outDir = "/tmp/out";
const propsPath = path.join(outDir, "inputProps.json");
const outputPath = path.join(outDir, "video.mp4");

// Vérifier et créer le dossier si nécessaire
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

app.post('/api/render', async (req, res) => {
  try {
    const { questions, style } = req.body;

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
        downloadLink: '/api/video', // Endpoint pour récupérer la vidéo
      });
    });
  } catch (err) {
    console.error('🚨 Erreur serveur:', err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Endpoint pour récupérer la vidéo générée
app.get('/api/video', (req, res) => {
  if (!fs.existsSync(outputPath)) {
    return res.status(404).json({ error: 'Vidéo non trouvée' });
  }
  res.sendFile(outputPath);
});

export default app;
