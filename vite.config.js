import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],

    server: {
      host: true,
      port: 5173,
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
  };

  if (command === "serve") {
    const keyPath = "./192.168.100.85+3-key.pem";
    const certPath = "./192.168.100.85+3.pem";

    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      config.server.https = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      };
    }
  }

  return config;
});
