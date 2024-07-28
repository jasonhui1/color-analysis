import { uploadImage } from "../../lib/cloudinary/image";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '5mb' // Set desired value here
        }
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { imageURL } = req.body;

    if (!imageURL) {
        return res.status(400).json({ error: 'Image data is required' });
    }

    try {
        const result = await uploadImage(imageURL);

        res.status(200).json({ secure_url: result.secure_url });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
    }
}