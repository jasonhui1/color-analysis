import { loadImage } from "@/utils/image"

export function setImageURL(url, width, height) {
    const parts = url.split("/image/upload/")
    const arg = `w_${width},h_${height},c_limit/`
    const combinedURL = `${parts[0]}/image/upload/${arg}${parts[1]}`

    return combinedURL
}

export async function loadCloudinaryImage(url,maxSize) {
    const resized_url = setImageURL(url, maxSize, maxSize)
    const img = await loadImage(resized_url);
    return img
}