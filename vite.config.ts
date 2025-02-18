import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:5001", // Proxy pour rediriger les requêtes vers le backend
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    exclude: ["@remotion/player", "remotion"],
  },
});
