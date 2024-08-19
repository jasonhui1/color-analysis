import { useEffect, useState } from 'react'
import { PaletteDisplaySimpleV2 } from '../../Components/Color/PaletteDisplay';
import { TriangularColorPickerDisplayColors } from '../../Components/Color/picker';
import HighlightHoveringColorCanvas from '../../Components/Canvas/FilterCanvas';
import { CanvasNoMask } from '../../Components/Canvas/Canvas';
import { sortPaletteAndPercentage } from '../../utils/color';
import { useInView } from 'react-intersection-observer';
import { createImageFromUrl } from '../../utils/canvas';
import MaskedCanvas from '../../Components/Canvas/MaskedCanvas';
import { ImageTagsDisplay } from './ImageTagsDisplay';
import { setImageURL } from '@/lib/cloudinary/utils';
import { MdOutlineZoomOutMap } from "react-icons/md";

export const PaletteRow = ({ canvasRef, canvasHLRef, maskCanvasRef,
    hoveringColor, paletteData,
    reset, enable,
    onClickTag, onPaletteColorHover, onPaletteColorUnHover, onPaletteColorClick,
    setEnlargeIndex }) => {

    const { palette, ignorePalette = [], tags, percentage, imageURL, maskImageURL, imageSourceURL } = paletteData
    // console.log(cloudinary.url(imageURL, { width: 100, height: 150, crop: "fill", fetch_format: "auto" }))
    // console.log('imageURL, maskImageURL :>> ', imageURL, maskImageURL);

    const [image, setImage] = useState(null);
    const [maskImage, setMaskImage] = useState(null);
    const maxSize = 250

    const { palette: sorted_palette, percentage: sorted_percentage } = sortPaletteAndPercentage(palette, percentage)
    const { ref, inView, entry } = useInView({
        /* Optional options */
        triggerOnce: true,
        rootMargin: '200px 0px',
    });

    useEffect(() => {
        if (inView) {
            const loadResizedImage = async (url, setF) => {
                const resized_url = setImageURL(url, maxSize, maxSize)
                const img = await createImageFromUrl(resized_url);
                setF(img);

            };
            if (imageURL) loadResizedImage(imageURL, setImage);
            if (maskImageURL) loadResizedImage(maskImageURL, setMaskImage);
        }
    }, [inView, imageURL]);




    return (
        <div ref={ref} className='flex gap-4 items-center ' style={{ minHeight: inView ? 'auto' : '100px' }}>
            {inView && (
                <>
                    <div className='flex flex-col gap-1 relative w-[250px] min-h-[100px] h-fit justify-center cursor-pointer ' onClick={setEnlargeIndex} >
                        <div className='relative self-center' style={{ width: image?.width ?? maxSize + 'px', height: image?.height ?? maxSize + 'px' }}>
                            {/* {imageURL && <Image ref={imageRef} src={imageURL} alt={imageURL} width={250} height={250} />} */}
                            <CanvasNoMask canvasRef={canvasRef} image={image} maxSize={maxSize} />
                            <MaskedCanvas canvasRef={maskCanvasRef} image={image} maskImage={maskImage} initialColor='rgb(0,0,0,0)' />
                            <HighlightHoveringColorCanvas canvasRef={canvasHLRef} imageCanvas={canvasRef?.current} maskCanvas={maskCanvasRef?.current} onlyInMask={true}
                                color={hoveringColor} colorPalette={palette} ignorePalette={ignorePalette}
                                reset={reset} enable={enable}
                            />

                        </div>
                        <ImageTagsDisplay tags={tags} onClickTag={onClickTag} />
                    </div>
                    {/* <MdOutlineZoomOutMap className='cursor-pointer' onClick={setEnlargeIndex} size={36}/> */}

                    <TriangularColorPickerDisplayColors colors={palette} size={maxSize * 0.8} highlightColor={hoveringColor} />
                    <PaletteDisplaySimpleV2 colorPalette={sorted_palette} showHeading={false} colorPalettePercentage={sorted_percentage}
                        onPaletteColorHover={onPaletteColorHover}
                        onPaletteColorUnHover={onPaletteColorUnHover}
                        onPaletteColorClick={onPaletteColorClick}
                    />

                </>)
            }
        </div>

    )
}

export default PaletteRow;