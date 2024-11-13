export const base64ToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const extension = dataUrl.split(';')[0].split('/')[1];
    return new File([blob], `${filename}.${extension}`, { type: blob.type });
}; 