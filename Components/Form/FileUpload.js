import { extractDroppedFileUrl } from "@/utils/file";
import { useState, useRef, useEffect } from "react";
import { LuUpload } from "react-icons/lu";

export default function FileUpload({ onImageSelected, imageSelected, fileDropRef }) {

    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const onDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const onDrop = async (event) => {
        event.preventDefault();
        setIsDragging(false);

        const file = event.dataTransfer.files[0];
        const sourceURL = await extractDroppedFileUrl(event)

        handleImageSelected(file, sourceURL)
    };

    const onClick = () => {
        if (imageSelected) return
        //simulate click to open file explorer
        fileInputRef.current.click();
    }

    const handleImageSelected = (file, url) => {
        if (!file) return
        setIsUploading(true)
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                onImageSelected(img, file, url)
            };
        };

        reader.readAsDataURL(file);
        setIsUploading(false)

    };

    useEffect(() => {
        const div = fileDropRef.current;
        if (div) {
            div.addEventListener('dragover', onDragOver);
            div.addEventListener('dragleave', onDragLeave);
            div.addEventListener('drop', onDrop);
            return () => {
                div.removeEventListener('dragover', onDragOver);
                div.removeEventListener('dragleave', onDragLeave);
                div.removeEventListener('drop', onDrop);
            };
        }
    }, [fileDropRef,]);

    const classNames = []
    classNames.push('absolute inset-0 w-full h-full rounded-lg flex items-center justify-center')
    
    if (imageSelected) classNames.push('pointer-events-none');
    if (!imageSelected || isDragging) {
        classNames.push('border-2 border-dashed cursor-pointer border-gray-300 hover:border-green-500 hover:bg-green-50')
    }
    
    if (isDragging) classNames.push(' border-green-500 bg-green-100 z-50')
    if (isUploading) classNames.push(' opacity-50 cursor-not-allowed')

    const className = classNames.join(' ')

    return (
        <div
            // onDragOver={onDragOver}
            // onDragLeave={onDragLeave}
            // onDrop={onDrop}
            onClick={onClick}
            className={className}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleImageSelected(e.target.files[0])}
                className="hidden"
                accept="image/*"
            />

            {(!imageSelected || isDragging) &&
                <div className="text-center">
                    <LuUpload className="mx-auto" color="gray" size={30} />
                    <p className="mt-1 text-sm text-gray-600">
                        {isUploading ? 'Uploading...' : 'Drag and drop or click to upload'}
                    </p>
                </div>
            }
        </div>
    );
}