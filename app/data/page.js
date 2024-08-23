"use client"
import React, { createRef, useEffect, useState } from 'react'
import { ColorPicker } from '../../Components/Color/picker';
import PaletteRow from '@/Components/DataPage/PaletteRow';
import { Header } from '@/Components/DataPage/Header';
import { useFetchPalettesData } from '@/hooks/useFetchPalettesData';
import EnlargePaletteDisplay from '@/Components/DataPage/EnlargePaletteDisplay';
import { IoMdClose } from "react-icons/io";

export default function DataPage() {

  const [searchTerm, setSearchTerm] = useState('');
  const [searchToggle, setSearchToggle] = useState(true);

  const [selectedColor, setSelectedColor] = useState([0, 0, 0]);

  const maxSize = 250
  const [searchTags, setSearchTags] = useState([]);
  const { data, loading, error } = useFetchPalettesData({ searchToggle, setSearchToggle, searchTags, maxSize })

  const [enlargeIndex, setEnlargeIndex] = useState(-1)
  const [comparing, setComparing] = useState(false)

  const [selectedPalette, setSelectedPalette] = useState([])

  const onClickTag = (tag) => {
    if (searchTags.includes(tag)) return
    setSearchTags([...searchTags, tag])
  }
  const onPaletteColorClick = (color) => {
    setSelectedColor(color)
  }


  const onPaletteSelect = (paletteId, selected) => {
    if (selected) {
      setSelectedPalette([...selectedPalette, paletteId])
    } else {
      setSelectedPalette(selectedPalette.filter(id => id != paletteId))
    }
  }

  const onClickCompareButton = () => {
    setComparing(true)
  }

  console.log('selectedPalette :>> ', selectedPalette);


  // console.log('data :>> ', data);
  // const searchTags = finalSearchTerm.trim().split(' ').map(tag => tag.trim())
  console.log('enlargeIndex :>> ', enlargeIndex);
  const enlargingPalette = enlargeIndex != -1 ? data?.[enlargeIndex] || null : null
  return (
    <div className='flex flex-col gap-4 relative'>

      <Header
        searchTerm={searchTerm}
        onSearch={() => setSearchToggle(true)}
        setSearchTerm={setSearchTerm}
        tags={searchTags}
        setTags={setSearchTags}
        showCompareButton={selectedPalette.length >= 2}
        onClickCompareButton={onClickCompareButton}
      />

      <div className='fixed right-0 bottom-0 z-20 p-2 '>
        <ColorPicker selectedColor={{ r: selectedColor[0], g: selectedColor[1], b: selectedColor[2] }} isRGBSpace={true} size={200} allowInput={false} />
      </div>

      {/* {comparing && <div className='flex items-center justify-center fixed inset-0 vh-100 w-full z-10 bg-orange-50 '>
        <div className='flex flex-col gap-4 relative'>
          {selectedPalette.map((paletteId, index) =>
            <PaletteRow key={paletteId} canvasRef={canvasRefs[paletteId]} maskCanvasRef={maskCanvasRefs[paletteId]} canvasHLRef={canvasHLRefs[paletteId]}
              paletteData={data.find(({ id }) => id === paletteId)} hoveringColor={hoveringColor}
              reset={resets[paletteId]} enable={hoveringRowIndex === index}
              onClickTag={onClickTag} onPaletteColorHover={onPaletteColorHover(index)} onPaletteColorUnHover={onPaletteColorUnHover} onPaletteColorClick={onPaletteColorClick}
              setEnlargeIndex={() => setEnlargeIndex(index)}
              onPaletteSelect={onPaletteSelect}
            />)}
        </div>

        <IoMdClose className='absolute top-0 right-0 p-2 cursor-pointer' onClick={() => setComparing(false)} size={48} />
      </div>} */}


      {enlargingPalette && <div className='flex items-center justify-center fixed inset-0 vh-100 w-full z-10 bg-red-50 '>
        <EnlargePaletteDisplay imageURL={enlargingPalette.imageURL} maskImageURL={enlargingPalette.maskImageURL}
          colorPalette={enlargingPalette.palette} ignorePalette={enlargingPalette.ignorePalette} percentage={enlargingPalette.colorPalettePercentage}
          setSelectedColor={setSelectedColor}
        />
        <IoMdClose className='absolute top-0 right-0 p-2 cursor-pointer' onClick={() => setEnlargeIndex(-1)} size={48} />
      </div>}

      {error && <div>Error: {error}</div>}
      {loading && <div>Loading...</div>}

      {data && data.map((paletteData, index) => {
        const id = paletteData.id

        return (
          <PaletteRow key={paletteData.id}
            paletteData={paletteData}
            onClickTag={onClickTag}
            setEnlargeIndex={() => setEnlargeIndex(index)}
            onPaletteColorClick={onPaletteColorClick}
            onPaletteSelect={onPaletteSelect}
          />
        )
      })}

      {!loading && !data && <div>You have not added any data</div>}
    </div>
  )
}



