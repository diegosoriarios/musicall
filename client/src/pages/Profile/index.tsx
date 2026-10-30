import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../auth/AuthContext'
import { HeadphonesIcon, LogOutIcon, MusicNoteIcon, UserIcon } from '../../components/icons'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xl}px;
`

const ProfileHero = styled(Card)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xl}px;
  background:
    radial-gradient(circle at 10% 20%, rgba(29, 185, 84, 0.18), transparent 34%),
    ${({ theme }) => theme.colors.surface};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    align-items: flex-start;
    flex-direction: column;
    gap: ${({ theme }) => theme.space.lg}px;
  }
`

const AvatarWrap = styled.div`
  flex: none;
`

const Identity = styled.div`
  min-width: 0;
`

const Name = styled.h2`
  margin: ${({ theme }) => theme.space.sm}px 0 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: clamp(26px, 4vw, 40px);
  font-weight: ${({ theme }) => theme.font.weights.black};
  letter-spacing: -0.05em;
  line-height: 1.05;
`

const Email = styled.p`
  margin: ${({ theme }) => theme.space.xs}px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.sizes.md};
  overflow-wrap: anywhere;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space.lg}px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const SectionTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm}px;
  margin-bottom: ${({ theme }) => theme.space.md}px;
  color: ${({ theme }) => theme.colors.accentHover};

  svg {
    width: 19px;
    height: 19px;
  }
`

const SectionTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizes.lg};
  font-weight: ${({ theme }) => theme.font.weights.bold};
  letter-spacing: -0.02em;
`

const Details = styled.dl`
  margin: 0;
`

const DetailRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md}px;
  padding: ${({ theme }) => theme.space.md}px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  &:first-of-type {
    border-top: none;
    padding-top: 0;
  }

  &:last-of-type {
    padding-bottom: 0;
  }
`

const DetailLabel = styled.dt`
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: ${({ theme }) => theme.font.sizes.xs};
  font-weight: ${({ theme }) => theme.font.weights.semibold};
  letter-spacing: 0.04em;
  text-transform: uppercase;
`

const DetailValue = styled.dd`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.sizes.sm};
  text-align: right;
  overflow-wrap: anywhere;
`

const ActionStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm}px;
`

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  if (!user) return null

  return (
    <Page>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Your Musicall identity and the Spotify account connected to it."
      />

      <ProfileHero>
        <AvatarWrap>
          <Avatar src={user.avatar} name={user.username} size={112} loading="eager" />
        </AvatarWrap>
        <Identity>
          <Badge tone="accent">Spotify connected</Badge>
          <Name>{user.username}</Name>
          <Email>{user.email}</Email>
        </Identity>
      </ProfileHero>

      <Grid>
        <Card>
          <SectionTitleWrap>
            <UserIcon />
            <SectionTitle>Account details</SectionTitle>
          </SectionTitleWrap>
          <Details>
            <DetailRow>
              <DetailLabel>Display name</DetailLabel>
              <DetailValue>{user.username}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Email</DetailLabel>
              <DetailValue>{user.email}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Sign-in</DetailLabel>
              <DetailValue>Spotify OAuth</DetailValue>
            </DetailRow>
          </Details>
        </Card>

        <Card>
          <SectionTitleWrap>
            <MusicNoteIcon />
            <SectionTitle>Quick actions</SectionTitle>
          </SectionTitleWrap>
          <ActionStack>
            <Button
              variant="secondary"
              fullWidth
              leftIcon={<HeadphonesIcon />}
              onClick={() => navigate('/')}
            >
              Back to listening
            </Button>
            <Button
              variant="danger"
              fullWidth
              leftIcon={<LogOutIcon />}
              onClick={() => void handleLogout()}
            >
              Log out
            </Button>
          </ActionStack>
        </Card>
      </Grid>
    </Page>
  )
}
