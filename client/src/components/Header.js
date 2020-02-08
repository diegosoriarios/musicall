import React from 'react'
import { ArrowBack, MoreHoriz } from '@material-ui/icons';
import '../App.css'

function Header({ title }) {
    return (
        <div className="header">
            <ArrowBack style={{ color: 'white' }} />
            <h2 style={{ color: 'white' }}>{title}</h2>
            <MoreHoriz style={{ color: 'white' }} />
        </div>
    )
}

export default Header