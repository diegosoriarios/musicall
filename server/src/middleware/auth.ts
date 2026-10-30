import type { NextFunction, Request, Response } from 'express'
import { getSessionFromRequest } from '../modules/auth/session.js'
import { findUserById } from '../modules/auth/user.service.js'

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const session = getSessionFromRequest(req)
  if (!session) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }

  try {
    const user = await findUserById(session.sub)
    if (!user || user.session_version !== session.sv) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    req.userId = user.id
    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}
