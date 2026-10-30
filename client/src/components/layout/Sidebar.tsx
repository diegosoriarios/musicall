import { NavLink, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../auth/AuthContext'
import { ChatIcon, FeedIcon, HeadphonesIcon, LogOutIcon, UserIcon } from '../icons'
import { Avatar } from '../ui/Avatar'
import { IconButton } from '../ui/IconButton'
import { Logo } from '../ui/Logo'

const Aside = styled.aside`
  position: sticky;
  top: 0;
  display: flex;
  height: 100dvh;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xl}px;
  padding: ${({ theme }) => theme.space.lg}px ${({ theme }) => theme.space.md}px;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(11, 11, 13, 0.86);
  backdrop-filter: blur(18px);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`

const BrandWrap = styled.div`
  padding: ${({ theme }) => theme.space.sm}px ${({ theme }) => theme.space.sm}px 0;
`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs}px;
`

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 46px;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: none;
  font-size: ${({ theme }) => theme.font.sizes.sm};
  font-weight: ${({ theme }) => theme.font.weights.medium};
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  svg {
    width: 21px;
    height: 21px;
    flex: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
  }

  &.active {
    background: ${({ theme }) => theme.colors.accentSoft};
    color: ${({ theme }) => theme.colors.accentHover};
    font-weight: ${({ theme }) => theme.font.weights.semibold};
  }
`

const Spacer = styled.div`
  flex: 1;
`

const Account = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm}px;
  padding: ${({ theme }) => theme.space.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
`

const AccountLink = styled(NavLink)`
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm}px;
  text-decoration: none;
`

const AccountText = styled.span`
  display: flex;
  min-width: 0;
  flex-direction: column;
`

const AccountName = styled.span`
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizes.sm};
  font-weight: ${({ theme }) => theme.font.weights.semibold};
  text-overflow: ellipsis;
  white-space: nowrap;
`

const AccountMeta = styled.span`
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: ${({ theme }) => theme.font.sizes.xs};
`

const LINKS = [
  { to: '/', label: 'Listening', icon: HeadphonesIcon, end: true },
  { to: '/feed', label: 'Feed', icon: FeedIcon, end: false },
  { to: '/chats', label: 'Messages', icon: ChatIcon, end: false },
  { to: '/profile', label: 'Profile', icon: UserIcon, end: false },
] as const

export function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <Aside>
      <BrandWrap>
        <Logo />
      </BrandWrap>

      <Nav aria-label="Primary">
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <StyledNavLink key={to} to={to} end={end}>
            <Icon />
            <span>{label}</span>
          </StyledNavLink>
        ))}
      </Nav>

      <Spacer />

      <Account>
        <AccountLink to="/profile">
          <Avatar src={user?.avatar} name={user?.username ?? 'Account'} size={38} />
          <AccountText>
            <AccountName>{user?.username ?? 'Account'}</AccountName>
            <AccountMeta>View profile</AccountMeta>
          </AccountText>
        </AccountLink>
        <IconButton label="Log out" tone="ghost" onClick={() => void handleLogout()}>
          <LogOutIcon />
        </IconButton>
      </Account>
    </Aside>
  )
}
