import React from 'react';

export function UsersAndRoomsList({ users, rooms, onSelect }) {
    return (
        <div style={{ width: '25%', borderRight: '1px solid #ccc', padding: '1rem' }}>
            <h3>Utilisateurs</h3>
            {users.map(user => (
                <div
                    key={user.user_id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                        onSelect(user);
                        window.history.pushState({}, '', `/messages/user/${user.user_id}`);
                    }}
                    onKeyPress={e => e.key === 'Enter' && onSelect(user)}
                    style={{ cursor: 'pointer', padding: '0.5rem' }}
                >
                    {user.username} - Dernière connexion: {user.last_login || 'inconnue'}
                </div>
            ))}

            <h3>Salons</h3>
            {rooms.map(room => (
                <div
                    key={room.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelect({ ...room, isRoom: true })}
                    onKeyPress={e => e.key === 'Enter' && onSelect({ ...room, isRoom: true })}
                    style={{ cursor: 'pointer', padding: '0.5rem' }}
                >
                    💬 {room.name}
                </div>
            ))}
        </div>
    );
}
