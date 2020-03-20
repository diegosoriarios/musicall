import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

export default function Chat({ chats }) {

    console.log(chats)

    return (
        <div style={{ backgroundColor: 'red' }}>
            {chats && 
                chats.map(chat => (
                    <h3>{chat}</h3>
                ))
            }
        </div>
    )
}
