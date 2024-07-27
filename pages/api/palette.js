import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY);
const tableName = 'color_palette';

async function queryDatabase(query) {
    const { data, error } = await query;
    if (error) throw error;
    return data;
}

async function getPalette(last = Infinity) {
    let query = supabase
        .from(tableName)
        .select('*')
        .order('timestamp', { ascending: false });

    if (Number.isFinite(last)) query = query.limit(last);
    const data = await queryDatabase(query);

    return data;
}

async function addPalette({ palette, userId, imageURL = null }) {
    const newEntry = {
        userId, palette: { palette }, imageURL
    };

    const { data, error } = await supabase
        .from(tableName)
        .insert([newEntry])
        .select();

    if (error) {
        console.error('Error inserting palette:', error);
        throw error;
    }

    console.log('added palette :>> ', data[0]);
    return data[0].id;
}

async function addTagsToPalette({ userId, tags }) {
    if (tags && tags.length > 0) {
        const uniqueTags = [...new Set(tags)]; // Remove duplicates
        console.log('uniqueTags :>> ', uniqueTags);

        // Upsert all tags at once
        const { data: tagData, error: tagError } = await supabase
            .from('tags')
            .upsert(
                uniqueTags.map(tag => ({ tag, userId })),
                { onConflict: ['tag', 'userId']}
            )
            .select();

        if (tagError) {
            console.error('Error upserting tags:', tagError);
        }

        return tagData;
    }

}

async function linkPaletteTags({ paletteId, tags }) {
    const paletteTagsToInsert = tags.map(tag => ({
        paletteId,
        tagId: tag.id
    }));

    const { error: linkError } = await supabase
        .from('palette_tags')
        .insert(paletteTagsToInsert);

    if (linkError) {
        console.error('Error linking tags to palette:', linkError);
    } else {
        console.log('link success :>> ');
    }
}


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