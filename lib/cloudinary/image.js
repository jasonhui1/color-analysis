import cloudinary from "./setup";

export async function uploadImage(imageURL) {
    const result = await cloudinary.uploader.upload(imageURL);
    return result
}


export async function deleteImage(imageURL) {
    let res = null
    if (imageURL ) {
        // Extract public ID from the image URL
        const publicId = imageURL.split('/').pop().split('.')[0]; // This assumes standard Cloudinary URL format

        try {
            res = await cloudinary.uploader.destroy(publicId);
            console.log('Cloudinary deletion response :>> ', res);
        } catch (cloudinaryError) {
            console.error('Error deleting image from Cloudinary:', cloudinaryError);
            throw cloudinaryError;
        }
    }
    return res
}