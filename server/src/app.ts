import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { apiLimiter } from './middleware/rateLimit.js'
import apiRoutes from './routes.js'

const app = express()

app.set('trust proxy', 1)

app.use(helmet())
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(express.json({ limit: '100kb' }))

app.use('/api', apiLimiter, apiRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
