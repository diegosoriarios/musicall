import React from 'react'
import { useHistory } from 'react-router-dom';
import Header from '../../components/Header/';

export default function Chat({ chats, loggedIn }) {

    const history = useHistory()

    if (!loggedIn) history.push('/')

    return (
        <div style={{ backgroundColor: 'red' }}>
            <Header title={'Chat'} />
            {chats && 
                chats.map(chat => (
                    <h3>{chat}</h3>
                ))
            }
        </div>
    )
}
