import React, { useState, useRef, useEffect } from "react";

import { useSearchParams } from 'next/navigation'
import GoogleLogin from "../../Components/Auth/GoogleLogin";

import { Form } from "../../Components/Form/Form";
import { ColorPicker } from "@/Components/Color/picker";

import ImageEditor from "@/Components/ImageEditor";
import Link from "@/node_modules/next/link";
import { useFetchPalettesData } from "@/hooks/useFetchPalettesData";
import { loadImage } from "@/utils/image";
import { ColorProvider, useColorContext } from "@/context/color";
import { useImageContext } from "@/context/image";


const ColorAnalysis = () => {
    const { setImage, setMaskImage } = useImageContext();
    const [imageSourceURL, setImageSourceURL] = useState('');

    const [selectedColor, setSelectedColor] = useState([0, 0, 0]);

    const [invertMask, setInvertMask] = useState(false);
    const [onlyHighlightMask, setOnlyHighlightMask] = useState(true);

    //Resets, use canvas hook
    const [formResetToggle, setFormResetToggle] = useState(false);

    const searchParams = useSearchParams()
    const paletteId = searchParams.get('paletteId')
    const { data: paletteData, loading, error } = useFetchPalettesData({ paletteId, performSearch: paletteId !== null })

    const resetForm = (img, file, url) => {
        setFormResetToggle(state => !state);
        setImageSourceURL(url || '');
    }

    useEffect(() => {
        const loadData = async () => {
            if (paletteData) {
                setImage(await loadImage(paletteData.imageURL));
                if (paletteData.maskImageURL) setMaskImage(await loadImage(paletteData.maskImageURL));
            }
        }
        loadData()
    }, [paletteData]);

    return (
        <div className="p-4 ">

            <Header />

            <ColorProvider>
                {/* {image && ( */}
                <div className="flex flex-row gap-6 relative mb-3 " >
                    <ImageEditor
                        onImageSelected={resetForm}
                        invertMask={invertMask} setInvertMask={setInvertMask}
                        setSelectedColor={setSelectedColor}
                        onlyHighlightMask={onlyHighlightMask}
                    />

                    <ColorPicker selectedColor={{ r: selectedColor[0], g: selectedColor[1], b: selectedColor[2] }} isRGBSpace={true} />

                    {/* Use Context */}
                    <Form paletteData={paletteData}
                        imageSourceURL={imageSourceURL} setImageSourceURL={setImageSourceURL}
                        selectedColor={selectedColor} setSelectedColor={setSelectedColor}
                        invertMask={invertMask}
                        onlyHighlightMask={onlyHighlightMask} setOnlyHighlightMask={setOnlyHighlightMask}
                        formReset={formResetToggle}
                    />
                </div>
            </ColorProvider>


        </div>
    );
};
export default ColorAnalysis;



function Header() {
    return (
        <div className="flex justify-between mb-2">
            <h1 className="text-2xl font-bold mb-4">
                Color Analysis
            </h1>
            <div className="flex gap-2 items-center">

                <Link href="/data" className="text-blue-500 hover:text-blue-700 bg-gray-200 px-2 py-1 rounded-md">View Data</Link>
                <GoogleLogin />
            </div>
        </div>
    );
}
