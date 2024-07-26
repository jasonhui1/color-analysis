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
        throw error;
    }

    console.log('added palette :>> ', data[0]);
    return data[0].id;
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { palette, imageURL, userId } = req.body;
        if (!palette) {
            return res.status(400).json({ error: 'palette is required' });
        }

        try {
            const id = addPalette({ palette, imageURL, userId });
            console.log('upload palette success :>> ');
            res.status(200).json({ id });

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