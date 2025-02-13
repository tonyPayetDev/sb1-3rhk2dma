import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Permet d'écouter sur toutes les interfaces réseau
    port: 3000,       // Assurez-vous que le port 5173 est bien exposé
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@remotion/player', 'remotion'],
  }
});
