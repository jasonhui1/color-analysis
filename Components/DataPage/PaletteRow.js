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
import { deletePaletteClient } from '@/lib/clientApis/palette';
import CheckBox from '../General/CheckBox';
import useCanvas from '@/hooks/useCanvas';
import { useColorPaletteInteractivity } from '@/hooks/useColorPalette';
import Extras from './Extra';

export const PaletteRow = ({ paletteData,


    showTags = true, showPalette = true, showSelect = true,
    onClickTag = null, onPaletteColorClick = null, onPaletteSelect = null, setEnlargeIndex = null, maxSize = 250
}) => {

    const { id: paletteId, palette, ignorePalette = [], tags, percentage, imageURL, maskImageURL, imageSourceURL } = paletteData
    // console.log(cloudinary.url(imageURL, { width: 100, height: 150, crop: "fill", fetch_format: "auto" }))
    // console.log('imageURL, maskImageURL :>> ', imageURL, maskImageURL);

    const [image, setImage] = useState(null);
    const [maskImage, setMaskImage] = useState(null);
    const [selected, setSelected] = useState(false)
    const [hoveringColor, setHoveringColor] = useState(null)

    const [isDeleted, setIsDeleted] = useState(false)

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

    const onSelect = () => {
        setSelected(!selected)
        onPaletteSelect(paletteId, !selected)
    }

    const { ref: canvasRef } = useCanvas()
    const { ref: maskCanvasRef } = useCanvas()
    const { ref: canvasHLRef, reset: highlightReset, update: updateHighlightCanvas } = useCanvas()

    const { onPaletteColorHover, onPaletteColorUnHover } = useColorPaletteInteractivity({ setHoveringColor })

    return (
        <>
            {!isDeleted &&
                <div ref={ref} className='flex gap-4 items-center ' style={{ minHeight: inView ? 'auto' : '100px' }}>
                    {inView && (
                        <>
                            <div className='flex flex-col gap-1 relative  h-fit justify-center cursor-pointer ' style={{ width: maxSize + 'px', minHeight: maxSize + 'px' }} >
                                <div className='relative self-center' style={{ width: image?.width ?? maxSize + 'px', height: image?.height ?? maxSize + 'px' }} onClick={setEnlargeIndex && setEnlargeIndex} >
                                    {/* {imageURL && <Image ref={imageRef} src={imageURL} alt={imageURL} width={250} height={250} />} */}
                                    <CanvasNoMask canvasRef={canvasRef} image={image} maxSize={maxSize} />
                                    <MaskedCanvas canvasRef={maskCanvasRef} image={image} maskImage={maskImage} initialColor='rgb(0,0,0,0)' />
                                    <HighlightHoveringColorCanvas canvasRef={canvasHLRef} imageCanvas={canvasRef?.current} maskCanvas={maskCanvasRef?.current} onlyInMask={true}
                                        color={hoveringColor} colorPalette={palette} ignorePalette={ignorePalette}
                                        reset={highlightReset}
                                    />

                                </div>
                                {showTags && <ImageTagsDisplay tags={tags} onClickTag={onClickTag} />}
                            </div>
                            {/* <MdOutlineZoomOutMap className='cursor-pointer' onClick={setEnlargeIndex} size={36}/> */}

                            <TriangularColorPickerDisplayColors colors={palette} size={maxSize * 0.8} highlightColor={hoveringColor} />
                            {showPalette && <PaletteDisplaySimpleV2 colorPalette={sorted_palette} showHeading={false} colorPalettePercentage={sorted_percentage}
                                onPaletteColorHover={onPaletteColorHover}
                                onPaletteColorUnHover={onPaletteColorUnHover}
                                onPaletteColorClick={onPaletteColorClick}
                            />}

                            {/* Need more safety steps before deploy */}
                            {showSelect && <CheckBox checked={selected} onChange={onSelect} label='' />}
                            <Extras paletteId={paletteId} onDelete={() => setIsDeleted(true)} />
                        </>)
                    }
                </div>
            }
        </>


    )
}

export default PaletteRow;