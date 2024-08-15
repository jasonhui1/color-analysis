export async function extractDroppedFileUrl(event) {
    const items = Array.from(event.dataTransfer.items);
    const urlItem = items.find(item => item.kind === 'string' && item.type === 'text/uri-list');
    if (!urlItem) return null;

    return new Promise(resolve => {
        urlItem.getAsString(url => {
            console.log('URL of the dropped image: ', url);
            resolve(url);
        });
    });

    // // Extract from html if need to store the url of the image instead of the site
    // const setSourceURLPromise = new Promise((resolve) => {
    //     // if (item.kind === 'file') {
    //     //     const file_ = item.getAsFile();
    //     //     console.log('file kind :>> ', file_);
    //     // } else if (item.kind === 'string') {
    //     //     if (item.type === 'text/uri-list' || item.type === 'text/plain' || item.type === 'text/html') {
    //     //         item.getAsString((data) => {
    //     //             console.log(`Data from item of type ${item.type} :>> `, data);
    //     //         });
    //     //     }
    //     // }
    // })
}