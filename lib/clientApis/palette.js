export async function uploadPaletteClient({ palette, userId, imageURL = null, tags = '', imageSourceURL = '', maskImageURL }) {

    const tagsArray = tags !== '' ? tags.split(' ').map(tag => tag.trim()) : []
    const response = await fetch('/api/palette', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ palette, userId, imageURL, tags: tagsArray, imageSourceURL, maskImageURL }),
    });

    if (!response.ok) {
        throw new Error('Upload palette failed');
    }

    const data = await response.json();
    return data
}


export async function getPaletteClient({ userId, withTags = false, searchTerm = '', limit = Infinity, imageMaxWidth = null, imageMaxHeight = null }) {
    const options = {
        userId,
        withTags,
        limit,
        ...(searchTerm.trim() && { searchTerm: searchTerm.trim() }),
        ...(imageMaxWidth && { imageMaxWidth }),
        ...(imageMaxHeight && { imageMaxHeight })
    };

    const queryParams = new URLSearchParams(options).toString();
    console.log('queryParams :>> ', imageMaxWidth);

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

