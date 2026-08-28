import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Single source of truth for the version shown on the About screen — read straight from
// package.json at build time so it can't drift out of sync with a hand-copied string.
const { version: appVersion } = JSON.parse(readFileSync(new URL("./package.json", import.meta.url)));

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
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
