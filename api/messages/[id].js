import { getConnecterUser, triggerNotConnected } from "../../lib/session.js";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Méthode non autorisée" });
    }

    try {
        // ✅ Vérifie l'utilisateur connecté
        const user = await getConnecterUser(req);
        if (!user) return triggerNotConnected(res);

        const { id } = req.query;
        const fromId = user.id;
        const toId = parseInt(id, 10);

        if (isNaN(toId)) {
            return res.status(400).json({ error: "ID utilisateur invalide" });
        }

        // ✅ Génère la clé Redis identique à /api/message.js
        const minId = Math.min(fromId, toId);
        const maxId = Math.max(fromId, toId);
        const key = `messages:${minId}:${maxId}`;

        console.log("🔑 Lecture des messages avec clé :", key);

        // ✅ Essaye d’obtenir les messages depuis Redis
        const messages = await redis.lrange(key, 0, -1);

        if (!messages || messages.length === 0) {
            console.log("📭 Aucun message trouvé pour la clé :", key);
            return res.status(200).json([]); // aucune erreur si vide
        }

        console.log("Messages : ", messages);
        //const parsedMessages = messages.map(m => JSON.parse(m)).reverse();

        return res.status(200).json(messages);
    } catch (err) {
        console.error("❌ Erreur dans /api/messages/[id].js :", err);
        return res.status(500).json({ error: "Erreur interne du serveur", details: err.message });
    }
}
