import { addPalette, getPalette } from "../../lib/db/palette";
import { addTagsToPalette, linkPaletteTags } from "../../lib/db/tags";
import { v2 as cloudinary } from 'cloudinary';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { palette, imageURL, userId, tags, imageSourceURL, maskImageURL } = req.body;
        if (!palette) {
            return res.status(400).json({ error: 'palette is required' });
        }

        try {
            const paletteId = await addPalette({ palette, imageURL, userId, imageSourceURL, maskImageURL });
            if (tags) {
                const tags_ = await addTagsToPalette({ userId, tags });
                await linkPaletteTags({ paletteId, tags: tags_ });
            }

            console.log('upload palette success :>> ');
            res.status(200).json({ paletteId });

        } catch (error) {
            console.error('Upload palette error:', error);
            res.status(500).json({ error: 'Failed to upload palette to supabase' });
        }

    } else if (req.method === 'GET') {
        const { limit, userId, withTags, searchTerm, imageMaxWidth, imageMaxHeight } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'Not login' });
        }

        const options = {
            limit: limit ? parseInt(limit) : Infinity,
            userId,
            withTags: withTags === 'true',
            searchTags: searchTerm?.split(' ').map(tag => tag.trim()) ?? []
        };

        try {
            const data = await getPalette(options);
            // Request url at specific size and keep aspect ratio
            if (imageMaxWidth && imageMaxHeight) {

                data.forEach((data) => {
                    const { imageURL, maskImageURL } = data

                    if (imageURL && imageMaxWidth && imageMaxHeight) {
                        const parts = imageURL.split("/image/upload/")
                        const arg = `w_${imageMaxWidth},h_${imageMaxHeight},c_limit/`
                        const combinedURL = `${parts[0]}/image/upload/${arg}${parts[1]}`
                        data.imageURL = combinedURL
                    }

                    if (maskImageURL && imageMaxWidth && imageMaxHeight) {
                        const parts = maskImageURL.split("/image/upload/")
                        const arg = `w_${imageMaxWidth},h_${imageMaxHeight},c_limit/`
                        const combinedURL = `${parts[0]}/image/upload/${arg}${parts[1]}`
                        data.maskImageURL = combinedURL
                    }
                })
            }
            res.status(200).json(data);
        } catch (error) {
            console.error('Get palette error:', error);
            res.status(500).json({ error: 'Failed to get palette from supabase' });
        }

    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}