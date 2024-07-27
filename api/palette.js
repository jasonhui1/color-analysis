export async function uploadPalette({ palette, userId, imageURL = null, tags = '' }) {

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