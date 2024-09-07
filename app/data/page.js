"use client"
import React, { createRef, useEffect, useState } from 'react'
import { ColorPicker } from '../../Components/Color/picker';
import PaletteRow from '@/Components/DataPage/Row/PaletteRow';
import { Header } from '@/Components/DataPage/Header';
import { useFetchPalettesData } from '@/hooks/useFetchPalettesData';
import ComparePalette from '@/Components/DataPage/Row/ComparePalette';
import EnlargePaletteDisplay from '@/Components/DataPage/Row/EnlargePaletteDisplay';
import { ColorProvider } from '@/context/color';
import { ImageProvider } from '@/context/image';

export default function DataPage() {

  const [searchTags, setSearchTags] = useState([]);
  const [searchToggle, setSearchToggle] = useState(true);
  const [selectedColor, setSelectedColor] = useState([0, 0, 0]);

  const maxImageSize = 250
  const { data, loading, error } = useFetchPalettesData({ searchToggle, setSearchToggle, searchTags })

  const [enlargeIndex, setEnlargeIndex] = useState(-1)
  const [comparing, setComparing] = useState(false)

  const [selectedPalettes, setSelectedPalettes] = useState([])

  const onClickTag = (tag) => {
    if (searchTags.includes(tag)) return
    setSearchTags([...searchTags, tag])
  }

  const onPaletteSelect = (paletteId, selected) => {
    if (selected) {
      setSelectedPalettes([...selectedPalettes, paletteId])
    } else {
      setSelectedPalettes(selectedPalettes.filter(id => id != paletteId))
    }
  }

  const onClickCompareButton = () => {
    setComparing(true)
  }

  const enlargingPalette = enlargeIndex != -1 ? data?.[enlargeIndex] || null : null
  return (
    <div className='flex flex-col gap-4 relative'>

      <Header
        onSearch={() => setSearchToggle(true)}
        tags={searchTags}
        setTags={setSearchTags}
        showCompareButton={selectedPalettes.length >= 2}
        onClickCompareButton={onClickCompareButton}
      />

      <div className='fixed right-0 bottom-0 z-20 p-2 '>
        <ColorPicker selectedColor={{ r: selectedColor[0], g: selectedColor[1], b: selectedColor[2] }} isRGBSpace={true} size={200} allowInput={false} />
      </div>

      {comparing &&
        <ComparePalette
          paletteData={selectedPalettes.map(paletteId => data.find(palette => palette.id == paletteId))}
          onClose={() => setComparing(false)}
        />
      }


      {enlargingPalette &&
        <EnlargePaletteDisplay paletteData={enlargingPalette}
          selectedColor={selectedColor} setSelectedColor={setSelectedColor}
          onClose={() => setEnlargeIndex(-1)}
        />
      }

      {data && data.map((paletteData, index) => {
        const id = paletteData.id

        return (
          <ColorProvider>
            <ImageProvider>
              <PaletteRow key={paletteData.id}
                paletteData={paletteData}
                onClickTag={onClickTag}
                setEnlargeIndex={() => setEnlargeIndex(index)}
                setSelectedColor={setSelectedColor}
                onPaletteSelect={onPaletteSelect}
              />
            </ImageProvider>
          </ColorProvider>

        )
      })}

      {error && <div>Error: {error}</div>}
      {loading && <div>Loading...</div>}
      {!loading && !data && <div>You have not added any data</div>}
    </div>
  )
}







