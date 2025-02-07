import express from 'express';
import cors from 'cors';
import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia } from '@remotion/renderer';
import { tmpdir } from 'os';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const execPath = '/usr/local/bin/google-chrome'; // Remplace par le bon chemin de Chrome installé sur ton serveur

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Store compositions cache
let bundled = null;
let compositions = null;

app.post('/api/render', async (req, res) => {
  try {
    const { questions, style, duration, backgroundMusic } = req.body;

    // Bundle the video if not already bundled
    if (!bundled) {
      bundled = await bundle(
        join(__dirname, '../src/components/remotionEntry.tsx')
      );
    }

    // Get compositions if not already fetched
    if (!compositions) {
      compositions = await getCompositions(bundled, {
        browserExecutable: execPath, // 🛠️ Forcer Puppeteer à utiliser Chrome installé
        chromiumOptions: {
          noSandbox: true,
          disableWebSecurity: true,
          gl: 'swiftshader',
          headless: true,
        },
        onBrowserDownload: () => {
          throw new Error('Puppeteer ne doit pas télécharger Chrome !'); // ❌ Empêche le téléchargement
        },
      });
    }

    // Create temporary file for the video
    const outputPath = join(tmpdir(), `${Date.now()}.mp4`);

    // Render the video
    await renderMedia({
      composition: compositions[0],
      serveUrl: bundled,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: {
        questions,
        style,
        backgroundMusic,
      },
      durationInFrames: duration * 30,
      fps: 30,
      executablePath: execPath, // Assure-toi que ce chemin est correct
      chromiumOptions: {
        gl: 'swiftshader', // Accélération graphique
        disableWebSecurity: true, // Désactiver la sécurité web
        noSandbox: true, // Évite les erreurs de permission
        headless: true, // Exécuter Chrome en mode headless
      },
    });

    // Read the rendered video
    const video = await readFile(outputPath);

    // Set response headers
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename="quiz.mp4"');

    // Send the video
    res.send(video);

    // Clean up: delete the temporary file
    await unlink(outputPath);
  } catch (error) {
    console.error('Error rendering video:', error);
    res.status(500).json({ error: 'Failed to render video' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(
    `Server running on port ${port} url: https://sb13rhk2dma-bzi2--5173--d20a0a75.local-credentialless.webcontainer.io`
  );
});
