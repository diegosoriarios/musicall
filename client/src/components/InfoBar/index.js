import React from 'react'
import { InfoBarContainer, LeftInnerContainer, RightInnerContainer } from './styles'
import { MusicNote, Close } from '@material-ui/icons'
import { customColors } from '../../assets/colors';

const InfoBar = ({ room }) => (
    <InfoBarContainer>
        <LeftInnerContainer>
            <MusicNote style={{ color: customColors.black }} />
            <h3>{room}</h3>
        </LeftInnerContainer>
        <RightInnerContainer>
            <a href="/chats">
                <Close />
            </a>
        </RightInnerContainer>
    </InfoBarContainer>
)

export default InfoBar