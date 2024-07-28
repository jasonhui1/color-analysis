export async function queryDatabase(query) {
    const { data, error } = await query;
    if (error) throw error;
    return data;
}
