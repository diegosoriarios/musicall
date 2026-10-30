import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ChatPage from './ChatPage'
import { renderWithTheme } from '../test/render'

type MessageHandler = (payload: unknown) => void

const socketMocks = vi.hoisted(() => {
  const handlers = new Map<string, Set<MessageHandler>>()

  const emit = vi.fn((event: string, payload: unknown, callback?: (response: unknown) => void) => {
    if (event === 'chat:join') {
      callback?.({ room: (payload as { room: string }).room })
    }
    if (event === 'chat:message') {
      callback?.({ ok: true })
    }
  })

  const on = vi.fn((event: string, handler: MessageHandler) => {
    const eventHandlers = handlers.get(event) ?? new Set<MessageHandler>()
    eventHandlers.add(handler)
    handlers.set(event, eventHandlers)
  })

  const off = vi.fn((event: string, handler: MessageHandler) => {
    handlers.get(event)?.delete(handler)
  })

  return {
    emit,
    on,
    off,
    trigger(event: string, payload: unknown) {
      handlers.get(event)?.forEach((handler) => handler(payload))
    },
    reset() {
      handlers.clear()
      emit.mockClear()
      on.mockClear()
      off.mockClear()
    },
  }
})

const authMocks = vi.hoisted(() => ({
  user: {
    id: 'user-1',
    username: 'Diego',
    email: 'diego@example.com',
    avatar: 'https://example.com/avatar.png',
  },
}))

vi.mock('../sockets/socket', () => ({ socket: socketMocks }))
vi.mock('../auth/AuthContext', () => ({
  useAuth: () => ({ user: authMocks.user }),
}))

function renderChat(entry: string) {
  return renderWithTheme(
    <MemoryRouter initialEntries={[entry]}>
      <ChatPage />
    </MemoryRouter>,
  )
}

describe('ChatPage', () => {
  beforeEach(() => {
    socketMocks.reset()
  })

  it('joins the room and displays incoming messages', () => {
    renderChat('/chat?room=jazz')

    expect(screen.getByText('jazz')).toBeInTheDocument()
    expect(socketMocks.emit).toHaveBeenCalledWith(
      'chat:join',
      { room: 'jazz' },
      expect.any(Function),
    )

    act(() => {
      socketMocks.trigger('chat:message', { user: 'bob', text: 'Hello there', at: 1 })
    })

    expect(screen.getByText('Hello there')).toBeInTheDocument()
  })

  it('sends a message and clears the input', async () => {
    const user = userEvent.setup()
    renderChat('/chat?room=jazz')

    const input = screen.getByPlaceholderText('Type a message...')
    await user.type(input, 'Hi{Enter}')

    await waitFor(() => {
      expect(socketMocks.emit).toHaveBeenCalledWith(
        'chat:message',
        { text: 'Hi' },
        expect.any(Function),
      )
    })
    expect(input).toHaveValue('')
  })

  it('shows an empty state when no room is specified', () => {
    renderChat('/chat')
    expect(screen.getByText('No room specified.')).toBeInTheDocument()
    expect(socketMocks.emit).not.toHaveBeenCalled()
  })
})
