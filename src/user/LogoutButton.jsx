// src/user/LogoutButton.jsx
import React from 'react';

export function LogoutButton() {
    const handleLogout = () => {
        const token = sessionStorage.getItem('token'); // ou localStorage
        if (token) {
            fetch('/api/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });
        }

        sessionStorage.removeItem('token'); // supprime le token côté client
        window.location.href = '/'; // redirige vers la page de connexion
    };

    return (
        <button
            onClick={handleLogout}
            style={{
                backgroundColor: '#e63946',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
            }}
        >
            Déconnexion
        </button>
    );
}
