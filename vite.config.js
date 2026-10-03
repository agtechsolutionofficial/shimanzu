import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import apiApp from './server/index.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-server-middleware',
      configureServer(server) {
        server.middlewares.use(apiApp);
      }
    }
  ],
  server: {
    port: 5173
  }
})
