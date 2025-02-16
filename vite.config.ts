import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Permet à Vite d'écouter sur toutes les interfaces réseau
    port: 3000,
   proxy: {
  '/api': {
    target: 'http://127.0.0.1:5001', // Utiliser l'IP de l'hôte dans Docker
    changeOrigin: true,
    secure: false
  }
}
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@remotion/player', 'remotion'],
  }
});
