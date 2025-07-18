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
    proxy: {
      // Proxy requests from /api/dss to the DSS server
      "/token": {
        target: "http://api.dev.br-utm.org", // The actual DSS API URL
        changeOrigin: true, // Needed for virtual hosted sites
      },
      "/dss/.*": {
        target: "http://api.dev.br-utm.org", // The actual DSS API URL
        changeOrigin: true, // Needed for virtual hosted sites
      },
    },
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
      VITE_OBSERVER_API: process.env.VITE_OBSERVER_API || "http://localhost:8000",
    },
  },
});
