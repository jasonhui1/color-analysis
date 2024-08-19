"use client"
import React, { createRef, useEffect, useState } from 'react'
import { ColorPicker } from '../../Components/Color/picker';
import PaletteRow from '@/Components/DataPage/PaletteRow';
import { Header } from '@/Components/DataPage/Header';
import { useFetchPalettesData } from '@/hooks/useFetchPalettesData';



export default function DataPage() {

  const [searchTerm, setSearchTerm] = useState('');
  const [searchToggle, setSearchToggle] = useState(true);

  const [selectedColor, setSelectedColor] = useState([0, 0, 0]);
  const [hoveringColor, setHoveringColor] = useState(null);
  const [hoveringRowIndex, setHoveringRowIndex] = useState(-1);

  const [canvasRefs, setCanvasRefs] = useState({});
  const [maskCanvasRefs, setMaskCanvasRefs] = useState({});
  const [canvasHLRefs, setCanvasHLRefs] = useState({});
  const [resets, setResets] = useState([]);

  const maxSize = 250
  const [searchTags, setSearchTags] = useState([]);
  const { data, loading, error } = useFetchPalettesData({ searchToggle, setSearchToggle, searchTags, maxSize })

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

  const onClickTag = (tag) => {
    if (searchTags.includes(tag)) return
    setSearchTags([...searchTags, tag])
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

      <Header
        searchTerm={searchTerm}
        onSearch={() => setSearchToggle(true)}
        setSearchTerm={setSearchTerm}
        tags={searchTags}
        setTags={setSearchTags}
      />

      <div className='fixed right-0 top-1/4 '>
        <ColorPicker selectedColor={{ r: selectedColor[0], g: selectedColor[1], b: selectedColor[2] }} isRGBSpace={true} />
      </div>

      {error && <div>Error: {error}</div>}
      {loading && <div>Loading...</div>}

      {data && data.map((paletteData, index) => {
        const id = paletteData.id

        return (
          <PaletteRow key={paletteData.id} canvasRef={canvasRefs[id]} maskCanvasRef={maskCanvasRefs[id]} canvasHLRef={canvasHLRefs[id]}
            paletteData={paletteData} hoveringColor={hoveringColor} reset={resets[id]} enable={hoveringRowIndex === index}
            onClickTag={onClickTag} onPaletteColorHover={onPaletteColorHover(index)} onPaletteColorUnHover={onPaletteColorUnHover} onPaletteClick={onPaletteClick} />
        )
      })}

      {!loading && !data && <div>You have not added any data</div>}
    </div>
  )
}



