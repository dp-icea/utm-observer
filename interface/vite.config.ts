import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cesium from "vite-plugin-cesium";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    open: true,
  },
  plugins: [react(), cesium()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env": {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      VITE_ION_ACCESS_TOKEN: process.env.VITE_ION_ACCESS_TOKEN,
      VITE_OBSERVER_API_URL: process.env.VITE_OBSERVER_API_URL,
      VITE_DSS_API_URL: process.env.VITE_DSS_API_URL,
      VITE_GEOAWARENESS_API_URL: process.env.VITE_GEOAWARENESS_API_URL,
    },
  },
});
