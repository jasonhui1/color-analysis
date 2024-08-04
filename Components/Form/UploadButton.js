import { useState } from "react";
import { removedTransparentPixelsURL } from "../Canvas/Canvas";

import { uploadImageClient } from "../../api/image";
import { uploadPaletteClient } from "../../api/palette";
import { getUserId } from "../../api/supabaseClient";

export function UploadButton({ colorPalette, canvasRef, image, tags, percentage, ignorePalette, imageSourceURL }) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (event) => {
        setIsUploading(true);
        const croppedImageURL = removedTransparentPixelsURL(canvasRef.current, image);

        //TODO: Wrap this in context  when refactor
        const id = await getUserId()

        try {
            const uploadedImageURL = await uploadImageClient(croppedImageURL);
            await uploadPaletteClient({ palette: { palette: colorPalette, percentage, ignorePalette }, userId: id, imageURL: uploadedImageURL, tags, imageSourceURL });
            console.log('upload success :>> ');

        } catch (err) {
            console.error('Error:', err);
            // setError('Failed to upload image. Please try again.');
            console.log('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };
    return (
        <button onClick={handleUpload}
            // disabled={isUploading} 
            className="w-fit bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            {isUploading ? 'Uploading...' : 'Upload '}
        </button>
    );
}
