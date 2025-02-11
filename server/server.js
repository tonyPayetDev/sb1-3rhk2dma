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

app.post("/api/render", (req, res) => {
  const outputPath = path.join(__dirname, "out/video.mp4");

  console.log(`🎥 Début du rendu vidéo... Fichier cible: ${outputPath}`);

  exec(
    `npx remotion render src/components/remotionEntry.tsx VideoGenerator ${outputPath}`,
    { maxBuffer: 1024 * 10000 },
    (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Erreur lors du rendu :", error);
        return res.status(500).json({ error: error.message });
      }

      console.log("✅ Vidéo générée avec succès !");
      console.log("📄 Logs stdout:", stdout);
      console.log("⚠️ Logs stderr:", stderr);

      // Vérifier périodiquement si le fichier est bien créé
      const checkFileInterval = setInterval(() => {
        if (fs.existsSync(outputPath)) {
          clearInterval(checkFileInterval);
          console.log("📂 Fichier vidéo trouvé, envoi du lien au frontend.");

          res.json({
            message: "Vidéo prête !",
            downloadLink: `https://m6hl5l-5000.csb.app/video.mp4`,
          });
        }
      }, 1000); // Vérifie toutes les 1 seconde
    }
  );
});

// Servir la vidéo générée
app.use("/video.mp4", (req, res) => {
  const filePath = path.join(__dirname, "out/video.mp4");

  // Vérifie si le fichier existe avant de l'envoyer
  if (fs.existsSync(filePath)) {
    console.log("📂 Envoi du fichier vidéo :", filePath);
    res.sendFile(filePath);
  } else {
    console.error("❌ Fichier vidéo non trouvé !");
    res
      .status(404)
      .json({ error: "Vidéo non trouvée. Essayez de la régénérer." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
