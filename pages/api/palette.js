import { addPalette, getPalette } from "../../lib/db/palette";
import { addTagsToPalette, linkPaletteTags } from "../../lib/db/tags";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { palette, imageURL, userId, tags } = req.body;
        if (!palette) {
            return res.status(400).json({ error: 'palette is required' });
        }

        try {
            const paletteId = await addPalette({ palette, imageURL, userId });
            const tags_ = await addTagsToPalette({ userId, tags });
            await linkPaletteTags({ paletteId, tags: tags_ });

            console.log('upload palette success :>> ');
            res.status(200).json({ paletteId });

        } catch (error) {
            console.error('Upload palette error:', error);
            res.status(500).json({ error: 'Failed to upload palette to supabase' });
        }

    } else if (req.method === 'GET') {

        const data = await getPalette();
        res.status(200).json({ data });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}