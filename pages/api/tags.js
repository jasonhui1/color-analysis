import { getTags } from "../../lib/db/tags";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { userId } = req.query;

        if (!userId || userId === 'undefined') {
            return res.status(200).json([]);
        }

        const data = await getTags({userId});
        res.status(200).json(data ?? []);

    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}