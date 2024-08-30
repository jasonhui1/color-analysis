import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer';
import { loadCloudinaryImage } from '@/lib/cloudinary/utils';
import { ColorProvider } from '@/context/color';
import { ImageProvider, useImageContext } from '@/context/image';
import DataDisplay from './ColorDataDisplay';
import ImageDataDisplay from './ImageDataDisplay';
import ColorDataDisplay from './ColorDataDisplay';
import CheckBox from '@/Components/General/CheckBox';
import Extras from '../Extra';

const PaletteRow = ({ paletteData,
    onClickTag = null, setSelectedColor, onPaletteSelect = null, setEnlargeIndex = null,
    showTags = true, showPalette = true, showSelect = true,
    maxSize = 250,
}) => {

    const { id: paletteId, imageURL, maskImageURL } = paletteData
    const { setImage, setMaskImage } = useImageContext()

    const [selected, setSelected] = useState(false)
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

    const onSelect = () => {
        setSelected(!selected)
        onPaletteSelect(paletteId, !selected)
    }

    return (
        <>

            {!isDeleted &&
                <div ref={ref} className='flex gap-4 items-center ' style={{ minHeight: inView ? 'auto' : '100px' }}>
                    {inView && (
                        <>
                            <ImageDataDisplay
                                paletteData={paletteData}
                                setEnlargeIndex={setEnlargeIndex}
                                onClickTag={onClickTag}
                                showTags={showTags}
                                maxSize={maxSize}
                            />

                            <ColorDataDisplay
                                paletteData={paletteData}
                                setSelectedColor={setSelectedColor}
                                showPalette={showPalette}
                                maxSize={maxSize}
                            />

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





