import React, { useState } from 'react'
import { useHistory, Link } from 'react-router-dom';
import Header from '../../components/Header/';

import { JoinInnerContainer, Heading, JoinInput, Button, JoinOutterContainer } from './styles'

export default function Chat({ chats, loggedIn }) {

    const [name, setName] = useState('')
    const [room, setRoom] = useState('')

    const history = useHistory()

    if (!loggedIn) history.push('/')

    return (
        <JoinOutterContainer>
            <Header title={'Chat'} />
            <JoinInnerContainer>
                <Heading>Join</Heading>
                <JoinInput placeholder="Name" type="text" onChange={e => setName(e.target.value)} />
                <JoinInput placeholder="Room" style={{ marginTop: '20%' }} type="text" onChange={e => setRoom(e.target.value)} />
                <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}>
                    <Button>Sign In</Button>
                </Link>
            </JoinInnerContainer>
        </JoinOutterContainer>
    )
}
