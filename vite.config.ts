import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/" : "/", // Set base to "/" for GitHub Pages
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [".ngrok-free.app"], // Only needed for local dev with ngrok
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(), // componentTagger only in dev
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));