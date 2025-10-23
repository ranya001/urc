// src/user/Home.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { ChatContainer } from './chat/ChatContainer';
import { LogoutButton } from './LogoutButton';

export default function Home() {
    const username = useSelector((state) => state.user.username);

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h1>Bienvenue {username || 'Utilisateur'} !</h1>
            <p>Vous êtes connecté !</p>



            {/* Chat */}
            <div style={{ marginTop: '20px' }}>
                <ChatContainer />
            </div>
        </div>
    );
}
