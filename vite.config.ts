import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    fs: {
      allow: ['app'] // Autoriser l'accès au dossier /app
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@remotion/player', 'remotion'],
  }
});
