import { afterEach, describe, expect, it, vi } from 'vitest'
import { env } from '../src/config/env.js'
import { db } from '../src/database/connection.js'
import { decryptToken, encryptToken } from '../src/modules/auth/tokenCrypto.js'
import { SpotifyApiError } from '../src/modules/auth/spotify.client.js'
import { encryptLegacyRefreshTokens } from '../src/modules/auth/user.service.js'
import { logError, redact } from '../src/utils/safeLog.js'
import { createUser } from './helpers.js'

describe('token encryption', () => {
  it('encrypts and decrypts refresh tokens', () => {
    const encrypted = encryptToken('refresh-token-value')

    expect(encrypted).not.toBe('refresh-token-value')
    expect(encrypted.startsWith('v1.')).toBe(true)
    expect(decryptToken(encrypted)).toBe('refresh-token-value')
  })

  it('keeps legacy plaintext readable and rejects tampered ciphertext', () => {
    expect(decryptToken('legacy-plaintext')).toBe('legacy-plaintext')
    expect(decryptToken('v1.invalid.invalid.invalid')).toBeNull()
  })

  it('encrypts legacy refresh tokens stored in the database', async () => {
    const user = await createUser({
      id: 'legacy-token-user',
      spotify_refresh_token: 'legacy-refresh-token',
    })

    await encryptLegacyRefreshTokens()

    const stored = await db('users').where('id', user.id).first()
    expect(stored?.spotify_refresh_token).not.toBe('legacy-refresh-token')
    expect(decryptToken(stored?.spotify_refresh_token ?? '')).toBe('legacy-refresh-token')
  })
})

describe('safe logging', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('redacts secrets, auth headers and emails', () => {
    const raw = [
      env.SPOTIFY_CLIENT_SECRET,
      env.JWT_SECRET,
      'Authorization: Bearer secret-token',
      'Authorization: Basic c2VjcmV0OnZhbHVl',
      'user@example.com',
    ].join(' ')

    const safe = redact(raw)

    expect(safe).not.toContain(env.SPOTIFY_CLIENT_SECRET)
    expect(safe).not.toContain(env.JWT_SECRET)
    expect(safe).not.toContain('secret-token')
    expect(safe).not.toContain('user@example.com')
  })

  it('does not print raw error details', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const error = new Error(`request failed with ${env.SPOTIFY_CLIENT_SECRET}`)

    logError('test failure', error)

    const logged = JSON.stringify(spy.mock.calls)
    expect(logged).not.toContain(env.SPOTIFY_CLIENT_SECRET)
    expect(logged).toContain('[REDACTED]')
  })

  it('logs Spotify API diagnostics without leaking credentials', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const error = new SpotifyApiError('Spotify profile request failed', {
      method: 'GET',
      endpoint: 'https://api.spotify.com/v1/me',
      status: 403,
      statusText: 'Forbidden',
      requestId: 'spotify-request-123',
      responseBody: {
        error: {
          status: 403,
          message: 'User not registered in the Developer Dashboard',
          diagnosticEmail: 'user@example.com',
        },
        access_token: 'secret-access-token',
      },
    })

    logError('Spotify auth callback failed', error)

    const logged = JSON.stringify(spy.mock.calls)
    expect(logged).toContain('SpotifyApiError')
    expect(logged).toContain('https://api.spotify.com/v1/me')
    expect(logged).toContain('403')
    expect(logged).toContain('spotify-request-123')
    expect(logged).toContain('User not registered in the Developer Dashboard')
    expect(logged).not.toContain('user@example.com')
    expect(logged).not.toContain('secret-access-token')
    expect(logged).toContain('[REDACTED_EMAIL]')
  })
})
