import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import app from '../src/app.js'
import { db } from '../src/database/connection.js'
import { decryptToken } from '../src/modules/auth/tokenCrypto.js'
import { createUser, readCookie, sessionCookieFor } from './helpers.js'

const spotify = vi.hoisted(() => ({
  exchangeCodeForTokens: vi.fn(async () => ({
    access_token: 'spotify-access-token',
    refresh_token: 'spotify-refresh-token',
    expires_in: 3600,
  })),
  fetchSpotifyProfile: vi.fn(async () => ({
    id: 'spotify-user',
    display_name: 'Spotify User',
    email: 'spotify@example.com',
    images: [{ url: 'https://example.com/spotify.png' }],
  })),
  refreshAccessToken: vi.fn(async () => ({
    access_token: 'refreshed-access-token',
    refresh_token: 'rotated-refresh-token',
    expires_in: 1800,
  })),
}))

vi.mock('../src/modules/auth/spotify.client.js', () => ({
  generateState: () => 'test-state',
  buildAuthorizeUrl: (state: string) => `https://accounts.spotify.com/authorize?state=${state}`,
  ...spotify,
}))

describe('auth routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to Spotify with a state cookie', async () => {
    const response = await request(app).get('/api/auth/login').expect(302)

    expect(response.headers.location).toContain('state=test-state')
    expect(readCookie(response, 'musicall_auth_state')).toBe('test-state')
  })

  it('rejects a callback with a mismatched state', async () => {
    const response = await request(app)
      .get('/api/auth/callback?code=abc&state=wrong')
      .set('Cookie', 'musicall_auth_state=test-state')
      .expect(302)

    expect(response.headers.location).toBe('http://localhost:5173/#error=state_mismatch')
  })

  it('rejects a callback without a state cookie', async () => {
    const response = await request(app)
      .get('/api/auth/callback?code=abc&state=test-state')
      .expect(302)

    expect(response.headers.location).toBe('http://localhost:5173/#error=state_mismatch')
  })

  it('creates a session and a user after a valid callback', async () => {
    const response = await request(app)
      .get('/api/auth/callback?code=abc&state=test-state')
      .set('Cookie', 'musicall_auth_state=test-state')
      .expect(302)

    expect(response.headers.location).toContain('#spotify_access_token=spotify-access-token')

    const sessionToken = readCookie(response, 'musicall_session')
    expect(sessionToken).toBeTruthy()

    const me = await request(app)
      .get('/api/auth/me')
      .set('Cookie', `musicall_session=${sessionToken}`)
      .expect(200)

    expect(me.body).toEqual({
      id: 'spotify-user',
      username: 'Spotify User',
      email: 'spotify@example.com',
      avatar: 'https://example.com/spotify.png',
    })

    const users = await db('users')
    expect(users).toHaveLength(1)
    expect(users[0]).toMatchObject({ id: 'spotify-user' })
    expect(users[0].spotify_refresh_token).not.toBe('spotify-refresh-token')
    expect(decryptToken(users[0].spotify_refresh_token)).toBe('spotify-refresh-token')
  })

  it('returns 401 from /me when anonymous', async () => {
    await request(app).get('/api/auth/me').expect(401)
  })

  it('returns a refreshed Spotify access token for the session user', async () => {
    const user = await createUser({
      id: 'token-user',
      username: 'token-user',
      spotify_refresh_token: 'stored-refresh-token',
    })

    const response = await request(app)
      .post('/api/auth/spotify-token')
      .set('Cookie', sessionCookieFor(user))
      .expect(200)

    expect(response.body).toEqual({ accessToken: 'refreshed-access-token', expiresIn: 1800 })
    expect(spotify.refreshAccessToken).toHaveBeenCalledWith('stored-refresh-token')

    const stored = await db('users').where('id', user.id).first()
    expect(stored?.spotify_refresh_token).not.toBe('rotated-refresh-token')
    expect(decryptToken(stored?.spotify_refresh_token ?? '')).toBe('rotated-refresh-token')
  })

  it('rejects Spotify token requests for users without a refresh token', async () => {
    const user = await createUser({ id: 'no-token-user' })

    const response = await request(app)
      .post('/api/auth/spotify-token')
      .set('Cookie', sessionCookieFor(user))
      .expect(401)

    expect(response.body).toEqual({
      error: 'No Spotify refresh token available. Please log in again.',
    })
  })

  it('clears the session cookie and revokes existing sessions on logout', async () => {
    const user = await createUser()
    const cookie = sessionCookieFor(user)

    const response = await request(app).post('/api/auth/logout').set('Cookie', cookie).expect(204)

    expect(response.headers['set-cookie']?.[0]).toContain('musicall_session=;')

    await request(app).get('/api/auth/me').set('Cookie', cookie).expect(401)

    const stored = await db('users').where('id', user.id).first()
    expect(stored?.session_version).toBe(1)
  })
})
