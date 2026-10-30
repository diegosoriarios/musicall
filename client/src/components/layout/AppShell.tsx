import { Link, Outlet, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../auth/AuthContext'
import { Avatar } from '../ui/Avatar'
import { Logo } from '../ui/Logo'
import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'

const Shell = styled.div`
  display: grid;
  min-height: 100dvh;
  grid-template-columns: ${({ theme }) => theme.layout.sidebar} minmax(0, 1fr);
  background: ${({ theme }) => theme.colors.bg};
  background-image: ${({ theme }) => theme.gradients.pageGlow};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const Main = styled.div`
  min-width: 0;
  min-height: 100dvh;
`

const MobileHeader = styled.header`
  display: none;
  height: ${({ theme }) => theme.layout.mobileHeader};
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.space.md}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(11, 11, 13, 0.9);
  backdrop-filter: blur(18px);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`

const ProfileLink = styled(Link)`
  display: inline-flex;
  border-radius: 50%;
`

const Content = styled.main<{ $immersive: boolean }>`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  min-height: ${({ $immersive }) => ($immersive ? '100dvh' : 'calc(100dvh - 1px)')};
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.space.xxl}px ${theme.space.xxl}px ${theme.space.xxxl}px`};

  ${({ $immersive }) =>
    $immersive &&
    `
      max-width: none;
      min-height: 100dvh;
      padding: 0;
    `}

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: ${({ $immersive, theme }) =>
      $immersive ? '100dvh' : `calc(100dvh - ${theme.layout.mobileHeader})`};
    padding: ${({ $immersive, theme }) =>
      $immersive
        ? '0'
        : `${theme.space.lg}px ${theme.space.md}px calc(${theme.layout.mobileNav}px + ${theme.space.xxl}px + env(safe-area-inset-bottom))`};
  }
`

export function AppShell() {
  const { user } = useAuth()
  const location = useLocation()
  const immersive = location.pathname === '/chat'

  return (
    <Shell>
      <Sidebar />
      <Main>
        {immersive ? null : (
          <MobileHeader>
            <Logo />
            <ProfileLink to="/profile" aria-label="Open profile">
              <Avatar src={user?.avatar} name={user?.username ?? 'Account'} size={34} />
            </ProfileLink>
          </MobileHeader>
        )}
        <Content $immersive={immersive}>
          <Outlet />
        </Content>
        {immersive ? null : <MobileNav />}
      </Main>
    </Shell>
  )
}
