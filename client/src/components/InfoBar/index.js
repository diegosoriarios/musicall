import React from 'react'
import { InfoBarContainer, LeftInnerContainer, RightInnerContainer } from './styles'
import { CheckBoxRounded, Close } from '@material-ui/icons'

const InfoBar = ({ room }) => (
    <InfoBarContainer>
        <LeftInnerContainer>
            <CheckBoxRounded style={{ color: 'green' }} />
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