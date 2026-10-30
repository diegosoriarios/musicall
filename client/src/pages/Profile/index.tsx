import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../../components/Header'
import { PowerSettingsNewIcon } from '../../components/icons'
import { useAuth } from '../../auth/AuthContext'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-top: 100px;
`

const Avatar = styled.img`
  width: 25%;
  max-width: 220px;
  border-radius: 50%;
`

const InfoContainer = styled.div`
  text-align: center;
`

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 40px;
`

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/', { replace: true })
  }

  if (!user) return null

  return (
    <div>
      <Header title="Profile">
        <Tooltip title="Logout">
          <IconButton onClick={() => void handleLogout()} aria-label="Logout">
            <PowerSettingsNewIcon style={{ color: 'black' }} />
          </IconButton>
        </Tooltip>
      </Header>
      <Container>
        <Avatar src={user.avatar} alt={user.username} />
        <InfoContainer>
          <h2>{user.username}</h2>
          <h4>{user.email}</h4>
        </InfoContainer>
      </Container>
      <ProfileInfo>
        <p>Posts: 0</p>
        <p>Followers: 0</p>
        <p>Following: 0</p>
      </ProfileInfo>
    </div>
  )
}
