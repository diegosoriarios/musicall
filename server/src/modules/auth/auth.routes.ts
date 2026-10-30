import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.js'
import { authLimiter, spotifyTokenLimiter } from '../../middleware/rateLimit.js'
import { callback, login, logout, me, spotifyToken } from './auth.controller.js'

const authRoutes = Router()

authRoutes.get('/login', authLimiter, login)
authRoutes.get('/callback', authLimiter, callback)
authRoutes.post('/logout', logout)
authRoutes.get('/me', requireAuth, me)
authRoutes.post('/spotify-token', requireAuth, spotifyTokenLimiter, spotifyToken)

export default authRoutes
