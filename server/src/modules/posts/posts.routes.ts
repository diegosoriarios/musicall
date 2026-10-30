import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.js'
import { create, destroy, index } from './posts.controller.js'

const postsRoutes = Router()

postsRoutes.get('/', requireAuth, index)
postsRoutes.post('/', requireAuth, create)
postsRoutes.delete('/:id', requireAuth, destroy)

export default postsRoutes
