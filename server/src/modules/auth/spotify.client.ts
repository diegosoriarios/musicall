import { randomBytes } from 'node:crypto'
import axios from 'axios'
import { env } from '../../config/env.js'

const SPOTIFY_ACCOUNTS_URL = 'https://accounts.spotify.com'
const SPOTIFY_API_URL = 'https://api.spotify.com/v1'

export const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
  'user-read-currently-playing',
].join(' ')

export const REDIRECT_URI = `${env.SERVER_URL}/api/auth/callback`

export interface SpotifyTokens {
  access_token: string
  refresh_token?: string
  expires_in: number
}

export interface SpotifyProfile {
  id: string
  display_name: string | null
  email: string | null
  images: { url: string }[] | null
}

export interface SpotifyApiErrorDetails {
  method?: string
  endpoint?: string
  status?: number
  statusText?: string
  requestId?: string
  retryAfter?: string
  responseBody?: unknown
}

export class SpotifyApiError extends Error {
  readonly details: SpotifyApiErrorDetails

  constructor(message: string, details: SpotifyApiErrorDetails) {
    super(message)
    this.name = 'SpotifyApiError'
    this.details = details
  }
}

export function generateState(): string {
  return randomBytes(16).toString('hex')
}

export function buildAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: env.SPOTIFY_CLIENT_ID,
    scope: SPOTIFY_SCOPES,
    redirect_uri: REDIRECT_URI,
    state,
  })
  return `${SPOTIFY_ACCOUNTS_URL}/authorize?${params.toString()}`
}

function basicAuthHeader(): string {
  const credentials = Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString(
    'base64',
  )
  return `Basic ${credentials}`
}

function responseHeaderValue(headers: unknown, name: string): string | undefined {
  if (!(headers instanceof Object)) return undefined
  const value = (headers as Record<string, unknown>)[name.toLowerCase()]
  if (typeof value === 'string') return value
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    return value.join(', ')
  }
  return undefined
}

function toSpotifyApiError(operation: string, error: unknown): unknown {
  if (!axios.isAxiosError(error)) return error

  const response = error.response
  return new SpotifyApiError(`${operation} failed`, {
    method: error.config?.method?.toUpperCase(),
    endpoint: error.config?.url,
    status: response?.status,
    statusText: response?.statusText,
    requestId: responseHeaderValue(response?.headers, 'spotify-request-id'),
    retryAfter: responseHeaderValue(response?.headers, 'retry-after'),
    responseBody: response?.data,
  })
}

export async function exchangeCodeForTokens(code: string): Promise<SpotifyTokens> {
  try {
    const response = await axios.post<SpotifyTokens>(
      `${SPOTIFY_ACCOUNTS_URL}/api/token`,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          Authorization: basicAuthHeader(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
    return response.data
  } catch (error) {
    throw toSpotifyApiError('Spotify token exchange', error)
  }
}

export async function fetchSpotifyProfile(accessToken: string): Promise<SpotifyProfile> {
  try {
    const response = await axios.get<SpotifyProfile>(`${SPOTIFY_API_URL}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return response.data
  } catch (error) {
    throw toSpotifyApiError('Spotify profile request', error)
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<SpotifyTokens> {
  try {
    const response = await axios.post<SpotifyTokens>(
      `${SPOTIFY_ACCOUNTS_URL}/api/token`,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      {
        headers: {
          Authorization: basicAuthHeader(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
    return response.data
  } catch (error) {
    throw toSpotifyApiError('Spotify token refresh', error)
  }
}
