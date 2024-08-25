import { getUserId } from "./supabaseClient";

export async function uploadPaletteClient({ palette, imageURL = null, tags = [], imageSourceURL = '', maskImageURL }) {
    const userId = await getUserId();
    if (!userId) return new Error('not login')

    const response = await fetch('/api/palette', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ palette, userId, imageURL, tags: tags, imageSourceURL, maskImageURL }),
    });

    if (!response.ok) {
        throw new Error('Upload palette failed');
    }

    const data = await response.json();
    return data
}


export async function getPaletteClient({ withTags = false, searchTags = [], limit = Infinity, paletteId = null }) {
    const userId = await getUserId();
    if (!userId) throw new Error('not login')
        
    const options = {
        userId,
        withTags,
        limit,
        ...(searchTags.length > 0 && { searchTags: searchTags.join(','), }),
        ...(paletteId && { paletteId }),
    };

    const queryParams = new URLSearchParams(options).toString();
    const url = `/api/palette?${queryParams}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch palettes:', error);
    }
}

export async function deletePaletteClient({ paletteId }) {
    const userId = await getUserId();
    if (!userId) return new Error('not login')

    const response = await fetch('/api/palette', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paletteId, userId }),
    });

    if (!response.ok) {
        throw new Error('Delete palette failed');
    }

    const data = await response.json();
    return data
}

export async function updatePaletteClient({ paletteId, palette, imageURL = null, tags = [], imageSourceURL = '', maskImageURL }) {
    const userId = await getUserId();
    if (!userId) return new Error('not login')

    const response = await fetch('/api/palette', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paletteId, palette, userId, imageURL, tags: tags, imageSourceURL, maskImageURL }),
    });

    if (!response.ok) {
        throw new Error('Update palette failed');
    }

    const data = await response.json();
    return data
}
