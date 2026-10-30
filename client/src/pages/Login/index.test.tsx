import { MemoryRouter } from 'react-router-dom'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import LoginPage from './index'
import { renderWithTheme } from '../../test/render'

const authMocks = vi.hoisted(() => ({
  login: vi.fn(),
}))

vi.mock('../../auth/AuthContext', () => ({
  useAuth: () => ({
    status: 'anonymous',
    login: authMocks.login,
  }),
}))

describe('LoginPage', () => {
  it('starts the Spotify login flow', async () => {
    const user = userEvent.setup()
    renderWithTheme(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /continue with spotify/i }))
    expect(authMocks.login).toHaveBeenCalledTimes(1)
  })
})
