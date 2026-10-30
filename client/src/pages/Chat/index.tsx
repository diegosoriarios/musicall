import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../../components/Header'
import { customColors } from '../../assets/colors'

const JoinOuterContainer = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  height: 100vh;
  align-items: center;
  background-color: #1a1a1d;
`

const JoinInnerContainer = styled.div`
  width: 20%;
  min-width: 280px;
`

const Heading = styled.h1`
  color: white;
  font-size: 2.5em;
  padding-bottom: 10px;
  border-bottom: 2px solid white;
`

const JoinInput = styled.input`
  border-radius: 0;
  padding: 15px 20px;
  width: 100%;
`

const Button = styled.button`
  color: ${customColors.black} !important;
  text-transform: uppercase;
  text-decoration: none;
  background: #2979ff;
  padding: 20px;
  border-radius: 5px;
  display: inline-block;
  border: none;
  width: 100%;
  margin-top: 20px;
`

export default function Chat() {
  const [room, setRoom] = useState('')
  const navigate = useNavigate()

  function handleJoin() {
    const trimmed = room.trim()
    if (!trimmed) return
    navigate(`/chat?room=${encodeURIComponent(trimmed)}`)
  }

  return (
    <JoinOuterContainer>
      <div>
        <Header title="Chat" />
        <JoinInnerContainer>
          <Heading>Join</Heading>
          <JoinInput
            placeholder="Room"
            value={room}
            onChange={(event) => setRoom(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleJoin()
            }}
          />
          <Button onClick={handleJoin} disabled={!room.trim()}>
            Sign In
          </Button>
        </JoinInnerContainer>
      </div>
    </JoinOuterContainer>
  )
}
