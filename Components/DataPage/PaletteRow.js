import { useEffect, useState } from 'react'
import PaletteDisplay, { PaletteDisplaySimpleV2 } from '../../Components/Color/PaletteDisplay';
import { TriangularColorPickerDisplayColors } from '../../Components/Color/picker';
import HighlightHoveringColorCanvas from '../../Components/Canvas/FilterCanvas';
import { CanvasNoMask } from '../../Components/Canvas/Canvas';
import { sortPaletteAndPercentage } from '../../utils/color';
import { useInView } from 'react-intersection-observer';
import MaskedCanvas from '../../Components/Canvas/MaskedCanvas';
import { ImageTagsDisplay } from './ImageTagsDisplay';
import { loadCloudinaryImage, setImageURL } from '@/lib/cloudinary/utils';
import { MdOutlineZoomOutMap } from "react-icons/md";
import { deletePaletteClient } from '@/lib/clientApis/palette';
import CheckBox from '../General/CheckBox';
import useCanvas from '@/hooks/useCanvas';
import { useColorPaletteInteractivity } from '@/hooks/useColorPalette';
import Extras from './Extra';
import { loadImage } from '@/utils/image';

export const PaletteRow = ({ paletteData,
    onClickTag = null, setSelectedColor, onPaletteSelect = null, setEnlargeIndex = null,
    showTags = true, showPalette = true, showSelect = true,
    maxSize = 250,
}) => {

    const { palette, ignorePalette = [], tags, imageURL, maskImageURL } = paletteData
    // console.log(cloudinary.url(imageURL, { width: 100, height: 150, crop: "fill", fetch_format: "auto" }))
    // console.log('imageURL, maskImageURL :>> ', imageURL, maskImageURL);

    const [image, setImage] = useState(null);
    const [maskImage, setMaskImage] = useState(null);
    const [hoveringColor, setHoveringColor] = useState(null)

    const [isDeleted, setIsDeleted] = useState(false)

    const { ref, inView, entry } = useInView({
        /* Optional options */
        triggerOnce: true,
        rootMargin: '200px 0px',
    });

    useEffect(() => {
        if (!inView) return
        const loadImages = async () => {
            if (imageURL) setImage(await loadCloudinaryImage(imageURL, maxSize))
            if (maskImageURL) setMaskImage(await loadCloudinaryImage(maskImageURL, maxSize))
        };

        loadImages()
    }, [inView, imageURL]);



    const { ref: canvasRef } = useCanvas()
    const { ref: maskCanvasRef } = useCanvas()
    const { ref: canvasHLRef, reset: highlightReset, update: updateHighlightCanvas } = useCanvas()


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


                            <DataDisplay
                                hoveringColor={hoveringColor} setHoveringColor={setHoveringColor} setSelectedColor={setSelectedColor}
                                paletteData={paletteData}
                                onPaletteSelect={onPaletteSelect}
                                setIsDeleted={setIsDeleted}
                                showPalette={showPalette} showSelect={showSelect}
                                maxSize={maxSize}
                            />

                        </>)
                    }
                </div>
            }
        </>


    )
}


export default PaletteRow;

function DataDisplay({ hoveringColor, setHoveringColor, setSelectedColor,
    paletteData,
    onPaletteSelect,
    setIsDeleted,
    showPalette = true, showSelect = true,
    maxSize,
}) {

    const [selected, setSelected] = useState(false)
    const { id: paletteId, palette, percentage } = paletteData
    const { palette: sorted_palette, percentage: sorted_percentage } = sortPaletteAndPercentage(palette, percentage)

    const onSelect = () => {
        setSelected(!selected)
        onPaletteSelect(paletteId, !selected)
    }

    return (
        <>
            <TriangularColorPickerDisplayColors colors={palette} size={maxSize * 0.8} highlightColor={hoveringColor} />
            {showPalette &&
                <PaletteDisplay title={''}
                    colorPalette={sorted_palette} colorPalettePercentage={sorted_percentage}
                    setSelectedColor={setSelectedColor}
                    setHoveringColor={setHoveringColor}
                    enableAdd={false} enableDelete={false} enableEdit={false}
                />


            }

            {showSelect && <CheckBox checked={selected} onChange={onSelect} label='' />}
            <Extras paletteId={paletteId} onDelete={() => setIsDeleted(true)} />
        </>
    );
}
