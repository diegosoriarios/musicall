import React from 'react'
import { Container, BackButton, RightButton } from './styles'
import { ArrowBack } from '@material-ui/icons';

function Header({ title, goBackActive=false, goBack, children = null }) {
    return (
        <Container>
            {goBackActive ? 
                <BackButton onClick={() => goBack(false)}>
                    <ArrowBack style={{ color: 'white' }} />
                </BackButton> : null}
            <h2 style={{ color: 'white' }}>{title}</h2>
            <RightButton>
                {children}
            </RightButton>
        </Container>
    )
}

export default Header