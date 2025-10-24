// src/user/chat/ChatContainer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UsersAndRoomsList } from './UsersAndRoomsList';
import { MessagesList } from './MessagesList';
import { setUsers, setSelectedUser } from '../../store/chatSlice';

export function ChatContainer() {
    const dispatch = useDispatch();
    const usernameConnecte = useSelector(state => state.user.username);
    const userIdConnecte = useSelector(state => state.user.id);
    const selectedChat = useSelector(state => state.chat.selectedUser);
    const users = useSelector(state => state.chat.users);

    const [messages, setMessages] = useState([]);
    const [rooms] = useState([
        { id: 1, name: 'Salon général', isRoom: true },
        { id: 2, name: 'Projets', isRoom: true },
        { id: 3, name: 'Random', isRoom: true },
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const messagesEndRef = useRef(null);

    // 🔽 Auto-scroll vers le bas à chaque nouveau message
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    useEffect(scrollToBottom, [messages]);

    // 🔹 Charger les utilisateurs
    useEffect(() => {
        async function fetchUsers() {
            try {
                const token = sessionStorage.getItem('token');
                const res = await fetch('/api/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error(`Erreur ${res.status}`);
                const data = await res.json();
                const usersSansMoi = data.filter(u => u.username !== usernameConnecte);
                dispatch(setUsers(usersSansMoi));

                // Si on arrive via une URL directe du type /messages/user/2
                const path = window.location.pathname;
                const match = path.match(/\/messages\/user\/(\d+)/);
                if (match) {
                    const userId = parseInt(match[1], 10);
                    const selected = usersSansMoi.find(u => u.id === userId);
                    if (selected) dispatch(setSelectedUser(selected));
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, [dispatch, usernameConnecte]);

    // 🔹 Charger les messages d’une conversation
    useEffect(() => {
        if (!selectedChat || selectedChat.isRoom) return;

        async function fetchMessages() {
            try {
                const token = sessionStorage.getItem('token');
                const toUserId = selectedChat.user_id;

                console.log(selectedChat)
                console.info(toUserId)
                const res = await fetch(`/api/messages/${toUserId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(res)

                if (!res.ok) throw new Error(`Erreur ${res.status}`);
                const data = await res.json();
                setMessages(data);
            } catch (err) {
                console.error("Erreur chargement messages :", err);
            }
        }

        fetchMessages();
    }, [selectedChat, userIdConnecte]);

    if (loading) return <div style={{ padding: '2rem' }}>⏳ Chargement...</div>;
    if (error) return <div style={{ padding: '2rem', color: 'red' }}>⚠️ {error}</div>;

    return (
        <div className="chat-container" style={{ display: 'flex', height: '90vh' }}>
            {/* Liste des utilisateurs et salons */}
            <UsersAndRoomsList
                users={users}
                rooms={rooms}
                onSelect={(item) => {
                    dispatch(setSelectedUser(item));
                    if (!item.isRoom && item.id) {
                        console.log(item)
                        window.history.pushState({}, '', `/messages/user/${item.id}`);
                    }
                }}
            />

            {/* Zone de messages */}
            {selectedChat ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* On passe le nom de l'utilisateur connecté au composant MessagesList */}
                    <MessagesList
                        selectedChat={selectedChat}
                        messages={messages}
                        usernameConnecte={usernameConnecte}
                        onSendMessage={async (msg) => {
                            const newMessage = {
                                from: usernameConnecte,
                                to: selectedChat.user_id, // ✅ Correction ici
                                text: msg,
                                date: new Date().toISOString()
                            };
                            setMessages(prev => [...prev, newMessage]);

                            // Envoi au backend
                            if (!selectedChat.isRoom) {
                                try {
                                    const token = sessionStorage.getItem('token');
                                    await fetch(`/api/message`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: `Bearer ${token}`
                                        },
                                        body: JSON.stringify({ toUserId: selectedChat.user_id, text: msg }) // ✅ Correction ici aussi
                                    });
                                } catch (err) {
                                    console.error("Erreur envoi message :", err);
                                }
                            }
                        }}

                    />
                    <div ref={messagesEndRef} />
                </div>
            ) : (
                <div style={{ padding: '2rem', flex: 1 }}>
                    Sélectionnez un utilisateur ou un salon pour commencer la conversation
                </div>
            )}
        </div>
    );
}
