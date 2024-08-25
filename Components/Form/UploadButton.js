import { useEffect, useState } from "react";

import { uploadImageClient } from "../../lib/clientApis/image";
import { updatePaletteClient, uploadPaletteClient } from "../../lib/clientApis/palette";
import { invertImageAlpha, processCanvas, } from "../../utils/canvas";

export function UploadButton({ colorPalette, canvas, image, tags, percentage, ignorePalette, imageSourceURL, maskCanvas, invertMask = false, isEditing = false, paletteId = null }) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setUploadSuccess(false);
    }, [colorPalette, image, tags, percentage, ignorePalette, imageSourceURL, maskCanvas]);

    const handleUpload = async (event) => {
        if (!image) throw Error('No image uploaded');
        if (!colorPalette) throw Error('No colorPalette uploaded');

        setIsUploading(true);
        setUploadSuccess(false);
        setError(null);

        const processedImageURL = processCanvas({ canvas, image, useCurrentCanvas: false, cropTransparent: false });

        if (invertMask) maskCanvas = await invertImageAlpha(maskCanvas, true);
        const processedMaskedImageURL = processCanvas({ canvas: maskCanvas, image, useCurrentCanvas: true, cropTransparent: false });

        try {
            const uploadedImageURL = await uploadImageClient(processedImageURL);
            const uploadedMaskedImageURL = await uploadImageClient(processedMaskedImageURL);
            if (!isEditing) {
                await uploadPaletteClient({ palette: { palette: colorPalette, percentage, ignorePalette }, imageURL: uploadedImageURL, tags, imageSourceURL, maskImageURL: uploadedMaskedImageURL });
            } else {
                if (!paletteId) throw Error('No paletteId');
                await updatePaletteClient({ paletteId, palette: { palette: colorPalette, percentage, ignorePalette }, imageURL: uploadedImageURL, tags, imageSourceURL, maskImageURL: uploadedMaskedImageURL });
            }
            setUploadSuccess(true);
        } catch (err) {
            console.log('Failed to upload image. Please try again.');
            console.error('Error:', err);
            setError(err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col">
            <button onClick={handleUpload}
                // disabled={isUploading} 
                className="w-fit bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                {isUploading ? isEditing ? 'Editing...' : 'Uploading...' : isEditing ? 'Edit ' : 'Upload '}

            </button>
            {uploadSuccess && (
                <p className="mt-2 text-green-600 font-semibold">{isEditing ? 'Edit' : 'Upload'} successful!</p>
            )}
            {error && <p className="mt-2 text-red-600 font-semibold">{error}</p>}
        </div>
    );
}
