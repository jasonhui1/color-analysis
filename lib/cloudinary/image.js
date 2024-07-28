import cloudinary from "./setup";

export async function uploadImage(imageURL) {
    const result = await cloudinary.uploader.upload(imageURL);
    return result
}
