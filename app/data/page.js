"use client"
import React, { useEffect, useState } from 'react'
import { getPaletteClient } from '../../api/palette'
import PaletteDisplay, { PaletteDisplaySimple } from '../../Components/Color/PaletteDisplay';
import Image from '../../node_modules/next/image';
import { TriangularColorPickerDisplayColors } from '../../Components/Color/picker';
import { getUserId } from '../../api/supabaseClient';

export default function DataPage() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [finalSearchTerm, setFinalSearchTerm] = useState('');

  async function getData(searchTerm) {
    // const searchTags = searchTerm.split(' ').map(tag => tag.trim());
    // console.log('searchTags :>> ', searchTags);
    const userId = await getUserId()
    const data = await getPaletteClient({ userId, withTags: true, searchTerm: finalSearchTerm })
    setData(data)
  }

  useEffect(() => {
    getData()
  }, [finalSearchTerm])

  const onClickTag = (tag) => {
    setFinalSearchTerm(tag)
  }

  const onDeleteTag = (tag) => {

    setFinalSearchTerm(finalSearchTerm.replace(tag, ''))
  }

  console.log('data :>> ', data);
  const searchTags = finalSearchTerm.split(' ').map(tag => tag.trim())

  console.log('searchTags :>> ', searchTags);

  return (
    <div className='flex flex-col gap-4'>
      <h1>DATA</h1>
      <div className='flex gap-2 items-center'>
        <label>Searching</label>
        {finalSearchTerm !== '' ? <TagsDisplay tags={searchTags} onClickTag={onDeleteTag} />
          : <label>No Tags</label>
        }
      </div>
      {data && data.map(({ palette, imageURL, tags }) => {

        return (
          <div className='flex gap-4 items-center'>



            <div className='flex flex-col gap-1'>
              {imageURL && <Image src={imageURL} alt={imageURL} width={200} height={200} />}
              <TagsDisplay tags={tags} onClickTag={onClickTag} />

            </div>
            <TriangularColorPickerDisplayColors colors={palette.palette} />
            <PaletteDisplaySimple colorPalette={palette.palette} />

          </div>
        )
      })}
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
