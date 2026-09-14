import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // listen on all interfaces (LAN + localhost)
    port: 5173,        // default dev port
    proxy: {
      // forward API calls to backend
      '/files': 'http://localhost:8080',
      '/public/api/v1': 'http://localhost:8080',
      '/swagger-ui': 'http://localhost:8080',
      '/v3/api-docs': 'http://localhost:8080'
    }
  }
});
