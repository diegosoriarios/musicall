import { Router } from 'express'
import authRoutes from './modules/auth/auth.routes.js'
import postsRoutes from './modules/posts/posts.routes.js'
import usersRoutes from './modules/users/users.routes.js'
import { requireAuth } from './middleware/auth.js'

const apiRoutes = Router()

apiRoutes.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

apiRoutes.use('/auth', authRoutes)
apiRoutes.use('/users', usersRoutes)
apiRoutes.use('/posts', postsRoutes)

// Reserved for future modules; ensures a valid session for anything else under /api
apiRoutes.use(requireAuth)

export default apiRoutes
