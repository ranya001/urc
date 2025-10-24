import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function getConnecterUser(request) {
    let authHeader;

    // Si request.headers est un objet Headers (fetch API)
    if (typeof request.headers.get === 'function') {
        authHeader = request.headers.get('Authorization');
    } else {
        // Sinon, headers classique Node.js
        authHeader = request.headers['authorization'] || request.headers['Authorization'];
    }

    if (!authHeader) return null;

    const token = authHeader.replace("Bearer ", "");
    console.log("Checking token:", token);

    const user = await redis.get(token);
    if (user) console.log("User trouvé:", user.username);

    return user || null;
}

export async function checkSession(request) {
    const user = await getConnecterUser(request);
    return (user !== undefined && user !== null && user);
}

export function unauthorizedResponse() {
    const error = { code: "UNAUTHORIZED", message: "Session expired" };
    return new Response(JSON.stringify(error), {
        status: 401,
        headers: { 'content-type': 'application/json' },
    });
}

export function triggerNotConnected(res) {
    res.status(401).json({ code: "UNAUTHORIZED", message: "Session expired" });
}
