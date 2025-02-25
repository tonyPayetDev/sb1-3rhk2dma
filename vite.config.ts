import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permet d'écouter sur toutes les interfaces réseau
    port: 5000, // Le port que vous souhaitez utiliser
    https: false, // Désactive HTTPS
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    exclude: ["@remotion/player", "remotion"],
  },
});
