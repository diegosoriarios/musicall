import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { customColors } from '../assets/colors'
import iconImg from '../assets/icon.png'

const NavbarContainer = styled.nav<{ $visible: boolean }>`
  position: fixed;
  width: 100vw;
  min-height: 70px;
  margin: 0;
  display: ${(props) => (props.$visible ? 'flex' : 'none')};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  background-color: ${customColors.black};
  z-index: 5;
  @media only screen and (max-width: 600px) {
    bottom: 0;
    left: 0;
    flex-direction: row;
    justify-content: space-around;
    background-color: #eee;
    height: 50px;
    min-height: 50px;
  }
`

const NavbarHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 50px;
`

const IconImage = styled.img`
  width: 50px;
  height: 50px;
`

const HeaderText = styled.p`
  margin-left: 50px;
  color: ${customColors.white};
  text-transform: uppercase;
`

const NavbarIcons = styled.div`
  display: flex;
  flex-direction: row;
`

const NavbarItem = styled.div`
  text-transform: uppercase;
  margin-left: 20px;
  margin-right: 20px;
`

const LinkText = styled.p<{ $selected: boolean }>`
  color: ${customColors.white};
  border-bottom: ${(props) => (props.$selected ? `3px solid ${customColors.white}` : 'none')};
  &:hover {
    color: ${customColors.green};
  }
`

const LINKS = [
  { to: '/feed', label: 'Home' },
  { to: '/profile', label: 'Profile' },
  { to: '/', label: 'Listening', end: true },
  { to: '/chats', label: 'Messages' },
] as const

export default function Navbar() {
  const { status } = useAuth()

  return (
    <NavbarContainer $visible={status === 'authenticated'}>
      <NavbarHeader>
        <IconImage src={iconImg} alt="Musicall icon" />
        <HeaderText>Musicall</HeaderText>
      </NavbarHeader>
      <NavbarIcons>
        {LINKS.map((link) => (
          <NavbarItem key={link.to}>
            <NavLink
              to={link.to}
              end={'end' in link ? link.end : false}
              style={{ textDecoration: 'none' }}
            >
              {({ isActive }) => <LinkText $selected={isActive}>{link.label}</LinkText>}
            </NavLink>
          </NavbarItem>
        ))}
      </NavbarIcons>
    </NavbarContainer>
  )
}
