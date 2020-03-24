import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
import { OuterContainer, Container } from './styles'
import InfoBar from '../../components/InfoBar/'
import Input from '../Input/'
import Messages from '../Messages/'

let socket

export default function ChatPage({ location }) {

    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const ENDPOINT = 'localhost:3847'


    useEffect(() => {
        const { name, room } = queryString.parse(location.search)
        
        socket = io(ENDPOINT)

        console.log(name)
        console.log(room)

        setName(name)
        setRoom(room)

        socket.emit('join', { name, room }, () => {

        })
        
        return () => {
            socket.emit('disconnect')
            socket.off()
        }
    }, [ENDPOINT, location.search])

    useEffect(() => {
        socket.on('message', message => {
            setMessages([...messages, message])
        })
    }, [messages])

    function sendMessage(event) {
        event.preventDefault()

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    console.log(message, messages)

    return (
        <OuterContainer>
            <Container>
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </Container>
        </OuterContainer>
    )
}
