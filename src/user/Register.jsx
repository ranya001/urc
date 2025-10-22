import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !email || !password) {
            alert('Tous les champs sont obligatoires !');
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json(); // récupère le vrai message de l'API

            if (!response.ok) throw new Error(data.error || 'Impossible de créer l’utilisateur');

            alert('✅ Utilisateur créé avec succès !');
            navigate('/'); // redirige vers la page de connexion
        } catch (err) {
            alert(err.message); // affichera maintenant le vrai message de l'API
        }
    }; // <-- fermeture de handleRegister ici

    return (
        <div className="login-container">
            <h2>Inscription</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">S’inscrire</button>
            </form>
        </div>
    );
}
