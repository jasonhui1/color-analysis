import { useState, useRef, useEffect } from "react";
import { LuUpload } from "react-icons/lu";

export default function FileUpload({ onImageSelected, imageSelected, fileDropRef }) {

    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const onDragOver = (event) => {
        console.log('dragging over:>> ');
        event.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (event) => {
        console.log('dragging leave:>> ');

        event.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (event) => {
        console.log('drop :>> ');
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files[0];
        handleImageUpload(file)
    };

    const onClick = () => {
        if (imageSelected) return
        fileInputRef.current.click();
    }

    const handleImageUpload = (file) => {
        if (!file) return
        setIsUploading(true)
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                onImageSelected(img)
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

    let className = 'w-full h-full border-2 rounded-lg flex items-center justify-center mb-4'
    if (!imageSelected) className += '  border-dashed cursor-pointer border-gray-300 hover:border-green-500 hover:bg-green-50';
    if (isDragging) className += ' border-green-500 bg-green-100'
    if (isUploading) className += ' opacity-50 cursor-not-allowed'

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
                onChange={(e) => handleImageUpload(e.target.files[0])}
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