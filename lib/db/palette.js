import supabase from './setup';
import { queryDatabase } from './util';
const tableName = 'color_palette';

export async function getPalette(last = Infinity) {
    let query = supabase
        .from(tableName)
        .select('*')
        .order('timestamp', { ascending: false });

    if (Number.isFinite(last)) query = query.limit(last);
    const data = await queryDatabase(query);

    return data;
}

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
