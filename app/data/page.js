"use client"
import React, { createRef, useEffect, useRef, useState } from 'react'
import { getPaletteClient } from '../../lib/clientApis/palette'
import PaletteDisplay, { PaletteDisplaySimple, PaletteDisplaySimpleV2 } from '../../Components/Color/PaletteDisplay';
import Image from '../../node_modules/next/image';
import { ColorPicker, TriangularColorPickerDisplayColors } from '../../Components/Color/picker';
import { getUserId } from '../../lib/clientApis/supabaseClient';
import { IoSearchOutline } from "react-icons/io5";
import { CiCircleRemove } from "react-icons/ci";
import HighlightHoveringColorCanvas from '../../Components/Canvas/FilterCanvas';
import Canvas, { CanvasNoMask } from '../../Components/Canvas/Canvas';
import { calculateBrightness, sortPaletteAndPercentage } from '../../utils/color';
import { useInView, InView } from 'react-intersection-observer';
import { createImageFromUrl } from '../../utils/canvas';
import MaskedCanvas from '../../Components/Canvas/MaskedCanvas';



export default function DataPage() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [finalSearchTerm, setFinalSearchTerm] = useState('');

  const [selectedColor, setSelectedColor] = useState([0, 0, 0]);
  const [hoveringColor, setHoveringColor] = useState(null);
  const [hoveringRowIndex, setHoveringRowIndex] = useState(-1);

  const [canvasRefs, setCanvasRefs] = useState({});
  const [maskCanvasRefs, setMaskCanvasRefs] = useState({});
  const [canvasHLRefs, setCanvasHLRefs] = useState({});
  const [resets, setResets] = useState([]);

  const maxSize = 250


  useEffect(() => {
    // add or remove refs
    if (!data) return

    const newCanvasRefs = {};
    const newMaskCanvasRefs = {};
    const newCanvasHLRefs = {};

    data.forEach(({ id }) => {
      newCanvasRefs[id] = createRef();
      newMaskCanvasRefs[id] = createRef();
      newCanvasHLRefs[id] = createRef();
    });

    setCanvasRefs(newCanvasRefs);
    setMaskCanvasRefs(newMaskCanvasRefs);
    setCanvasHLRefs(newCanvasHLRefs);
    setResets(new Array(data.length).fill(true));
  }, [data]);

  async function getData() {
    setLoading(true)
    const userId = await getUserId()
    const data = await getPaletteClient({ userId, withTags: true, searchTerm: finalSearchTerm, imageMaxWidth: maxSize, imageMaxHeight: maxSize })
    if (data && data.palette) {
      if (data.percentage === undefined) data.percentage = []
    }
    setData(data)
    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [finalSearchTerm])

  const onClickTag = (tag) => {
    setSearchTerm(searchTerm + ' ' + tag)
  }

  // const onDeleteTag = (tag) => {
  //   setFinalSearchTerm(finalSearchTerm.replace(tag, ''))
  // }
  const onPaletteClick = (color) => {
    setSelectedColor(color)
  }

  const onPaletteColorHover = (rowIndex) => (color) => {
    setHoveringColor(color)
    setHoveringRowIndex(rowIndex)
  }


  const onPaletteColorUnHover = () => {
    setHoveringColor(null);
    setHoveringRowIndex(-1)
    const newReset = [...resets]
    newReset[hoveringRowIndex] = !newReset[hoveringRowIndex]
    setResets(newReset)
  }

  // console.log('data :>> ', data);
  // const searchTags = finalSearchTerm.trim().split(' ').map(tag => tag.trim())
  return (
    <div className='flex flex-col gap-4 relative'>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} setFinalSearchTerm={setFinalSearchTerm} />
      <div className='fixed right-0 top-1/4 '>
        <ColorPicker selectedColor={{ r: selectedColor[0], g: selectedColor[1], b: selectedColor[2] }} isRGBSpace={true} />
      </div>

      {error && <div>Error: {error}</div>}
      {loading && <div>Loading...</div>}

      {data && data.map((paletteData, index) => {
        const id = paletteData.id

        return (
          <Row key={paletteData.id} canvasRef={canvasRefs[id]} maskCanvasRef={maskCanvasRefs[id]} canvasHLRef={canvasHLRefs[id]}
            paletteData={paletteData} hoveringColor={hoveringColor} reset={resets[id]} enable={hoveringRowIndex === index}
            onClickTag={onClickTag} onPaletteColorHover={onPaletteColorHover(index)} onPaletteColorUnHover={onPaletteColorUnHover} onPaletteClick={onPaletteClick} />
        )
      })}

      {!loading && !data && <div>You have not added any data</div>}


    </div>
  )
}

