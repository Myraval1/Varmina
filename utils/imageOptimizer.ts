
export const compressImage = async (file: File): Promise<File> => {
    // 1. Skip small files (already optimized) or specific formats that shouldn't be touched
    // Now more inclusive: skip if file is < 1MB and is already an optimized web format
    const isOptimizedFormat = ['image/webp', 'image/avif', 'image/svg+xml'].includes(file.type);
    if (file.size < 1000000 && isOptimizedFormat) return file; 
    
    // Also skip very small files regardless of format to preserve original intent
    if (file.size < 200000) return file;

    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.src = url;

        img.onload = () => {
            // Cleanup URL object
            URL.revokeObjectURL(url);

            // 2. Calculate new dimensions (Max width 3840px - 4K)
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 3840;
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;

            // 3. Draw and Compress to WebP
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error("Canvas context not available"));
                return;
            }

            // Draw with high smoothing quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                if (blob) {
                    // 4. Return new file
                    const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                        type: "image/webp",
                        lastModified: Date.now(),
                    });
                    resolve(newFile);
                } else {
                    reject(new Error("Compression failed"));
                }
            }, 'image/webp', 0.9); // 90% Quality for premium visual fidelity
        };
        img.onerror = (error) => {
            URL.revokeObjectURL(url);
            reject(error);
        };
    });
};
