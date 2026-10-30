import type { Request, Response } from 'express'
import { env } from '../../config/env.js'
import { AppError } from '../../utils/AppError.js'
import {
  buildAuthorizeUrl,
  exchangeCodeForTokens,
  fetchSpotifyProfile,
  generateState,
} from './spotify.client.js'
import {
  clearSessionCookie,
  getSessionFromRequest,
  setAuthStateCookie,
  setSessionCookie,
  signSessionToken,
} from './session.js'
import { findUserById, getFreshSpotifyAccessToken, upsertUser } from './user.service.js'

export async function login(req: Request, res: Response): Promise<void> {
  const state = generateState()
  setAuthStateCookie(res, state)
  res.redirect(buildAuthorizeUrl(state))
}

export async function callback(req: Request, res: Response): Promise<void> {
  const { code, state, error } = req.query
  const storedState = req.cookies?.['musicall_auth_state']

  const redirectWithError = (reason: string) => {
    res.redirect(`${env.CLIENT_URL}/#error=${encodeURIComponent(reason)}`)
  }

  if (error) return void redirectWithError(String(error))

  if (
    typeof code !== 'string' ||
    typeof state !== 'string' ||
    !storedState ||
    state !== storedState
  ) {
    return void redirectWithError('state_mismatch')
  }

  res.clearCookie('musicall_auth_state')

  try {
    const tokens = await exchangeCodeForTokens(code)
    const profile = await fetchSpotifyProfile(tokens.access_token)

    const user = await upsertUser({
      id: profile.id,
      username: profile.display_name ?? profile.id,
      email: profile.email ?? '',
      avatar: profile.images?.[0]?.url ?? '',
      spotifyRefreshToken: tokens.refresh_token ?? null,
    })

    const sessionToken = signSessionToken({ sub: user.id, username: user.username })
    setSessionCookie(res, sessionToken)

    // Spotify access token is passed via hash fragment so the client can call
    // the Spotify Web API directly. It never touches localStorage; the app's own
    // session lives in an httpOnly cookie.
    res.redirect(
      `${env.CLIENT_URL}/#` +
        new URLSearchParams({
          spotify_access_token: tokens.access_token,
          spotify_expires_in: String(tokens.expires_in),
        }).toString(),
    )
  } catch (err) {
    console.error('Spotify auth callback failed:', err)
    redirectWithError('invalid_token')
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  clearSessionCookie(res)
  res.status(204).send()
}

export async function me(req: Request, res: Response): Promise<void> {
  const session = getSessionFromRequest(req)
  if (!session) throw new AppError('Not authenticated', 401)

  const user = await findUserById(session.sub)
  if (!user) throw new AppError('User not found', 404)

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
  })
}

export async function spotifyToken(req: Request, res: Response): Promise<void> {
  const session = getSessionFromRequest(req)
  if (!session) throw new AppError('Not authenticated', 401)

  const user = await findUserById(session.sub)
  if (!user) throw new AppError('User not found', 404)

  const { accessToken, expiresIn } = await getFreshSpotifyAccessToken(user)
  res.json({ accessToken, expiresIn })
}
