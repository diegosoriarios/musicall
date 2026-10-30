import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../auth/AuthContext'
import { socket } from '../sockets/socket'
import type { ChatMessage } from '../types'
import { Button } from './ui/Button'
import { ErrorBanner } from './ui/ErrorBanner'
import { EmptyState } from './ui/EmptyState'
import InfoBar from './InfoBar'
import Input from './Input'
import Messages from './Messages'
import { ArrowLeftIcon, ChatIcon } from './icons'

const Shell = styled.div`
  display: flex;
  height: 100dvh;
  justify-content: center;
  padding: ${({ theme }) => theme.space.lg}px;
  background: ${({ theme }) => theme.colors.bg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0;
  }
`

const Panel = styled.section`
  display: flex;
  width: min(980px, 100%);
  height: 100%;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.floating};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    border: 0;
    border-radius: 0;
  }
`

const ErrorWrap = styled.div`
  padding: ${({ theme }) => theme.space.md}px;
`

const EmptyPanel = styled(Panel)`
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space.lg}px;
  text-align: center;
`

const EmptyActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.sm}px;
  justify-content: center;
`

export default function ChatPage() {
  const [searchParams] = useSearchParams()
  const room = searchParams.get('room') ?? ''
  const { user } = useAuth()
  const navigate = useNavigate()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [message, setMessage] = useState('')
  const [joinError, setJoinError] = useState('')
  const messagesRef = useRef<ChatMessage[]>([])

  useEffect(() => {
    if (!room) return

    setMessages([])
    messagesRef.current = []
    setJoinError('')

    socket.emit('chat:join', { room }, (response: { error?: string } | undefined) => {
      if (response?.error) {
        setJoinError(response.error)
      }
    })

    function onMessage(newMessage: ChatMessage) {
      messagesRef.current = [...messagesRef.current, newMessage]
      setMessages(messagesRef.current)
    }

    socket.on('chat:message', onMessage)

    return () => {
      socket.off('chat:message', onMessage)
    }
  }, [room])

  function sendMessage(event: React.FormEvent) {
    event.preventDefault()

    const text = message.trim()
    if (!text) return

    socket.emit('chat:message', { text }, (response: { error?: string } | undefined) => {
      if (!response?.error) setMessage('')
    })
  }

  if (!room) {
    return (
      <Shell>
        <EmptyPanel>
          <EmptyState
            icon={<ChatIcon />}
            title="No room specified."
            description="Choose a room from the messages screen or open a chat from someone who is listening."
            action={
              <EmptyActions>
                <Button
                  variant="secondary"
                  leftIcon={<ArrowLeftIcon />}
                  onClick={() => navigate('/chats')}
                >
                  Back to messages
                </Button>
              </EmptyActions>
            }
          />
        </EmptyPanel>
      </Shell>
    )
  }

  return (
    <Shell>
      <Panel aria-label={`Chat room ${room}`}>
        <InfoBar room={room} />
        {joinError ? (
          <ErrorWrap>
            <ErrorBanner message={joinError} />
          </ErrorWrap>
        ) : null}
        <Messages messages={messages} currentUsername={user?.username ?? ''} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </Panel>
    </Shell>
  )
}
