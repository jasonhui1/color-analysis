export default function FileUpload({ onImageSelected }) {

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                onImageSelected(img)
            };
        };

        reader.readAsDataURL(file);
    };

    return (
        <input
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            className="mb-4"
        />
    );
}