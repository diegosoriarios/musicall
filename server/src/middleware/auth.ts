import type { NextFunction, Request, Response } from 'express'
import { getSessionFromRequest } from '../modules/auth/session.js'

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const session = getSessionFromRequest(req)
  if (!session) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }
  req.userId = session.sub
  next()
}
