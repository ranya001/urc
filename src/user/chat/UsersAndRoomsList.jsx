// src/user/chat/UsersAndRoomsList.jsx
import React from 'react';

export function UsersAndRoomsList({ users, rooms, onSelect }) {
    return (
        <div style={{ width: '25%', borderRight: '1px solid #ccc', padding: '1rem', overflowY: 'auto' }}>
            <h3>Utilisateurs</h3>
            {users.map((user) => (
                <button
                    key={user.user_id}
                    onClick={() => onSelect(user)}
                    style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        marginBottom: '0.25rem',
                    }}
                >
                    👤 {user.username}
                </button>
            ))}

            <h3>Salons</h3>
            {rooms.map((room) => (
                <button
                    key={room.id}
                    onClick={() => onSelect(room)}
                    style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        marginBottom: '0.25rem',
                    }}
                >
                    💬 {room.name}
                </button>
            ))}
        </div>
    );
}
