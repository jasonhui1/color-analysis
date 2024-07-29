"use client"
import React, { createRef, useEffect, useRef, useState } from 'react'
import { getPaletteClient } from '../../api/palette'
import PaletteDisplay, { PaletteDisplaySimple, PaletteDisplaySimpleV2 } from '../../Components/Color/PaletteDisplay';
import Image from '../../node_modules/next/image';
import { TriangularColorPickerDisplayColors } from '../../Components/Color/picker';
import { getUserId } from '../../api/supabaseClient';
import { IoSearchOutline } from "react-icons/io5";
import { CiCircleRemove } from "react-icons/ci";
import HighlightHoveringColorCanvas from '../../Components/FilterCanvas';
import Canvas, { CanvasNoMask } from '../../Components/Canvas';

export default function DataPage() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [finalSearchTerm, setFinalSearchTerm] = useState('');

  const [hoveringColor, setHoveringColor] = useState([0, 0, 0]);
  const [hoveringRowIndex, setHoveringRowIndex] = useState(-1);

  const [canvasRefs, setCanvasRefs] = useState([]);
  const [imageRefs, setImageRefs] = useState([]);
  const [canvasHLRefs, setCanvasHLRefs] = useState([]);
  const [resets, setResets] = useState([]);

  useEffect(() => {
    // add or remove refs
    if (!data) return
    setCanvasRefs(() => Array(data.length).fill().map((_, i) => createRef()));
    setImageRefs(() => Array(data.length).fill().map((_, i) => createRef()));
    setCanvasHLRefs(() => Array(data.length).fill().map((_, i) => createRef()));
  }, [data]);

  async function getData() {
    setLoading(true)
    const userId = await getUserId()
    const data = await getPaletteClient({ userId, withTags: true, searchTerm: finalSearchTerm })
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


  const onPaletteColorHover = (color, rowIndex) => {
    setHoveringColor(color)
    setHoveringRowIndex(rowIndex)
  }


  const onPaletteColorUnHover = () => {
    setHoveringColor([0, 0, 0])
    setHoveringRowIndex(-1)
    const newReset = [...resets]
    newReset[hoveringRowIndex] = !newReset[hoveringRowIndex]
    setResets(newReset)
  }

  // console.log('data :>> ', data);
  // const searchTags = finalSearchTerm.trim().split(' ').map(tag => tag.trim())

  // console.log('hoveringColor :>> ', hoveringColor);
  console.log('hoveringRowIndex :>> ', hoveringRowIndex);

  return (
    <div className='flex flex-col gap-4'>
      <h1>DATA</h1>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} setFinalSearchTerm={setFinalSearchTerm} />

      {data && data.map(({ palette, imageURL, tags }, index) => {

        return (
          <div className='flex gap-4 items-center' key={index}>

            <div className='flex flex-col gap-1 relative'>
              {imageURL && <Image ref={imageRefs[index]} src={imageURL} alt={imageURL} width={200} height={200} />}
              <CanvasNoMask canvasRef={canvasRefs[index]} image={imageRefs[index]?.current} />
              <HighlightHoveringColorCanvas baseCanvasRef={canvasRefs[index]} reset={resets[index]} enable={hoveringRowIndex === index} canvasRef={canvasHLRefs[index]} image={imageRefs[index]?.current} color={hoveringColor} colorPalette={palette} />
              <TagsDisplay tags={tags} onClickTag={onClickTag} />

            </div>
            <TriangularColorPickerDisplayColors colors={palette} size={200} />
            <PaletteDisplaySimpleV2 colorPalette={palette}
              onPaletteColorHover={(color) => onPaletteColorHover(color, index)}
              onPaletteColorUnHover={() => onPaletteColorUnHover()}
            />

          </div>
        )
      })}
    </div>
  )
}

const SearchBar = ({ searchTerm, setSearchTerm, setFinalSearchTerm }) => {
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setFinalSearchTerm(searchTerm)
    }
  }

  return (
    <div className='flex gap-2 items-center border bg-gray-100 w-fit p-2'>
      <IoSearchOutline size={20} />
      <input className=' bg-inherit w-96 outline-none ' type='text' value={searchTerm} placeholder='Search Tags' onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyPress} />
      {searchTerm && <CiCircleRemove size={20} cursor='pointer' onClick={() => { setSearchTerm(''); setFinalSearchTerm('') }} />}
    </div>
  )
}


const TagDisplay = ({ tag, onClick }) => {
  return (
    <div className='bg-gray-200 px-2 py-1 rounded-md cursor-pointer' onClick={onClick}>{tag}</div>
  )
}

const TagsDisplay = ({ tags, onClickTag }) => {
  return (
    <div className='flex gap-2'>
      {tags && tags.map((tag, index) =>
        <TagDisplay key={index} tag={tag} onClick={() => onClickTag(tag)} />)
      }
    </div>
  )
}
