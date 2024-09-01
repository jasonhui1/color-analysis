import { CanvasNoMask } from "@/Components/Canvas/Canvas";
import HighlightHoveringColorCanvas from "@/Components/Canvas/FilterCanvas";
import MaskedCanvas from "@/Components/Canvas/MaskedCanvas";
import useCanvas from "@/hooks/useCanvas";
import { ImageTagsDisplay } from "../ImageTagsDisplay";
import { useImageContext } from "@/context/image";
import { useColorContext } from "@/context/color";
import CanvasArea from "@/Components/Canvas/CanvasArea";

export default function ImageDataDisplay({
    paletteData,
    setEnlargeIndex,
    onClickTag,
    showTags,
    maxSize,
}) {
    const Canvas = useCanvas()
    const MaskCanvas = useCanvas()
    const HLCanvas = useCanvas()

    const { palette, ignorePalette = [], tags } = paletteData

    return (
        <div className='flex flex-col gap-1 relative  h-fit justify-center' style={{ width: maxSize + 'px', minHeight: maxSize + 'px' }} >
            <div className='flex flex-col gap-1 relative h-fit justify-center cursor-pointer' onClick={setEnlargeIndex && setEnlargeIndex} >
                {/* {imageURL && <Image ref={imageRef} src={imageURL} alt={imageURL} width={250} height={250} />} */}
                {/* <CanvasNoMask canvasRef={canvasRef} image={image} maxSize={maxSize} />
                <MaskedCanvas canvasRef={maskCanvasRef} image={image} maskImage={maskImage} initialColor='rgb(0,0,0,0)' />
                <HighlightHoveringColorCanvas canvasRef={canvasHLRef} imageCanvas={canvasRef?.current} maskCanvas={maskCanvasRef?.current} onlyInMask={true}
                    color={hoveringColor} colorPalette={palette} ignorePalette={ignorePalette}
                    reset={highlightReset}
                /> */}
                <CanvasArea Canvas_={Canvas} MaskCanvas={MaskCanvas} HLCanvas={HLCanvas} />

            </div>
            {showTags && <ImageTagsDisplay tags={tags} onClickTag={onClickTag} />}
        </div>
    );
}