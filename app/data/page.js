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

  useEffect(() => {
    async function getData() {
      const userId = await getUserId()
      const data = await getPaletteClient({ userId, withTags: true })
      setData(data)
    }
    getData()
  }, [])

  console.log('data :>> ', data);

  return (
    <div className='flex flex-col gap-4'>
      <h1>DATA</h1>
      {data && data.map(({ palette, imageURL, tags }) => {

        return (
          <div className='flex gap-4 items-center'>
            <div>

              {imageURL && <Image src={imageURL} alt={imageURL} width={200} height={200} />}
              <div className='flex gap-2'>
                {tags && tags.map(tag => <div className='bg-gray-200 px-2 py-1 rounded-md'>{tag}</div>)}
              </div>
            </div>
            <TriangularColorPickerDisplayColors colors={palette.palette} />
            <PaletteDisplaySimple colorPalette={palette.palette} />

          </div>
        )
      })}
    </div>
  )
}
