import supabase from "./setup";
import { queryDatabase } from "./util";

const tableName = 'tags';

export async function getTags({ userId }) {
    if (!userId) return

    let query = supabase
        .from(tableName)
        .select('*')
        .eq('userId', userId)

    return await queryDatabase(query);
}

export async function addTagsToPalette({ userId, tags }) {
    if (!(tags && tags.length > 0)) return

    const uniqueTags = [...new Set(tags)]; // Remove duplicates

    // Upsert all tags at once
    const { data: tagData, error: tagError } = await supabase
        .from('tags')
        .upsert(
            uniqueTags.map(tag => ({ tag, userId })),
            { onConflict: ['tag', 'userId'] }
        )
        .select();

    if (tagError) {
        console.error('Error upserting tags:', tagError);
    }

    return tagData;
}


export async function linkPaletteTags({ paletteId, tags = [] }) {
    if (tags.length === 0) return;
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

