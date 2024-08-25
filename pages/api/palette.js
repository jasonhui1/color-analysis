import { deleteImage } from "@/lib/cloudinary/image";
import { addPalette, deletePalette, getPalette, updatePalette } from "../../lib/db/palette";
import { addTagsToPalette, linkPaletteTags } from "../../lib/db/tags";

async function addPaletteData({ id = null, palette, imageURL, userId, imageSourceURL, maskImageURL, tags }) {
    const paletteId = await addPalette({ id, palette, imageURL, userId, imageSourceURL, maskImageURL });
    if (tags) {
        const tags_ = await addTagsToPalette({ userId, tags });
        await linkPaletteTags({ paletteId, tags: tags_ });
    }

    console.log('upload palette success :>> ');
    return paletteId
}

async function POSTHandler(req, res) {
    const { palette, imageURL, userId, tags, imageSourceURL, maskImageURL } = req.body;
    if (!palette) {
        return res.status(400).json({ error: 'palette is required' });
    }

    try {
        const paletteId = await addPaletteData({ palette, imageURL, userId, imageSourceURL, maskImageURL, tags });
        res.status(200).json({ paletteId });

    } catch (error) {
        console.error('Upload palette error:', error);
        res.status(500).json({ error: 'Failed to upload palette to supabase' });
    }
}

async function GETHandler(req, res) {
    const { limit, userId, withTags, searchTags, paletteId = null } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'Not login' });
    }

    const options = {
        id: paletteId,
        limit: limit ? parseInt(limit) : Infinity,
        userId,
        withTags: withTags === 'true',
        searchTags: searchTags?.split(',').map(tag => tag.trim()) ?? [],
    };

    try {
        const data = await getPalette(options);
        res.status(200).json(data);
    } catch (error) {
        console.error('Get palette error:', error);
        res.status(500).json({ error: 'Failed to get palette from supabase' });
    }

}

async function UPDATEHandler(req, res) {
    const { paletteId, palette, imageURL, userId, tags, imageSourceURL, maskImageURL } = req.body;

    if (!userId) return res.status(400).json({ error: 'Not login' });
    if (!paletteId) return res.status(400).json({ error: 'paletteId is required' });
    if (!palette) return res.status(400).json({ error: 'palette is required' });

    try {
        // const res_ = await updatePalette({ paletteId, palette, imageURL, userId, imageSourceURL, maskImageURL });

        // //TODO: remove removed tags, remove all tags link to palette first?
        // if (tags) {
        //     const tags_ = await addTagsToPalette({ userId, tags });
        //     await linkPaletteTags({ paletteId, tags: tags_ });
        // }

        await deletePalette({ userId, paletteId });
        const newPaletteId = await addPaletteData({ id: paletteId, palette, imageURL, userId, imageSourceURL, maskImageURL, tags });

        console.log('upload palette success :>> ');
        res.status(200).json({ newPaletteId });

    } catch (error) {
        console.error('Upload palette error:', error);
        res.status(500).json({ error: 'Failed to upload palette to supabase' });
    }
}

async function DELETEHandler(req, res) {
    const { userId, paletteId } = req.body;


    if (!userId) return res.status(400).json({ error: 'Not login' });
    if (!paletteId) return res.status(400).json({ error: 'paletteId is required' });

    try {
        const paletteData = await getPalette({ userId, id: paletteId });
        // DELETE link from cloundinary
        await deleteImage(paletteData.imageURL);
        await deleteImage(paletteData.maskImageURL);
        const data = await deletePalette({ userId, paletteId });
        res.status(200).json(data);

    } catch (error) {
        console.error('Delete palette error:', error);
        res.status(500).json({ error: 'Failed to delete palette from supabase' });
    }
}


export default async function handler(req, res) {
    if (req.method === 'POST') {
        POSTHandler(req, res);
    } else if (req.method === 'GET') {
        GETHandler(req, res);

    } else if (req.method === 'PUT') {
        UPDATEHandler(req, res);

    } else if (req.method === 'DELETE') {
        DELETEHandler(req, res);

    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}