import { useEffect, useState } from "react";

import { uploadImageClient } from "../../lib/clientApis/image";
import { updatePaletteClient, uploadPaletteClient } from "../../lib/clientApis/palette";
import { invertImageAlpha, processCanvas, } from "../../utils/canvas";
import { useImageContext } from "@/context/image";
import { useMainCanvasContext } from "@/context/mainCanvas";
import { useColorContext } from "@/context/color";
import supabaseClient from "../../lib/clientApis/supabaseClient";

export function UploadButton({ tags, percentage, imageSourceURL, invertMask = false, paletteId = null }) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const { image, maskImage } = useImageContext();
    const { canvasRef, maskCanvasRef } = useMainCanvasContext();
    let [canvas, maskCanvas] = [canvasRef.current, maskCanvasRef.current];
    const { colorPalette, ignorePalette } = useColorContext();

    const isEditing = paletteId !== null;

    // Check auth session
    useEffect(() => {
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setAuthLoading(false);
        });

        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
                setAuthLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Reset success state when fields are changed
    useEffect(() => {
        setUploadSuccess(false);
    }, [colorPalette, image, tags, percentage, ignorePalette, imageSourceURL, maskCanvas]);


    // Main function
    const handleUpload = async () => {
        if (!user) {
            setError('Please sign in to save your palette.');
            return;
        }
        if (!image) {
            setError('No image selected');
            return;
        }
        if (!colorPalette || colorPalette.length === 0) {
            setError('No colors in palette');
            return;
        }

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
            console.log('Failed to save palette. Please try again.');
            console.error('Error:', err);
            setError(err?.message || 'An error occurred while saving.');
        } finally {
            setIsUploading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex flex-col">
                <button disabled className="w-fit bg-slate-200 text-slate-400 font-semibold py-2 px-5 rounded-lg cursor-not-allowed">
                    Checking authentication...
                </button>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg max-w-md">
                <p className="text-sm text-amber-800 font-medium">
                    ⚠️ You must be signed in to save palettes and view history.
                </p>
                <button disabled className="w-fit bg-slate-300 text-slate-500 font-bold py-2 px-4 rounded-lg cursor-not-allowed">
                    Save Palette
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <button onClick={handleUpload}
                disabled={isUploading}
                className="w-fit bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm transition-colors duration-150 disabled:opacity-60">
                {isUploading ? (isEditing ? 'Saving...' : 'Saving...') : (isEditing ? 'Save Changes' : 'Save Palette')}
            </button>
            {uploadSuccess && (
                <p className="mt-2 text-green-600 font-semibold">
                    {isEditing ? 'Changes saved successfully!' : 'Palette saved successfully!'}
                </p>
            )}
            {error && <p className="mt-2 text-red-600 font-semibold">{error}</p>}
        </div>
    );
}
