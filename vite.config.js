import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    https: {
      key: fs.readFileSync("./192.168.100.85+3-key.pem"),
      cert: fs.readFileSync("./192.168.100.85+3.pem"),
    },
    proxy: {
      "/files": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/public/api/v1": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/swagger-ui": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/v3/api-docs": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});