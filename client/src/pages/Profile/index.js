import React from 'react'
import { useHistory } from 'react-router-dom';

function Profile({ user, loggedIn, logout }) {
    const history = useHistory()

    function handleLogout() {
        history.push('/')
        logout()
    }

    if (!loggedIn) history.push('/')

    return <div>
        <h2>{user.name}</h2>
        <h3>{user.email}</h3>
        <img src={user.image} alt={user.name} />
        <button onClick={() => handleLogout()}>Logout</button>
    </div>
}

export default Profile