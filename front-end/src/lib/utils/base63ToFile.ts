// Function to convert base64 data to a File object
const base64ToFile = (base64Data: string, fileName: string): File => {
    const arr = base64Data.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
    };

export default base64ToFile