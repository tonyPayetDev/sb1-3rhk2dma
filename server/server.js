import express from "express";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

// Convertir __dirname pour ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(express.json());

app.post("/api/render", (req, res) => {
  const outputPath = path.join(__dirname, "out/video.mp4");
  const command =
    "npx remotion render src/components/remotionEntry.tsx VideoGenerator out/video.mp4";

  console.log("🎥 Début du rendu vidéo...");

  exec(command, { maxBuffer: 1024 * 10000 }, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Erreur lors du rendu :", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("✅ Vidéo générée avec succès !");
    res.json({
      message: "Vidéo prête !",
      downloadLink: "http://localhost:5000/video.mp4",
    });
  });
});

app.use("/video.mp4", express.static(path.join(__dirname, "out/video.mp4")));

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
