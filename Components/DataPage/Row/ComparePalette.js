import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Image from "@/node_modules/next/image";
import { setImageURL } from "@/lib/cloudinary/utils";
import PaletteRow from "./PaletteRow";

export default function ComparePalette({ paletteData, onClose }) {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const [visibleIndex, setVisibleIndex] = useState(0)

    return (
        <div className='flex items-center justify-center fixed inset-0 vh-100 w-full z-10 bg-orange-50 '>
            <div className="flex flex-col h-full w-5/6">

                <div className='relative h-[500px] '>
                    {paletteData.map((data, index) =>
                        <div key={data.id} className={`absolute inset-0 ${index === visibleIndex ? '' : 'opacity-0'}`}>
                            <PaletteRow
                                paletteData={data}
                                showTags={false} showPalette={false} showSelect={false}
                                maxSize={500}
                            />
                        </div>)}
                </div>
                <div className="flex gap-2 mt-auto">

                    {paletteData.map((data, index) =>
                        <div className="relative cursor-pointer min-w-[150px] h-[200px]" key={data.id} onClick={() => { setVisibleIndex(index) }} >
                            <Image src={setImageURL(data.imageURL, 150, 150)} alt={'image'} layout="fill" objectFit="contain" />
                            <div className={`absolute inset-0 bg-black w-full h-full bg-opacity-50  ${(index === visibleIndex) ? 'opacity-0' : ''}`} />
                        </div>
                    )}

                </div>
            </div>
            <IoMdClose className='absolute top-0 right-0 p-2 cursor-pointer' onClick={onClose} size={48} />
        </div>
    );
}