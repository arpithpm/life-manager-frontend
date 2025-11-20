import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use /life-manager-frontend/ base path only for production builds (GitHub Pages)
  // Use / for local development
  base: command === "build" ? "/life-manager-frontend/" : "/",
}));
