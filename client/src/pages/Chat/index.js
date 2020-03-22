import React from 'react'
import { useHistory } from 'react-router-dom';

export default function Chat({ chats, loggedIn }) {

    const history = useHistory()

    if (!loggedIn) history.push('/')

    return (
        <div style={{ backgroundColor: 'red' }}>
            {chats && 
                chats.map(chat => (
                    <h3>{chat}</h3>
                ))
            }
        </div>
    )
}
