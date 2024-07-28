import { getTags } from "../../lib/db/tags";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const data = await getTags();
        res.status(200).json({ data });

    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}