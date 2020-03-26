import React from 'react'
import Header from '../../components/Header'
import { useHistory } from 'react-router-dom';
import { Avatar, Container, InfoContainer, InfoContainerName, InfoContainerEmail, ProfileInfo } from './styles';
import { PowerSettingsNew } from '@material-ui/icons';

function Profile({ user, loggedIn, logout }) {
    const history = useHistory()

    function handleLogout() {
        history.push('/')
        logout()
    }

    if (!loggedIn) history.push('/')

    return <div>
        <Header title={'Profile'}>
            <PowerSettingsNew style={{ color: 'white' }} onClick={handleLogout} />
        </Header>
        <Container>
            <Avatar src={user.image} alt={user.name} />
            <InfoContainer>
                <InfoContainerName>{user.name}</InfoContainerName>
                <InfoContainerEmail>{user.email}</InfoContainerEmail>
            </InfoContainer>
        </Container>
        <ProfileInfo>
            <p>Posts: 0</p>
            <p>Followers: 0</p>
            <p>Following: 0</p>
        </ProfileInfo>
    </div>
}

export default Profile