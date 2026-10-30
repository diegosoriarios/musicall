import type { UserRow } from '../modules/auth/user.service.js'

declare global {
  namespace Express {
    interface Request {
      userId?: string
      user?: UserRow
    }
  }
}

export {}
