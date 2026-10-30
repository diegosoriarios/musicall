import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Avatar } from './ui/Avatar'
import { EmptyState } from './ui/EmptyState'
import { ChatIcon } from './icons'

const MessagesContainer = styled.div`
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm}px;
  overflow-y: auto;
  padding: ${({ theme }) => `${theme.space.lg}px ${theme.space.md}px`};
`

const MessageRow = styled.div<{ $own: boolean }>`
  display: flex;
  align-items: flex-end;
  justify-content: ${({ $own }) => ($own ? 'flex-end' : 'flex-start')};
  gap: ${({ theme }) => theme.space.sm}px;
`

const BubbleGroup = styled.div<{ $own: boolean }>`
  display: flex;
  max-width: min(76%, 620px);
  flex-direction: column;
  align-items: ${({ $own }) => ($own ? 'flex-end' : 'flex-start')};
  gap: 3px;
`

const Sender = styled.span`
  padding: 0 6px;
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.font.weights.medium};
`

const Bubble = styled.div<{ $own: boolean }>`
  padding: 10px 14px;
  border: 1px solid ${({ $own, theme }) => ($own ? 'rgba(29, 185, 84, 0.28)' : theme.colors.border)};
  border-radius: ${({ $own, theme }) =>
    $own
      ? `${theme.radii.lg} ${theme.radii.lg} 4px ${theme.radii.lg}`
      : `${theme.radii.lg} ${theme.radii.lg} ${theme.radii.lg} 4px`};
  background: ${({ $own, theme }) => ($own ? theme.colors.accentSoft : theme.colors.surfaceRaised)};
  color: ${({ $own, theme }) => ($own ? theme.colors.text : theme.colors.text)};
`

const MessageText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.sizes.md};
  line-height: 1.5;
  overflow-wrap: anywhere;
`

const Time = styled.span`
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: 10px;
  font-variant-numeric: tabular-nums;
`

const EmptyWrap = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`

export interface MessageData {
  user: string
  text: string
  at: number
}

function formatTime(at: number): string {
  return new Date(at).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function Message({
  message,
  currentUsername,
}: {
  message: MessageData
  currentUsername: string
}) {
  const own = message.user === currentUsername

  return (
    <MessageRow $own={own}>
      {own ? null : <Avatar src={null} name={message.user} size={30} />}
      <BubbleGroup $own={own}>
        <Sender>{own ? 'You' : message.user}</Sender>
        <Bubble $own={own}>
          <MessageText>{message.text}</MessageText>
        </Bubble>
        <Time>{formatTime(message.at)}</Time>
      </BubbleGroup>
    </MessageRow>
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

  if (messages.length === 0) {
    return (
      <EmptyWrap>
        <EmptyState
          icon={<ChatIcon />}
          title="Say hello"
          description="No messages yet. Start the conversation with something you are listening to."
        />
      </EmptyWrap>
    )
  }

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
