import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ChatIcon, MusicNoteIcon, UsersIcon } from '../../components/icons'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Field } from '../../components/ui/Field'
import { TextInput } from '../../components/ui/inputs'
import { PageHeader } from '../../components/ui/PageHeader'

const Page = styled.div`
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
`

const JoinCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(28px, 6vw, 56px);
  background:
    radial-gradient(circle at 50% 0%, rgba(29, 185, 84, 0.16), transparent 42%),
    ${({ theme }) => theme.colors.surface};
  text-align: center;
`

const IconWrap = styled.div`
  display: inline-flex;
  width: 64px;
  height: 64px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.space.lg}px;
  border: 1px solid rgba(29, 185, 84, 0.24);
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.accentHover};

  svg {
    width: 28px;
    height: 28px;
  }
`

const Heading = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: clamp(24px, 4vw, 34px);
  font-weight: ${({ theme }) => theme.font.weights.black};
  letter-spacing: -0.045em;
`

const Copy = styled.p`
  max-width: 500px;
  margin: ${({ theme }) => theme.space.sm}px 0 ${({ theme }) => theme.space.xl}px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.sizes.md};
  line-height: 1.65;
`

const Form = styled.form`
  display: flex;
  width: 100%;
  max-width: 480px;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md}px;
  text-align: left;
`

const Hints = styled.ul`
  display: grid;
  width: 100%;
  max-width: 560px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space.sm}px;
  margin: ${({ theme }) => theme.space.xl}px 0 0;
  padding: 0;
  list-style: none;
  text-align: left;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const Hint = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space.sm}px;
  padding: ${({ theme }) => theme.space.md}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.bgSoft};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.sizes.xs};
  line-height: 1.5;

  svg {
    width: 17px;
    height: 17px;
    color: ${({ theme }) => theme.colors.accentHover};
    flex: none;
  }
`

export default function Chat() {
  const [room, setRoom] = useState('')
  const navigate = useNavigate()

  function handleJoin(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = room.trim()
    if (!trimmed) return
    navigate(`/chat?room=${encodeURIComponent(trimmed)}`)
  }

  return (
    <Page>
      <PageHeader
        eyebrow="Community"
        title="Messages"
        description="Join a public room or open a private conversation from someone in your listening circle."
      />

      <JoinCard>
        <IconWrap aria-hidden="true">
          <ChatIcon />
        </IconWrap>
        <Heading>Find your room</Heading>
        <Copy>
          Enter a room name to join the conversation. Room links are shared from the listening
          screen or from people you want to talk to.
        </Copy>

        <Form onSubmit={handleJoin}>
          <Field label="Room name" hint="Public rooms are open to everyone in Musicall.">
            <TextInput
              placeholder="Room"
              value={room}
              onChange={(event) => setRoom(event.target.value)}
              autoComplete="off"
              aria-label="Room name"
            />
          </Field>
          <Button type="submit" fullWidth size="lg" disabled={!room.trim()}>
            Join room
          </Button>
        </Form>

        <Hints>
          <Hint>
            <MusicNoteIcon />
            Talk about what you are playing right now.
          </Hint>
          <Hint>
            <UsersIcon />
            Public rooms are built around shared listening.
          </Hint>
          <Hint>
            <ChatIcon />
            Private chats stay between the people in them.
          </Hint>
        </Hints>
      </JoinCard>
    </Page>
  )
}
