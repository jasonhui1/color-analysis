import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { imageDataUrl } = req.body;

    if (!imageDataUrl) {
        return res.status(400).json({ error: 'Image data is required' });
    }

    try {
        const result = await cloudinary.uploader.upload(imageDataUrl);

        // const result = await cloudinary.uploader.upload(imageDataUrl, {
        //     transformation: [
        //         { background: "auto:predominant", crop: "trim" },
        //     ]
        // });

        res.status(200).json({ secure_url: result.secure_url });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
    }
}