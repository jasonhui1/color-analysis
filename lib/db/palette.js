import supabase from './setup';
import { queryDatabase } from './util';
const tableName = 'color_palette';


export async function getPalette(options = {}) {
    const { id = null, limit = Infinity, userId, withTags = false, searchTags = [] } = options;

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
    if (id) query.eq('id', id);
    if (Number.isFinite(limit)) query = query.limit(limit);

    let data = await queryDatabase(query);

    // DB palette = [json]
    data = data.map(props => ({
        ...props,
        palette: props.palette.palette,
        percentage: props.palette?.percentage ?? [],
        ignorePalette: props.palette?.ignorePalette ?? [],
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

export async function addPalette({ palette, userId, imageURL = null, imageSourceURL = '', maskImageURL }) {
    const newEntry = {
        userId, palette, imageURL, imageSourceURL, maskImageURL
    };

    const query = supabase
        .from(tableName)
        .insert([newEntry])
        .select();

    let data = await queryDatabase(query);

    console.log('added palette :>> ', data[0]);
    return data[0].id;
}

export async function deletePalette({ paletteId, userId }) {
    if (!paletteId) throw new Error('paletteId is required');
    if (!userId) throw new Error('userId is required');

    const query = supabase
        .from(tableName)
        .delete()
        .eq('id', paletteId)
        .eq('userId', userId)
        .select();

    let data = await queryDatabase(query);

    return data[0];
}


export async function updatePalette({ paletteId, palette, userId, imageURL = null, imageSourceURL = '', maskImageURL }) {
    if (!paletteId) throw new Error('paletteId is required');
    if (!userId) throw new Error('userId is required');

    const updatedEntry = {
        palette,
        imageURL,
        imageSourceURL,
        maskImageURL
    };

    const query = supabase
        .from(tableName)
        .update(updatedEntry)
        .eq('id', paletteId)
        .eq('userId', userId)
        .select();

    let data = await queryDatabase(query);

    console.log('updated palette :>> ', data[0]);
    return data[0];
}