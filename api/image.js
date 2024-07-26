export async function uploadImage(imageURL) {
    let response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageURL }),
    });

    if (!response.ok) {
        throw new Error('Upload image failed');
    }

    let data = await response.json();
    return data.secure_url
}