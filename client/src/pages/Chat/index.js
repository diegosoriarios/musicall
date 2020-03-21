import React from 'react'

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
