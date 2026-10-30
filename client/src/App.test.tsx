import { render, screen, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { server } from './test/server'

vi.mock('./sockets/socket', () => ({
  socket: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    connected: false,
  },
}))

const user = {
  id: 'user-1',
  username: 'Diego',
  email: 'diego@example.com',
  avatar: 'https://example.com/avatar.png',
}

describe('App routes', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('redirects anonymous visitors away from protected routes', async () => {
    window.history.pushState({}, '', '/feed')
    server.use(
      http.get('*/api/auth/me', () =>
        HttpResponse.json({ error: 'Not authenticated' }, { status: 401 }),
      ),
    )

    render(<App />)

    expect(await screen.findByText('Continue with Spotify')).toBeInTheDocument()
  })

  it('renders protected content for an authenticated session', async () => {
    window.history.pushState({}, '', '/feed')
    server.use(
      http.get('*/api/auth/me', () => HttpResponse.json(user)),
      http.post('*/api/auth/spotify-token', () =>
        HttpResponse.json({ accessToken: 'spotify-token', expiresIn: 3600 }),
      ),
      http.get('*/api/posts', () => HttpResponse.json([], { headers: { 'X-Total-Count': '0' } })),
    )

    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Feed' })).toBeInTheDocument()
    })

    expect(screen.queryByText('Continue with Spotify')).not.toBeInTheDocument()
  })
})
