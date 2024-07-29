import supabase from './setup';
import { queryDatabase } from './util';
const tableName = 'color_palette';


export async function getPalette(options = {}) {
    const { limit = Infinity, userId, withTags = false, searchTags = [] } = options;

    if (!userId) throw new Error('userId is required');
    const ignoreEmpty = searchTags.length > 0 ? true : false;

    let query = supabase
        .from(tableName)
        .select(`
            *,
            palette_tags  ${ignoreEmpty ? '!inner' : ''}(
                tags ${ignoreEmpty ? '!inner' : ''}(
                    id,
                    tag
                )
            )
        `)
        .eq('userId', userId)
        .order('timestamp', { ascending: false });

    // Also remove all other tags...
    // if (searchTags.length > 0) {
    //     query = query.in('palette_tags.tags.tag', searchTags);
    // }
    if (Number.isFinite(limit)) query = query.limit(limit);

    let data = await queryDatabase(query);

    // DB palette = [json]
    data = data.map(props => ({
        ...props,
        palette: props.palette.palette
    }));

    if (!withTags) return data.map(({ palette_tags, ...rest }) => rest);

    // Form tag array
    data = data.map(palette => ({
        ...palette,
        tags: palette.palette_tags.map(pt => pt.tags.tag)
    }));

    // Filter tags
    if (searchTags.length > 0) {
        data = data.filter(palette => searchTags.every(searchTag => palette.tags.includes(searchTag)))
    }

    return data

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
