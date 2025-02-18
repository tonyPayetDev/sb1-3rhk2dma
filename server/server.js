// import express from "express";
// import path from "path";
// import { fileURLToPath } from "url";
// import fs from "fs";
// import cors from "cors";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const app = express();
// const PORT = 5001;

// app.use(cors({
//   origin: 'http://localhost:3000', // Assure-toi que ton frontend pointe vers cette origine
// }));

// // Servir la vidéo générée
// app.get("/api/render", (req, res) => {
//   const filePath = path.join(__dirname, "out/video.mp4");

//   if (fs.existsSync(filePath)) {
//     res.sendFile(filePath);
//   } else {
//     res.status(404).json({ error: "Vidéo non trouvée." });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
// });

import express from "express";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import fs from "fs";
import { config } from 'dotenv';
config(); // Charger le fichier .env
// Convertir __dirname pour ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiUrl = process.env.VITE_API_URL; // Accéder à la variable d'environnement

// Vérification
console.log("VITE_API_URL is:", apiUrl);

const app = express();
const PORT = 5000;  // Changez de 5001 à 5002

app.use(cors()); // ✅ Autorise les requêtes depuis un autre domaine
app.use(express.json());

// Endpoint simple pour tester si l'API fonctionne
app.get("/api/status", (req, res) => {
  res.json({ status: "API is running", message: "Everything is working fine!" });
});

// Lancer l'application sur le port défini
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.post("/api/render", (req, res) => {
  const { questions, style } = req.body;
  const outputPath = path.join(__dirname, "out/video.mp4");
  const propsPath = path.join(__dirname, "out/inputProps.json");

  console.log("📌 Requête reçue avec les données :", { questions, style });

  if (!Array.isArray(questions) || questions.length === 0) {
    return res
      .status(400)
      .json({ error: "Les questions ne sont pas valides ou sont vides !" });
  }

  // 🔥 Sauvegarder les props dans un fichier JSON pour éviter les problèmes d'échappement
  fs.writeFileSync(propsPath, JSON.stringify({ questions, style }));

 const command = ` npx remotion render src/components/remotionEntry.tsx VideoGenerator ${outputPath} --props=${propsPath} --no-sandbox`;

  console.log("🎥 Exécution de la commande :", command);

  exec(command, { maxBuffer: 1024 * 10000 }, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Erreur lors du rendu :", error);
      return res.status(500).json({ error: error.message, stderr });
    }

    console.log("✅ Vidéo générée avec succès !");
    console.log("📄 Logs stdout:", stdout);
    console.log("⚠️ Logs stderr:", stderr);

    res.json({
      message: "Vidéo prête !",
      downloadLink: `https://m6hl5l-5000.csb.app/video.mp4`,
    });
  });
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
