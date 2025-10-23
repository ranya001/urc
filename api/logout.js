import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ error: 'Token manquant' });

        await redis.del(token); // supprime la session côté serveur
        return res.status(200).json({ message: 'Déconnexion réussie' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}
