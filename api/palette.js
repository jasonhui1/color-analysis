export async function uploadPaletteClient({ palette, userId, imageURL = null, tags = '' }) {

    const tagsArray = tags.split(' ').map(tag => tag.trim());
    const response = await fetch('/api/palette', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ palette, userId, imageURL, tags: tagsArray }),
    });

    if (!response.ok) {
        throw new Error('Upload palette failed');
    }

    const data = await response.json();
    return data
}


export async function getPaletteClient({ userId, withTags = false, searchTerm = '', limit = 50, }) {

    const options = { userId, limit, withTags }
    if (searchTerm !== '') options.searchTerm = searchTerm

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

