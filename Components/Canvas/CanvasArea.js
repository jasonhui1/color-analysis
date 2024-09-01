import React, { useEffect } from 'react'
import Canvas from './Canvas'
import HighlightHoveringColorCanvas from './FilterCanvas'
import MaskedCanvas from './MaskedCanvas'
import SAMCanvas from './SAMCanvas'
import SobelCanvas from './SobelCanvas'
import { useColorContext } from '@/context/color'
import { useImageContext } from '@/context/image'

const CanvasArea = ({ Canvas_, MaskCanvas = null, HLCanvas = null, SobelCanvas_ = null, SAMCanvas_ = null, SAM = null,
    enableMask = false, enableSobel = false, sobelColorSpace = 'rgb',
    inMaskMode = false, invertMask = false,
    onlyHighlightMask = true,
    setSelectedColor = null,
    maxSize = 640,
    extraDrawing = () => { } }
) => {

    const initCanvas = (canvas) => canvas || { ref: null, reset: null, drawingComplete: null, setDrawingComplete: null, update: null };

    const { ref: canvasRef, reset: canvasReset, drawingComplete, setDrawingComplete, update: updateCanvas } = initCanvas(Canvas_);
    const { ref: maskCanvasRef, reset: maskReset, drawingComplete: maskDrawingComplete, setDrawingComplete: setMaskDrawingComplete, update: updateMaskCanvas } = initCanvas(MaskCanvas);
    const { ref: highlightCanvasRef, reset: highlightReset, drawingComplete: HighlightDrawingComplete, setDrawingComplete: setHighlightDrawingComplete, update: updateHighlightCanvas } = initCanvas(HLCanvas);
    const { ref: sobelCanvasRef, reset: sobelReset, update: updateSobelCanvas } = initCanvas(SobelCanvas_);
    const { ref: SAMCanvasRef, reset: SAMReset, update: updateSAMCanvas } = initCanvas(SAMCanvas_);
    const [canvas, maskCanvas] = [canvasRef.current, maskCanvasRef.current];


    useEffect(() => {
        if (SobelCanvas_ && drawingComplete) updateSobelCanvas()
    }, [drawingComplete]);

    useEffect(() => {
        if (maskDrawingComplete && enableMask) updateCanvas()
    }, [maskDrawingComplete]);

    const { hoveringColor, colorPalette, ignorePalette, } = useColorContext();
    const { image, maskImage } = useImageContext();

    return (
        <>
            {image &&
                <div className='relative self-center' style={{ width: canvas?.width ?? maxSize + 'px', height: canvas?.height ?? maxSize + 'px' }}>

                    {Canvas_ && <Canvas canvasRef={canvasRef} image={image} setDrawingComplete={setDrawingComplete} reset={canvasReset}
                        maskedImage={maskCanvas} maskMode={inMaskMode} enableMask={enableMask} invertMask={invertMask}
                        setSelectedColor={setSelectedColor} extraDrawing={extraDrawing} maxSize={maxSize}
                    />}
                    {SobelCanvas_ && <SobelCanvas canvasRef={sobelCanvasRef} reset={sobelReset} imageCanvas={canvas} enabled={enableSobel} colorSpace={sobelColorSpace} />}
                    {MaskCanvas && <MaskedCanvas canvasRef={maskCanvasRef} image={canvas} maskImage={maskImage} reset={maskReset} maskMode={inMaskMode}
                        setDrawingComplete={setMaskDrawingComplete}
                    />}
                    {SAMCanvas_ && <SAMCanvas canvasRef={SAMCanvasRef} image={canvas} reset={SAMReset} SAM={SAM} />}
                    {HLCanvas && <HighlightHoveringColorCanvas canvasRef={highlightCanvasRef} imageCanvas={canvas} maskCanvas={maskCanvas} reset={highlightReset}
                        color={hoveringColor} colorPalette={colorPalette} ignorePalette={ignorePalette}
                        onlyInMask={onlyHighlightMask}
                    />}
                </div>
            }
        </>
    )
}

export default CanvasArea