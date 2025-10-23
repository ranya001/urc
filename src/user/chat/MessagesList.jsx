// src/user/chat/MessagesList.jsx
import React, { useState } from 'react';

export function MessagesList({ selectedChat, messages, onSendMessage }) {
    const [newMessage, setNewMessage] = useState('');

    if (!selectedChat) {
        return <div style={{ flex: 1, padding: '1rem' }}>Sélectionne un utilisateur ou un salon</div>;
    }

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                <h3>💬 Discussion avec {selectedChat.username}</h3>
                {messages.map((msg, index) => (
                    <div key={index} style={{ margin: '0.5rem 0' }}>
                        <b>{msg.sender} :</b> {msg.text}
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', borderTop: '1px solid #ccc', padding: '0.5rem' }}>
                <input
                    type="text"
                    placeholder="Écrire un message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{ flex: 1, marginRight: '0.5rem' }}
                />
                <button onClick={handleSend}>Envoyer</button>
            </div>
        </div>
    );
}
