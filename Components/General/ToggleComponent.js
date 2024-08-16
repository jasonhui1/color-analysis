import { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function ToggleComponent({ label, children }) {
    const [isVisible, setIsVisible] = useState(false);

    const handleToggle = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className='w-full'>
            <button onClick={handleToggle} className='bg-gray-200 w-full px-2 py-1 rounded-md cursor-pointer block text-sm mb-1'>
                <div className='flex items-center '>
                    {isVisible ? `Hide ${label}` : `Show ${label}`}
                    {isVisible ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </div>

            </button>
            {isVisible && children}
        </div>
    );
}