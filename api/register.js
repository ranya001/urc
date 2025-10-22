import { sql } from '@vercel/postgres';
import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    const exists = await sql`
    SELECT * FROM users WHERE username = ${username} OR email = ${email}
  `;
    if (exists.rowCount > 0) {
        return res.status(409).json({ error: 'Username ou email déjà utilisé' });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const external_id = crypto.randomUUID();
    const created_on = new Date().toISOString();

    await sql`
    INSERT INTO users (username, email, password, external_id, created_on)
    VALUES (${username}, ${email}, ${hashedPassword}, ${external_id}, ${created_on})
  `;

    return res.status(201).json({ message: 'Utilisateur créé', username, external_id });
}
