import { useState } from "react";

import { uploadImageClient } from "../../lib/clientApis/image";
import { uploadPaletteClient } from "../../lib/clientApis/palette";
import { getUserId } from "../../lib/clientApis/supabaseClient";
import { invertImageAlpha, processCanvas, } from "../../utils/canvas";

export function UploadButton({ colorPalette, canvas, image, tags, percentage, ignorePalette, imageSourceURL, maskCanvas, invertMask = false }) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (event) => {
        setIsUploading(true);
        const processedImageURL = processCanvas({ canvas, image, useCurrentCanvas: false, cropTransparent: false });

        let maskCanvas_ = maskCanvas;
        if (invertMask) maskCanvas_ = await invertImageAlpha(maskCanvas, true);
        const processedMaskedImageURL = processCanvas({ canvas: maskCanvas_, image, useCurrentCanvas: true, cropTransparent: false });

        //TODO: Wrap this in context  when refactor
        const id = await getUserId()

        try {
            const uploadedImageURL = await uploadImageClient(processedImageURL);
            const uploadedMaskedImageURL = await uploadImageClient(processedMaskedImageURL);
            await uploadPaletteClient({ palette: { palette: colorPalette, percentage, ignorePalette }, userId: id, imageURL: uploadedImageURL, tags, imageSourceURL, maskImageURL: uploadedMaskedImageURL });
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
