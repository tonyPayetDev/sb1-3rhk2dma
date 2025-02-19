import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Écoute sur toutes les interfaces
    port: 5000, // Port utilisé en local
    https: false, // Coolify gère HTTPS
    proxy: {
      "/api": {
        target: "https://dev.tonypayet.com", // Redirige /api vers le backend HTTPS
        changeOrigin: true,
        secure: true,
      }
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    exclude: ["@remotion/player", "remotion"],
  },
});
