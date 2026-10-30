import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.js'
import { listUsers } from './users.controller.js'

const usersRoutes = Router()

usersRoutes.get('/', requireAuth, listUsers)

export default usersRoutes
