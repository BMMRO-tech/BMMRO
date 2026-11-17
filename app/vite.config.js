import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    // Generates the service worker that precaches the app shell so the app can
    // load while offline. Firestore's own persistence only helps after the app
    // has loaded, so without this a refresh offline fails.
    VitePWA({
      // "prompt" + no reload callback: a new version waits until all tabs are
      // closed, so a deploy never reloads a researcher mid-form.
      registerType: "prompt",
      // Keep using the hand-written public/manifest.json.
      manifest: false,
      includeAssets: [
        "manifest.json",
        "favicon.png",
        "logo192.png",
        "logo512.png",
      ],
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,json,woff2}"],
        navigateFallback: "/index.html",
      },
    }),
  ],
  envPrefix: "REACT_APP_",
  build: {
    outDir: "build",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    testTimeout: 60000,
    deps: {
      inline: ["date-fns"],
    },
  },
  server: { port: 3000 },
});
