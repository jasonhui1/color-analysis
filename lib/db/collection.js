import supabase from './setup';
import { queryDatabase } from './util';
const tableName = 'collection';

export async function getCollection({ id = null, userId, limit = Infinity}) {
    if (!userId) throw new Error('userId is required');

    let query = supabase
        .from(tableName)
        .select('*')
        .eq('userId', userId)
        .order('timestamp', { ascending: false });

    if (id) query.eq('id', id).single();;
    if (Number.isFinite(limit)) query = query.limit(limit);

    let data = await queryDatabase(query);
    return data
}

export async function addCollection({ userId, name }) {
    if (!userId) throw new Error('userId is required');
    const newEntry = { userId, name };

    const query = supabase
        .from(tableName)
        .insert([newEntry])
        .select();

    let data = await queryDatabase(query);

    console.log('added collection :>> ', data[0]);
    return data[0].id;
}

export async function addPaletteToCollection({ userId, collectionId, paletteId }) {
    if (!userId) throw new Error('userId is required');
    if (!collectionId) throw new Error('collectionId is required');
    if (!paletteId) throw new Error('paletteId is required');

    let collection = await getCollection({ id: collectionId, userId });
    if (!collection) {
        throw new Error(`Collection with id ${collectionId} not found`);
    }

    // Push to existing array
    const updatedPaletteIds = [...(collection.paletteIds || []), paletteId];

    const query = supabase
        .from(tableName)
        .update({ paletteIds: updatedPaletteIds })
        .eq('id', collectionId)
        .eq('userId', userId)
        .single();

    let data = await queryDatabase(query);
    console.log('added palette to collection :>> ', data);
    return data.id;
}

export async function removePaletteFromCollection({ userId, collectionId, paletteId }) {
    if (!userId) throw new Error('userId is required');
    if (!collectionId) throw new Error('collectionId is required');
    if (!paletteId) throw new Error('paletteId is required');

    // await supabase
        // .from(tableName)
        // .update({
        //     paletteIds: supabase.raw('array_remove(paletteIds, ?)', paletteId)
        // })
        // .eq('id', collectionId)
        // .eq('userId', userId)
        // .single();

    // Fetch the existing collection
    let collection = await getCollection({ userId, id: collectionId });

    // Check if the collection exists
    if (!collection) {
        throw new Error(`Collection with id ${collectionId} not found for user ${userId}`);
    }

    // Remove the paletteId from the existing paletteIds array
    const updatedPaletteIds = (collection.paletteIds || []).filter((id) => id !== paletteId);
    const query = supabase
        .from(tableName)
        .update({ paletteIds: updatedPaletteIds })
        .eq('id', collectionId)
        .eq('userId', userId)
        .single();

    let data = await queryDatabase(query);
    console.log('removed palette from collection :>> ', data);
    return data.id;
}