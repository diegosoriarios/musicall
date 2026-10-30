import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { customColors } from '../assets/colors'
import { CloseIcon, MusicNoteIcon } from './icons'

const InfoBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${customColors.green};
  border-radius: 4px;
  width: 100%;
  padding: 5% 5% 5% 5%;
`

const LeftInnerContainer = styled.div`
  display: flex;
  align-items: center;
  color: ${customColors.black};
  margin-right: 10px;

  h3 {
    margin: 0 0 0 10px;
  }
`

const RightInnerContainer = styled.div`
  display: flex;
  align-items: center;
  color: ${customColors.black};
`

interface InfoBarProps {
  room: string
}

export default function InfoBar({ room }: InfoBarProps) {
  return (
    <InfoBarContainer>
      <LeftInnerContainer>
        <MusicNoteIcon />
        <h3>{room}</h3>
      </LeftInnerContainer>
      <RightInnerContainer>
        <Link to="/chats" aria-label="Close chat">
          <CloseIcon />
        </Link>
      </RightInnerContainer>
    </InfoBarContainer>
  )
}
