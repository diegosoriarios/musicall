import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The dev proxy makes the client same-origin with the API, so the
// httpOnly session cookie "just works" without CORS in development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
      },
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true,
      },
    },
  },
})
