import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  envPrefix: "REACT_APP_",
  build: {
    outDir: "build",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    testTimeout: 60000,
    hookTimeout: 60000,
    deps: {
      inline: ["date-fns"],
    },
  },
  server: { port: 3000 },
});
