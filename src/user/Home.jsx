import React from 'react';
import { useSelector } from 'react-redux';

export default function Home() {
    const username = useSelector((state) => state.user.username);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Bienvenue {username || 'Utilisateur'} !</h1>
            <p>Vous êtes connecté !</p>
        </div>
    );
}
