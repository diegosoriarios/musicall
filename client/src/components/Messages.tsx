import { useEffect, useRef } from 'react'
import styled from 'styled-components'

const messageBoxBackground = '#F3F3F3'

const MessagesContainer = styled.div`
  padding: 5% 0;
  overflow: auto;
  flex: auto;
`

const MessageContainer = styled.div<{ $justify: 'start' | 'end' }>`
  display: flex;
  justify-content: ${(props) => `flex-${props.$justify}`};
  padding: 0 5%;
  margin-top: 3px;
`

const SentText = styled.p`
  display: flex;
  align-items: center;
  color: #828282;
  letter-spacing: 0.3px;
`

const MessageBox = styled.div<{ $blue: boolean }>`
  background: ${(props) => (props.$blue ? '#2979FF' : messageBoxBackground)};
  border-radius: 20px;
  padding: 5px 20px;
  display: inline-block;
  max-width: 80%;
`

const MessageText = styled.p<{ $white: boolean }>`
  width: 100%;
  letter-spacing: 0;
  font-size: 1.1em;
  word-wrap: break-word;
  color: ${(props) => (props.$white ? 'white' : '#353535')};
  margin: 0;
`

const pad = { padding: '0 10px' } as const

export interface MessageData {
  user: string
  text: string
  at: number
}

export function Message({
  message,
  currentUsername,
}: {
  message: MessageData
  currentUsername: string
}) {
  const isSentByCurrentUser = message.user === currentUsername

  return isSentByCurrentUser ? (
    <MessageContainer $justify="end">
      <SentText style={{ ...pad, paddingRight: 10 }}>{message.user}</SentText>
      <MessageBox $blue>
        <MessageText $white>{message.text}</MessageText>
      </MessageBox>
    </MessageContainer>
  ) : (
    <MessageContainer $justify="start">
      <MessageBox $blue={false}>
        <MessageText $white={false}>{message.text}</MessageText>
      </MessageBox>
      <SentText style={{ ...pad, paddingLeft: 10 }}>{message.user}</SentText>
    </MessageContainer>
  )
}

export default function Messages({
  messages,
  currentUsername,
}: {
  messages: MessageData[]
  currentUsername: string
}) {
  const bottomRef = useAutoScroll(messages)

  return (
    <MessagesContainer>
      {messages.map((message, index) => (
        <Message
          key={`${message.at}-${index}`}
          message={message}
          currentUsername={currentUsername}
        />
      ))}
      <div ref={bottomRef} />
    </MessagesContainer>
  )
}

function useAutoScroll(dependency: unknown) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [dependency])

  return bottomRef
}
