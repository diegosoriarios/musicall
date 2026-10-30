import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    env: {
      NODE_ENV: 'test',
      CLIENT_URL: 'http://localhost:5173',
      SERVER_URL: 'http://localhost:3001',
      SPOTIFY_CLIENT_ID: 'test-client-id',
      SPOTIFY_CLIENT_SECRET: 'test-client-secret',
      JWT_SECRET: 'test-jwt-secret-at-least-16-chars',
      DB_FILENAME: ':memory:',
    },
  },
})
