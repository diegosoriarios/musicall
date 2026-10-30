import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Chat from './index'
import { renderWithTheme } from '../../test/render'

function ChatDestination() {
  return <p>Chat destination</p>
}

describe('Chat lobby', () => {
  it('joins a named room', async () => {
    const user = userEvent.setup()
    renderWithTheme(
      <MemoryRouter initialEntries={['/chats']}>
        <Routes>
          <Route path="/chats" element={<Chat />} />
          <Route path="/chat" element={<ChatDestination />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('Room name'), 'jazz')
    await user.click(screen.getByRole('button', { name: 'Join room' }))

    expect(screen.getByText('Chat destination')).toBeInTheDocument()
  })
})
