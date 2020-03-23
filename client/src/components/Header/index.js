import React from 'react'
import { Container, BackButton } from './styles'
import { ArrowBack, MoreHoriz } from '@material-ui/icons';

function Header({ title, goBackActive=false, goBack }) {
    return (
        <Container>
            {goBackActive ? 
                <BackButton onClick={() => goBack(false)}>
                    <ArrowBack style={{ color: 'white' }} />
                </BackButton> : null}
            <h2 style={{ color: 'white' }}>{title}</h2>
            {//<MoreHoriz style={{ color: 'white' }} />
            }
        </Container>
    )
}

export default Header