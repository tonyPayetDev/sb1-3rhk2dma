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

  // 🔥 Optimisation du rendu : prendre en compte la durée de chaque question
  const framesPerSecond = 30;
  let totalDurationInSeconds = 0;

  // Calculer la durée totale en secondes à partir de chaque question
questions.forEach(question => {
  if (typeof question.duration !== "number" || question.duration <= 0) {
    console.error("❌ Durée invalide pour la question :", question);
    return res.status(400).json({ error: "La durée de certaines questions est invalide." });
  }
  totalDurationInSeconds += question.duration;
  console.log("✅ Durée de la question:", question.duration);
});


  const durationInFrames = 500 ; // totalDurationInSeconds * framesPerSecond;

  console.log("🎥 Durée totale en frames :", durationInFrames);

  // Commande d'exécution avec des optimisations supplémentaires
const command = `npx remotion render src/components/remotionEntry.tsx VideoGenerator ${outputPath} --props=${propsPath} --log=verbose --no-sandbox --headless --durationInFrames=${durationInFrames} --resolution=1280x720`;

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

    // Si le fichier est généré correctement
    res.json({
      message: "Vidéo prête !",
      downloadLink: `https://dev.tonypayet.com/api/video.mp4`, // Enlever le port si présent
    });
  });
});

app.use("/api/video.mp4", (req, res) => {
  const filePath = path.resolve(__dirname, 'out/video.mp4');

  if (fs.existsSync(filePath)) {
    console.log("📂 Envoi du fichier vidéo :", filePath);
    res.setHeader("Content-Type", "video/mp4");
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("❌ Erreur lors de l'envoi du fichier :", err);
        res.status(500).json({ error: "Erreur lors de l'envoi du fichier vidéo." });
      }
    });
  } else {
    console.error("❌ Fichier vidéo non trouvé !");
    res.status(404).json({ error: "Vidéo non trouvée. Essayez de la régénérer." });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Serveur démarré sur http://0.0.0.0:5000');
});
