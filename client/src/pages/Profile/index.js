import React from 'react'

function Profile({ user }) {
    return <div>
        <h2>{user.name}</h2>
        <h3>{user.email}</h3>
        <img src={user.image} alt={user.name} />
    </div>
}

export default Profile