// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";
// import { componentTagger } from "lovable-tagger";

// // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => ({
//   base: "/", // Required for GitHub Pages user site
//   server: {
//     host: "::",
//     port: 8080,
//     allowedHosts: [".ngrok-free.app"], // Only for local dev
//   },
//   plugins: [
//     react(),
//     mode === "development" && componentTagger(),
//   ].filter(Boolean),
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// }));

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/container-booking/',  // Critical for project site deployment
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [".ngrok-free.app"],
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,  // Optional: Increases limit to suppress the warning from your logs
  },
}));