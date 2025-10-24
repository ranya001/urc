// /api/message.js
const { getConnecterUser, triggerNotConnected } = require("../lib/session.js");
const { Redis } = require('@upstash/redis');

const redis = Redis.fromEnv();

module.exports = async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Méthode non autorisée' });
    }

    try {
        // ✅ Vérification de la session utilisateur
        const user = await getConnecterUser(request);
        if (!user) return triggerNotConnected(response);

        // ✅ Récupération des données depuis le body
        const { toUserId, text } = request.body;

        // ✅ Vérifie les données
        if (!toUserId || !text) {
            return response.status(400).json({ error: "Données manquantes" });
        }

        const fromId = user.id;
        const minId = Math.min(fromId, toUserId);
        const maxId = Math.max(fromId, toUserId);
        const key = `messages:${minId}:${maxId}`;

        // ✅ Message stocké
        const message = {
            fromId,
            from: user.username,
            toId: toUserId,
            text,
            date: new Date().toISOString(),
        };

        // ✅ Enregistrer dans Redis
        await redis.lpush(key, JSON.stringify(message));
        await redis.expire(key, 60 * 60 * 24);

        return response.status(200).json({ ok: true, message });
    } catch (err) {
        console.error("Erreur dans /api/message.js :", err);
        return response.status(500).json({ error: "Erreur interne du serveur" });
    }
};
