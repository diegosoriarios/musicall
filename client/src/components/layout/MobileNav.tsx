import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { ChatIcon, FeedIcon, HeadphonesIcon, UserIcon } from '../icons'

const Nav = styled.nav`
  position: fixed;
  z-index: 20;
  right: 0;
  bottom: 0;
  left: 0;
  display: none;
  height: calc(${({ theme }) => theme.layout.mobileNav} + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(11, 11, 13, 0.94);
  backdrop-filter: blur(18px);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
`

const StyledNavLink = styled(NavLink)`
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: ${({ theme }) => theme.colors.textFaint};
  text-decoration: none;
  font-size: 10px;
  font-weight: ${({ theme }) => theme.font.weights.semibold};
  letter-spacing: 0.02em;

  svg {
    width: 21px;
    height: 21px;
  }

  &.active {
    color: ${({ theme }) => theme.colors.accentHover};
  }
`

const LINKS = [
  { to: '/', label: 'Listening', icon: HeadphonesIcon, end: true },
  { to: '/feed', label: 'Feed', icon: FeedIcon, end: false },
  { to: '/chats', label: 'Messages', icon: ChatIcon, end: false },
  { to: '/profile', label: 'Profile', icon: UserIcon, end: false },
] as const

export function MobileNav() {
  return (
    <Nav aria-label="Primary">
      {LINKS.map(({ to, label, icon: Icon, end }) => (
        <StyledNavLink key={to} to={to} end={end}>
          <Icon />
          <span>{label}</span>
        </StyledNavLink>
      ))}
    </Nav>
  )
}
