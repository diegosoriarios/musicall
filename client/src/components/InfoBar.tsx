import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Badge } from './ui/Badge'
import { ArrowLeftIcon, ChatIcon } from './icons'

const Bar = styled.header`
  display: flex;
  min-height: 64px;
  align-items: center;
  gap: ${({ theme }) => theme.space.md}px;
  padding: 0 ${({ theme }) => theme.space.md}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`

const BackLink = styled(Link)`
  display: inline-flex;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: none;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
  }

  svg {
    width: 21px;
    height: 21px;
  }
`

const RoomInfo = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm}px;
`

const RoomIcon = styled.span`
  display: inline-flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.accentHover};
  flex: none;

  svg {
    width: 18px;
    height: 18px;
  }
`

const RoomCopy = styled.div`
  min-width: 0;
`

const RoomName = styled.h2`
  overflow: hidden;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizes.sm};
  font-weight: ${({ theme }) => theme.font.weights.semibold};
  letter-spacing: -0.01em;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const RoomMeta = styled.p`
  margin: 2px 0 0;
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: ${({ theme }) => theme.font.sizes.xs};
`

interface InfoBarProps {
  room: string
}

export default function InfoBar({ room }: InfoBarProps) {
  const isDirect = room.startsWith('dm:')

  return (
    <Bar>
      <BackLink to="/chats" aria-label="Back to messages">
        <ArrowLeftIcon />
      </BackLink>
      <RoomIcon aria-hidden="true">
        <ChatIcon />
      </RoomIcon>
      <RoomInfo>
        <RoomCopy>
          <RoomName>{room}</RoomName>
          <RoomMeta>{isDirect ? 'Private conversation' : 'Public room'}</RoomMeta>
        </RoomCopy>
        <Badge tone={isDirect ? 'accent' : 'neutral'}>{isDirect ? 'Direct' : 'Live'}</Badge>
      </RoomInfo>
    </Bar>
  )
}
