import { db } from '../../database/connection.js'
import { AppError } from '../../utils/AppError.js'
import { refreshAccessToken } from './spotify.client.js'
import { decryptToken, encryptToken, isEncryptedToken } from './tokenCrypto.js'

interface SpotifyTokenCacheEntry {
  accessToken: string
  expiresAt: number
}

const tokenCache = new Map<string, SpotifyTokenCacheEntry>()

const EXPIRY_LEEWAY_MS = 60_000

export interface UserRow {
  id: string
  username: string
  email: string
  avatar: string
  spotify_refresh_token: string | null
  session_version: number
}

export async function upsertUser(input: {
  id: string
  username: string
  email: string
  avatar: string
  spotifyRefreshToken?: string | null
}): Promise<UserRow> {
  const existing = await db<UserRow>('users').where('id', input.id).first()

  if (existing) {
    await db('users')
      .where('id', input.id)
      .update({
        username: input.username,
        email: input.email,
        avatar: input.avatar,
        ...(input.spotifyRefreshToken
          ? { spotify_refresh_token: encryptToken(input.spotifyRefreshToken) }
          : {}),
      })
  } else {
    await db('users').insert({
      id: input.id,
      username: input.username,
      email: input.email,
      avatar: input.avatar,
      spotify_refresh_token: input.spotifyRefreshToken
        ? encryptToken(input.spotifyRefreshToken)
        : null,
    })
  }

  const user = await db<UserRow>('users').where('id', input.id).first()
  if (!user) throw new AppError('Failed to persist user', 500)
  return user
}

export async function findUserById(id: string): Promise<UserRow | undefined> {
  return db<UserRow>('users').where('id', id).first()
}

export async function revokeUserSessions(id: string): Promise<void> {
  await db('users').where('id', id).increment('session_version', 1)
}

export async function encryptLegacyRefreshTokens(): Promise<void> {
  const users = await db<UserRow>('users')
    .whereNotNull('spotify_refresh_token')
    .select('id', 'spotify_refresh_token')

  for (const user of users) {
    const stored = user.spotify_refresh_token
    if (!stored || isEncryptedToken(stored)) continue

    await db('users')
      .where('id', user.id)
      .update({ spotify_refresh_token: encryptToken(stored) })
  }
}

export async function getFreshSpotifyAccessToken(user: UserRow): Promise<{
  accessToken: string
  expiresIn: number
}> {
  const cached = tokenCache.get(user.id)
  if (cached && cached.expiresAt > Date.now() + EXPIRY_LEEWAY_MS) {
    return {
      accessToken: cached.accessToken,
      expiresIn: Math.floor((cached.expiresAt - Date.now()) / 1000),
    }
  }

  if (!user.spotify_refresh_token) {
    throw new AppError('No Spotify refresh token available. Please log in again.', 401)
  }

  const refreshToken = decryptToken(user.spotify_refresh_token)
  if (!refreshToken) {
    throw new AppError('Stored Spotify token is invalid. Please log in again.', 401)
  }

  const tokens = await refreshAccessToken(refreshToken)

  if (tokens.refresh_token) {
    await db('users')
      .where('id', user.id)
      .update({ spotify_refresh_token: encryptToken(tokens.refresh_token) })
  }

  const entry: SpotifyTokenCacheEntry = {
    accessToken: tokens.access_token,
    expiresAt: Date.now() + tokens.expires_in * 1000,
  }
  tokenCache.set(user.id, entry)

  return { accessToken: entry.accessToken, expiresIn: tokens.expires_in }
}
