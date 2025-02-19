import express from "express";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import fs from "fs";

// Convertir __dirname pour ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors()); // ✅ Autorise les requêtes depuis un autre domaine
app.use(express.json());

app.get("/api/status", (req, res) => {
  res.json({ status: "API is running", message: "Everything is working fine!" });
});

app.post("/api/render", (req, res) => {
  const { questions, style } = req.body;
  const outputPath = path.join(__dirname, "out/video.mp4");
  const propsPath = path.join(__dirname, "out/inputProps.json");

  console.log("📌 Requête reçue avec les données :", { questions, style });

  // Vérification des données reçues
  if (!Array.isArray(questions) || questions.length === 0) {
    return res
      .status(400)
      .json({ error: "Les questions ne sont pas valides ou sont vides !" });
  }

  // 🔥 Sauvegarder les props dans un fichier JSON pour éviter les problèmes d'échappement
  try {
    fs.writeFileSync(propsPath, JSON.stringify({ questions, style }), "utf8");
  } catch (error) {
    console.error("❌ Erreur lors de la sauvegarde des props :", error);
    return res.status(500).json({ error: "Erreur lors de la sauvegarde des données." });
  }

  // 🔥 Optimisation du rendu
  const durationInSecondsPerQuestion = 5;
  const framesPerSecond = 30;
  const totalDurationInSeconds = questions.length * durationInSecondsPerQuestion;
  const durationInFrames =50;

  console.log("🎥 Durée totale en frames :", durationInFrames);

  // Commande d'exécution avec des optimisations supplémentaires
  const command = `npx remotion render src/components/remotionEntry.tsx VideoGenerator ${outputPath} --props=${propsPath} --log=verbose --no-sandbox --headless --durationInFrames=${durationInFrames} --jpeg-quality=50`;

  console.log("🎥 Exécution de la commande :", command);

  exec(command, { maxBuffer: 1024 * 10000 }, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Erreur lors du rendu :", error);
      return res.status(500).json({ error: error.message, stderr });
    }

    console.log("✅ Vidéo générée avec succès !");
    console.log("📄 Logs stdout:", stdout);
    console.log("⚠️ Logs stderr:", stderr);

    // Vérification de l'existence du fichier généré avant de répondre
    if (!fs.existsSync(outputPath)) {
      console.error("❌ Vidéo non générée !");
      return res.status(500).json({ error: "Erreur dans la génération de la vidéo." });
    }

    res.json({
      message: "Vidéo prête !",
      downloadLink: `/download/video`, // Lien direct pour télécharger la vidéo
    });
  });
});

// Serve le fichier vidéo depuis le dossier 'out'
app.get('/download/video', (req, res) => {
  const videoPath = path.join(__dirname, 'out', 'video.mp4');
  
  // Vérifier si le fichier existe
  if (fs.existsSync(videoPath)) {
    res.download(videoPath, 'video.mp4', (err) => {
      if (err) {
        console.error("Erreur lors du téléchargement :", err);
        res.status(500).json({ error: "Erreur lors du téléchargement du fichier." });
      }
    });
  } else {
    res.status(404).json({ error: "Le fichier n'existe pas." });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Serveur démarré sur http://0.0.0.0:5000');
});
