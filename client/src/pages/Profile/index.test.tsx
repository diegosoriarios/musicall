import { MemoryRouter } from 'react-router-dom'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Profile from './index'
import { renderWithTheme } from '../../test/render'

const authMocks = vi.hoisted(() => ({
  logout: vi.fn(async () => undefined),
}))

vi.mock('../../auth/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'user-1',
      username: 'Diego',
      email: 'diego@example.com',
      avatar: 'https://example.com/avatar.png',
    },
    logout: authMocks.logout,
  }),
}))

describe('Profile', () => {
  it('shows account details and logs out', async () => {
    const user = userEvent.setup()
    renderWithTheme(
      <MemoryRouter initialEntries={['/profile']}>
        <Profile />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument()
    expect(screen.getAllByText('diego@example.com')).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: /log out/i }))
    await waitFor(() => {
      expect(authMocks.logout).toHaveBeenCalledTimes(1)
    })
  })
})
