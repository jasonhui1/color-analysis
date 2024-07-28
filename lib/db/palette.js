import supabase from './setup';
import { queryDatabase } from './util';
const tableName = 'color_palette';


export async function getPalette(options = {}) {
    const { limit = Infinity, userId, withTags = false } = options;

    let query = supabase
        .from(tableName)
        .select(`
            *,
            palette_tags (
                tags (
                    id,
                    tag
                )
            )
        `)
        .order('timestamp', { ascending: false });

    if (userId) query = query.eq('userId', userId);
    if (Number.isFinite(limit)) query = query.limit(limit);

    const data = await queryDatabase(query);
    console.log('data :>> ', data);

    if (withTags) {
        return data.map(palette => ({
            ...palette,
            tags: palette.palette_tags.map(pt => pt.tags.tag)
        }));
    }

    return data.map(({ palette_tags, ...rest }) => rest);
}

// export async function getPalette(limit = Infinity) {
//     let query = supabase
//         .from(tableName)
//         .select('*')
//         .order('timestamp', { ascending: false });

//     if (Number.isFinite(limit)) query = query.limit(limit);
//     const data = await queryDatabase(query);

//     return data;
// }

export async function addPalette({ palette, userId, imageURL = null }) {
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
