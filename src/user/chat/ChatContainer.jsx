// src/user/chat/ChatContainer.jsx
import React, { useState, useEffect } from 'react';
import { UsersAndRoomsList } from './UsersAndRoomsList';
import { MessagesList } from './MessagesList';

export function ChatContainer() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    // 🔹 Salons factices pour tester l'affichage
    //const [rooms, setRooms] = useState([
        //{ id: 1, name: 'Salon général' },
        //{ id: 2, name: 'Projets' },
        //{ id: 3, name: 'Random' },
    //]);

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🔹 Charger les utilisateurs depuis la base
    useEffect(() => {
        async function fetchUsers() {
            try {
                const token = sessionStorage.getItem('token');
                const res = await fetch('/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error(`Erreur ${res.status}: impossible de charger les utilisateurs`);
                }

                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error('Erreur lors du chargement des utilisateurs :', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, []);

    if (loading) {
        return <div style={{ padding: '2rem' }}>⏳ Chargement des utilisateurs...</div>;
    }

    if (error) {
        return <div style={{ padding: '2rem', color: 'red' }}>⚠️ {error}</div>;
    }

    return (
        <div className="chat-container" style={{ display: 'flex', height: '90vh' }}>
            <UsersAndRoomsList
                users={users}
                rooms={rooms}
                onSelect={(item) => setSelectedChat(item)}
            />

            <MessagesList
                selectedChat={selectedChat}
                messages={messages}
                onSendMessage={(msg) =>
                    setMessages((prev) => [...prev, { sender: 'moi', text: msg }])
                }
            />
        </div>
    );
} // <- <<--- ce } était manquant avant
