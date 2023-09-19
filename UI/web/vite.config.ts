import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  server: {
    port: 4000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
      },
    },
  },
});
