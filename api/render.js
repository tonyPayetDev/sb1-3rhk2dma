const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
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
        downloadLink: `/video.mp4`,  // URL de la vidéo
      });
    });
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
};
