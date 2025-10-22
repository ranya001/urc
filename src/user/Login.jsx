import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) throw new Error('Identifiants invalides');

            const data = await response.json();

            // Stockage du token et username
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('username', data.username || username);
            dispatch(setUser({ token: data.token, username: data.username || username }));

            // REDIRECTION
            navigate('/home');
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="login-container">
            <h2>Connexion</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Se connecter</button>
                <p style={{ marginTop: '15px' }}>
                    Pas encore de compte ?{' '}
                    <a href="/register" style={{ color: '#007bff' }}>
                        Créez-en un ici
                    </a>
                </p>

            </form>
        </div>
    );
}
