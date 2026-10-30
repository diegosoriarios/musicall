import { Navigate } from 'react-router-dom'
import styled from 'styled-components'
import spotifyBrand from '../../assets/spotify-brands.svg'
import { useAuth } from '../../auth/AuthContext'
import { ChatIcon, HeadphonesIcon, SparklesIcon, UsersIcon } from '../../components/icons'
import { Button } from '../../components/ui/Button'
import { Logo } from '../../components/ui/Logo'
import { LoadingScreen } from '../../components/layout/LoadingScreen'

const Page = styled.main`
  position: relative;
  display: grid;
  min-height: 100dvh;
  grid-template-columns: minmax(0, 1.15fr) minmax(360px, 0.85fr);
  gap: ${({ theme }) => theme.space.xxl}px;
  align-items: center;
  overflow: hidden;
  padding: ${({ theme }) => theme.space.xxl}px clamp(24px, 6vw, 96px);
  background: ${({ theme }) => theme.colors.bg};
  background-image: ${({ theme }) => theme.gradients.login};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    gap: ${({ theme }) => theme.space.xxl}px;
    padding: ${({ theme }) => `${theme.space.xl}px ${theme.space.lg}px ${theme.space.xxl}px`};
  }
`

const Glow = styled.div<{ $top: string; $left: string; $size: string }>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(29, 185, 84, 0.1), transparent 66%);
  pointer-events: none;
`

const Hero = styled.section`
  position: relative;
  z-index: 1;
  max-width: 640px;
`

const HeroTop = styled.div`
  margin-bottom: clamp(48px, 9vh, 96px);
`

const Kicker = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 ${({ theme }) => theme.space.lg}px;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgba(21, 21, 24, 0.72);
  color: ${({ theme }) => theme.colors.accentHover};
  font-size: ${({ theme }) => theme.font.sizes.xs};
  font-weight: ${({ theme }) => theme.font.weights.semibold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

const Heading = styled.h1`
  max-width: 620px;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizes.display};
  font-weight: ${({ theme }) => theme.font.weights.black};
  letter-spacing: -0.06em;
  line-height: 0.98;
`

const Accent = styled.span`
  color: ${({ theme }) => theme.colors.accentHover};
`

const Subcopy = styled.p`
  max-width: 540px;
  margin: ${({ theme }) => theme.space.lg}px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: clamp(15px, 1.6vw, 18px);
  line-height: 1.65;
`

const Features = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.sm}px;
  margin: ${({ theme }) => theme.space.xl}px 0 0;
  padding: 0;
  list-style: none;
`

const Feature = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgba(21, 21, 24, 0.62);
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.sizes.xs};

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.accentHover};
  }
`

const AuthSection = styled.section`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  justify-self: end;
  padding: clamp(24px, 4vw, 40px);
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: rgba(16, 16, 19, 0.84);
  box-shadow: ${({ theme }) => theme.shadows.floating};
  backdrop-filter: blur(24px);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 560px;
    justify-self: stretch;
  }
`

const CardLabel = styled.p`
  margin: 0 0 ${({ theme }) => theme.space.sm}px;
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: ${({ theme }) => theme.font.sizes.xs};
  font-weight: ${({ theme }) => theme.font.weights.semibold};
  letter-spacing: 0.12em;
  text-transform: uppercase;
`

const CardTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizes.xxl};
  font-weight: ${({ theme }) => theme.font.weights.bold};
  letter-spacing: -0.04em;
`

const CardCopy = styled.p`
  margin: ${({ theme }) => theme.space.sm}px 0 ${({ theme }) => theme.space.xl}px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.sizes.sm};
  line-height: 1.6;
`

const SpotifyMark = styled.img`
  width: 20px;
  height: 20px;
`

const FinePrint = styled.p`
  margin: ${({ theme }) => theme.space.md}px 0 0;
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: ${({ theme }) => theme.font.sizes.xs};
  line-height: 1.5;
  text-align: center;
`

const FEATURES = [
  { icon: HeadphonesIcon, label: 'Live listening presence' },
  { icon: UsersIcon, label: 'Find your music people' },
  { icon: ChatIcon, label: 'Rooms and direct chats' },
  { icon: SparklesIcon, label: 'Artist discovery' },
] as const

export default function LoginPage() {
  const { status, login } = useAuth()

  if (status === 'loading') {
    return <LoadingScreen label="Checking your session..." />
  }

  if (status === 'authenticated') {
    return <Navigate to="/" replace />
  }

  return (
    <Page>
      <Glow $top="-14%" $left="-8%" $size="560px" />
      <Glow $top="58%" $left="34%" $size="420px" />

      <Hero>
        <HeroTop>
          <Logo />
        </HeroTop>
        <Kicker>
          <SparklesIcon />
          Music is better together
        </Kicker>
        <Heading>
          Find your people <Accent>through music.</Accent>
        </Heading>
        <Subcopy>
          Musicall connects your Spotify listening with a social feed, live presence, and
          conversations with people on the same wavelength.
        </Subcopy>
        <Features>
          {FEATURES.map(({ icon: Icon, label }) => (
            <Feature key={label}>
              <Icon />
              {label}
            </Feature>
          ))}
        </Features>
      </Hero>

      <AuthSection aria-labelledby="sign-in-title">
        <CardLabel>Welcome back</CardLabel>
        <CardTitle id="sign-in-title">Sign in to Musicall</CardTitle>
        <CardCopy>
          Continue with your Spotify account to sync your listening and join the conversation.
        </CardCopy>
        <Button
          size="lg"
          fullWidth
          onClick={login}
          leftIcon={<SpotifyMark src={spotifyBrand} alt="" aria-hidden="true" />}
        >
          Continue with Spotify
        </Button>
        <FinePrint>No password needed. Your Spotify credentials stay with Spotify.</FinePrint>
      </AuthSection>
    </Page>
  )
}
