import React from 'react'
import { InfoBarContainer, LeftInnerContainer, RightInnerContainer } from './styles'
import { CheckBoxRounded, Close } from '@material-ui/icons'
import { customColors } from '../../assets/colors';

const InfoBar = ({ room }) => (
    <InfoBarContainer>
        <LeftInnerContainer>
            <CheckBoxRounded style={{ color: customColors.green }} />
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