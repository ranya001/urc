// src/user/chat/MessagesList.jsx
import React, { useEffect, useRef, useState } from 'react';

export function MessagesList({ selectedChat, messages, onSendMessage, usernameConnecte }) {
    const [newMessage, setNewMessage] = useState('');
    const bottomRef = useRef(null);

    // Auto-scroll vers le bas à chaque nouveau message
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (!selectedChat) {
        return <div style={{ flex: 1, padding: '1rem' }}>Sélectionnez un utilisateur ou un salon</div>;
    }

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                <h3>💬 Discussion avec {selectedChat.username || selectedChat.name}</h3>

                {messages.map((msg, index) => {
                    const isOwnMessage = msg.from === usernameConnecte;

                    return (
                        <div
                            key={index}
                            style={{
                                margin: '0.5rem 0',
                                textAlign: isOwnMessage ? 'right' : 'left'
                            }}
                        >
                            <div
                                style={{
                                    display: 'inline-block',
                                    backgroundColor: isOwnMessage ? '#daf1dc' : '#f1f1f1',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '10px',
                                    maxWidth: '70%'
                                }}
                            >
                                <small>
                                    {msg.from} · {new Date(msg.date).toLocaleString()}
                                </small>
                                <br />
                                {msg.text}
                            </div>
                        </div>
                    );
                })}

                <div ref={bottomRef} />
            </div>

            <div style={{
                display: 'flex',
                borderTop: '1px solid #ccc',
                padding: '0.5rem'
            }}>
                <input
                    type="text"
                    placeholder="Écrire un message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{ flex: 1, marginRight: '0.5rem' }}
                />
                <button
                    onClick={() => {
                        if (newMessage.trim()) {
                            onSendMessage(newMessage);
                            setNewMessage('');
                        }
                    }}
                >
                    Envoyer
                </button>
            </div>
        </div>
    );
}


