import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { User } from '../types'
import { AuthProvider, useAuth } from './AuthContext'

const authMocks = vi.hoisted(() => ({
  consumeHashParams: vi.fn(),
  fetchCurrentUser: vi.fn(),
  fetchSpotifyToken: vi.fn(),
  logoutRequest: vi.fn(),
  setSpotifyAccessToken: vi.fn(),
  clearSpotifyAccessToken: vi.fn(),
}))

vi.mock('../api/auth', () => ({
  consumeHashParams: authMocks.consumeHashParams,
  fetchCurrentUser: authMocks.fetchCurrentUser,
  fetchSpotifyToken: authMocks.fetchSpotifyToken,
  logoutRequest: authMocks.logoutRequest,
}))

vi.mock('../lib/spotify', () => ({
  setSpotifyAccessToken: authMocks.setSpotifyAccessToken,
  clearSpotifyAccessToken: authMocks.clearSpotifyAccessToken,
}))

const user: User = {
  id: 'spotify-user',
  username: 'Diego',
  email: 'diego@example.com',
  avatar: 'https://example.com/avatar.png',
}

function AuthProbe() {
  const { status, user: currentUser, logout, refreshSpotifyToken } = useAuth()

  return (
    <div>
      <p data-testid="status">{status}</p>
      <p data-testid="username">{currentUser?.username ?? ''}</p>
      <button onClick={() => void logout()}>Log out</button>
      <button onClick={() => void refreshSpotifyToken()}>Refresh</button>
    </div>
  )
}

function renderProvider() {
  return render(
    <AuthProvider>
      <AuthProbe />
    </AuthProvider>,
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    authMocks.consumeHashParams.mockReturnValue({})
    authMocks.fetchCurrentUser.mockResolvedValue(user)
    authMocks.fetchSpotifyToken.mockResolvedValue({
      accessToken: 'server-token',
      expiresIn: 3600,
    })
    authMocks.logoutRequest.mockResolvedValue(undefined)
  })

  it('restores an authenticated session', async () => {
    renderProvider()

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('authenticated')
    })

    expect(screen.getByTestId('username')).toHaveTextContent('Diego')
    expect(authMocks.fetchSpotifyToken).toHaveBeenCalledTimes(1)
    expect(authMocks.setSpotifyAccessToken).toHaveBeenCalledWith('server-token')
  })

  it('uses a Spotify token from the URL hash before restoring the session', async () => {
    authMocks.consumeHashParams.mockReturnValue({
      spotify_access_token: 'hash-token',
    })

    renderProvider()

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('authenticated')
    })

    expect(authMocks.setSpotifyAccessToken).toHaveBeenCalledWith('hash-token')
    expect(authMocks.setSpotifyAccessToken).toHaveBeenCalledWith('server-token')
  })

  it('falls back to anonymous when the session is invalid', async () => {
    authMocks.fetchCurrentUser.mockRejectedValue(new Error('unauthorized'))

    renderProvider()

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('anonymous')
    })

    expect(screen.getByTestId('username')).toHaveTextContent('')
    expect(authMocks.fetchSpotifyToken).not.toHaveBeenCalled()
    expect(authMocks.clearSpotifyAccessToken).toHaveBeenCalled()
  })

  it('keeps the session when the Spotify token cannot be restored', async () => {
    authMocks.fetchSpotifyToken.mockRejectedValue(new Error('no spotify session'))
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    renderProvider()

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('authenticated')
    })

    expect(screen.getByTestId('username')).toHaveTextContent('Diego')
  })

  it('logs out and clears local auth state', async () => {
    const interaction = userEvent.setup()
    renderProvider()

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('authenticated')
    })

    await interaction.click(screen.getByRole('button', { name: 'Log out' }))

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('anonymous')
    })

    expect(authMocks.logoutRequest).toHaveBeenCalledTimes(1)
    expect(authMocks.clearSpotifyAccessToken).toHaveBeenCalled()
    expect(screen.getByTestId('username')).toHaveTextContent('')
  })

  it('refreshes the Spotify access token on demand', async () => {
    const interaction = userEvent.setup()
    authMocks.fetchSpotifyToken
      .mockResolvedValueOnce({ accessToken: 'initial-token', expiresIn: 3600 })
      .mockResolvedValueOnce({ accessToken: 'refreshed-token', expiresIn: 1800 })

    renderProvider()

    await waitFor(() => {
      expect(authMocks.setSpotifyAccessToken).toHaveBeenCalledWith('initial-token')
    })

    await interaction.click(screen.getByRole('button', { name: 'Refresh' }))

    await waitFor(() => {
      expect(authMocks.setSpotifyAccessToken).toHaveBeenCalledWith('refreshed-token')
    })
  })
})
