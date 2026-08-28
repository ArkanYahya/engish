import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    // Replaces the old hand-rolled public/sw.js, which precached assets by regex-scraping
    // index.html's own <link>/<script> tags — that missed Ionic's dynamically-imported
    // chunks entirely (they never appear as static tags in the HTML), so an offline visit
    // could hang the first time a not-yet-cached chunk was needed. This generates a real
    // precache manifest of every build output file instead.
    VitePWA({
      registerType: "autoUpdate",
      manifest: false, // keep using the existing public/manifest.webmanifest + its <link> tag
      includeAssets: ["favicon.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,webmanifest}"],
      },
    }),
  ],
});
