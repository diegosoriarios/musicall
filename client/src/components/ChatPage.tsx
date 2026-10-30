import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { customColors } from '../assets/colors'
import { useAuth } from '../auth/AuthContext'
import { socket } from '../sockets/socket'
import type { ChatMessage } from '../types'
import InfoBar from './InfoBar'
import Input from './Input'
import Messages from './Messages'

const OuterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1a1a1d;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: ${customColors.black};
  border-radius: 8px;
  height: 60%;
  width: 90%;
`

export default function ChatPage() {
  const [searchParams] = useSearchParams()
  const room = searchParams.get('room') ?? ''
  const { user } = useAuth()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [message, setMessage] = useState('')
  const messagesRef = useRef<ChatMessage[]>([])

  useEffect(() => {
    if (!room) return

    setMessages([])
    messagesRef.current = []

    socket.emit('chat:join', { room }, (response: { error?: string } | undefined) => {
      if (response?.error) {
        console.warn('Failed to join room:', response.error)
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
      <OuterContainer>
        <p style={{ color: 'white' }}>No room specified.</p>
      </OuterContainer>
    )
  }

  return (
    <OuterContainer>
      <Container>
        <InfoBar room={room} />
        <Messages messages={messages} currentUsername={user?.username ?? ''} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </Container>
    </OuterContainer>
  )
}
