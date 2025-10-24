import { sql } from '@vercel/postgres';
import CryptoJS from 'crypto-js';
import { Redis } from '@upstash/redis';
import crypto from 'crypto';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
        }

        const hashedPassword = CryptoJS.SHA256(password).toString();

        const { rowCount, rows } = await sql`
            SELECT * FROM users WHERE username=${username} AND password=${hashedPassword}
        `;

        if (rowCount !== 1) {
            return res.status(401).json({ error: "Identifiant ou mot de passe incorrect" });
        }

        // 🔹 Mettre à jour last_login
        await sql`
            UPDATE users SET last_login = NOW() WHERE user_id = ${rows[0].user_id}
        `;

        const token = crypto.randomUUID();
        const user = {
            id: rows[0].user_id,
            username: rows[0].username,
            email: rows[0].email,
            externalId: rows[0].external_id
        };

        await redis.set(token, user, { ex: 3600 });
        await redis.hset("users", { [user.id]: user });

        return res.status(200).json({
            token,
            username,
            externalId: rows[0].external_id,
            id: rows[0].user_id
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