const Row = ({ canvasRef, canvasHLRef, maskCanvasRef, hoveringColor, paletteData, reset, enable, onClickTag, onPaletteColorHover, onPaletteColorUnHover, onPaletteClick }) => {
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
      const loadImage = async (url, setF) => {
        const img = await createImageFromUrl(url);
        setF(img);

      };
      if (imageURL) loadImage(imageURL, setImage);
      if (maskImageURL) loadImage(maskImageURL, setMaskImage);
    }
  }, [inView, imageURL]);

  return (
    <div ref={ref} className='flex gap-4 items-center ' >
      {inView && (
        <>
          <div className='flex flex-col gap-1 relative w-[250px] min-h-[100px] h-fit justify-center ' >
            <div className='relative self-center' style={{ width: image?.width ?? maxSize + 'px', height: image?.height ?? maxSize + 'px' }}>
              {/* {imageURL && <Image ref={imageRef} src={imageURL} alt={imageURL} width={250} height={250} />} */}
              <CanvasNoMask canvasRef={canvasRef} image={image} maxSize={maxSize} />
              <MaskedCanvas canvasRef={maskCanvasRef} image={image} maskImage={maskImage} initialColor='rgb(0,0,0,0)' />
              <HighlightHoveringColorCanvas canvasRef={canvasHLRef} imageCanvas={canvasRef?.current} maskCanvas={maskCanvasRef?.current} onlyInMask={true}
                color={hoveringColor} colorPalette={palette} ignorePalette={ignorePalette}
                reset={reset} enable={enable}
              />

            </div>
            <TagsDisplay tags={tags} onClickTag={onClickTag} />
          </div>

          <TriangularColorPickerDisplayColors colors={palette} size={maxSize * 0.8} highlightColor={hoveringColor} />
          <PaletteDisplaySimpleV2 colorPalette={sorted_palette} showHeading={false} colorPalettePercentage={sorted_percentage}
            onPaletteColorHover={onPaletteColorHover}
            onPaletteColorUnHover={onPaletteColorUnHover}
            onPaletteClick={onPaletteClick}
          />

        </>)
      }
    </div>

  )
}

const SearchBar = ({ searchTerm, setSearchTerm, setFinalSearchTerm }) => {
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      search(searchTerm)
    }
  }

  const search = (searchTerm) => {
    setFinalSearchTerm(searchTerm)
  }

  return (
    <div className='w-full flex justify-center sticky top-0 bg-white z-10'>

      <div className='flex gap-2 items-center border bg-gray-100 w-fit p-2 '>
        <IoSearchOutline size={20} onClick={() => search(searchTerm)} cursor='pointer' />
        <input className=' bg-inherit w-96 outline-none ' type='text' value={searchTerm} placeholder='Search Tags' onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyPress} />
        {searchTerm && <CiCircleRemove size={20} cursor='pointer' onClick={() => { setSearchTerm(''); setFinalSearchTerm('') }} />}
      </div>
    </div>
  )
}


const TagDisplay = ({ tag, onClick }) => {
  return (
    <div className='bg-gray-200 px-2 py-1 rounded-md cursor-pointer text-sm' onClick={onClick}>{tag}</div>
  )
}

const TagsDisplay = ({ tags, onClickTag }) => {
  return (
    <div className='flex gap-2 flex-wrap'>
      {tags && tags.map((tag, index) =>
        <TagDisplay key={index} tag={tag} onClick={() => onClickTag(tag)} />)
      }
    </div>
  )
}
