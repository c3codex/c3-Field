import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), cloudflare()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@pillars": path.resolve(__dirname, "./src/pillars"),
      "@systems": path.resolve(__dirname, "./src/systems"),
      "@shared": path.resolve(__dirname, "./src/pillars/shared"),
      "@structure": path.resolve(__dirname, "./src/structure"),
    },
  },
});