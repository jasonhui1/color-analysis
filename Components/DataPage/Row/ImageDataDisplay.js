import { CanvasNoMask } from "@/Components/Canvas/Canvas";
import HighlightHoveringColorCanvas from "@/Components/Canvas/FilterCanvas";
import MaskedCanvas from "@/Components/Canvas/MaskedCanvas";
import useCanvas from "@/hooks/useCanvas";
import { ImageTagsDisplay } from "../ImageTagsDisplay";
import { useImageContext } from "@/context/image";
import { useColorContext } from "@/context/color";

export default function ImageDataDisplay({
    paletteData,
    setEnlargeIndex,
    onClickTag,
    showTags,
    maxSize,
}) {
    const { ref: canvasRef } = useCanvas()
    const { ref: maskCanvasRef } = useCanvas()
    const { ref: canvasHLRef, reset: highlightReset, update: updateHighlightCanvas } = useCanvas()

    const { hoveringColor } = useColorContext()
    const { image, maskImage } = useImageContext()
    const { palette, ignorePalette = [], tags } = paletteData

    return (
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
    );
}