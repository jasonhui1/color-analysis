export function setImageURL(url, width, height) {
    const parts = url.split("/image/upload/")
    const arg = `w_${width},h_${height},c_limit/`
    const combinedURL = `${parts[0]}/image/upload/${arg}${parts[1]}`

    return combinedURL
}