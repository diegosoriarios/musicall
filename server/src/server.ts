import { createServer } from 'node:http'
import app from './app.js'
import { env, isProduction } from './config/env.js'
import { runMigrations } from './database/connection.js'
import { registerSockets } from './sockets/index.js'

async function main(): Promise<void> {
  await runMigrations()
  console.log('Database migrations are up to date')

  const httpServer = createServer(app)
  registerSockets(httpServer)

  httpServer.listen(env.PORT, () => {
    console.log(`Musicall server listening on http://localhost:${env.PORT} (${env.NODE_ENV})`)
    console.log(`Allowed client origin: ${env.CLIENT_URL}`)
    if (isProduction) console.log('Running in production mode')
  })
}

main().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
