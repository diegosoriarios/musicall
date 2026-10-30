import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.js'
import { callback, login, logout, me, spotifyToken } from './auth.controller.js'

const authRoutes = Router()

authRoutes.get('/login', login)
authRoutes.get('/callback', callback)
authRoutes.post('/logout', logout)
authRoutes.get('/me', requireAuth, me)
authRoutes.post('/spotify-token', requireAuth, spotifyToken)

export default authRoutes
