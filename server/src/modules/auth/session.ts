import jwt from 'jsonwebtoken'
import { env, isProduction } from '../../config/env.js'
import type { Request, Response } from 'express'

export const SESSION_COOKIE = 'musicall_session'
export const STATE_COOKIE = 'musicall_auth_state'

const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60

export interface SessionPayload {
  sub: string
  username: string
  sv: number
}

export function signSessionToken(payload: SessionPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: SESSION_MAX_AGE_SECONDS,
  })
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)
    if (
      typeof decoded === 'string' ||
      typeof decoded.sub !== 'string' ||
      typeof decoded.sv !== 'number'
    ) {
      return null
    }
    return {
      sub: decoded.sub,
      username: typeof decoded.username === 'string' ? decoded.username : '',
      sv: decoded.sv,
    }
  } catch {
    return null
  }
}

export function setSessionCookie(res: Response, token: string): void {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_SECONDS * 1000,
    path: '/',
  })
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE, { path: '/' })
}

export function setAuthStateCookie(res: Response, state: string): void {
  res.cookie(STATE_COOKIE, state, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000,
    path: '/',
  })
}

export function getSessionFromRequest(req: Request): SessionPayload | null {
  const token = req.cookies?.[SESSION_COOKIE]
  if (!token || typeof token !== 'string') return null
  return verifySessionToken(token)
}
