/**
 * Client-side image compressor using HTML5 Canvas.
 * Resizes large images (e.g., 5-15MB phone photos) down to reasonable dimensions (max 800px)
 * and compresses them to ~40-80KB WebP/JPEG data URLs.
 * This prevents browser localStorage QuotaExceededError and ensures lightning-fast rendering.
 */
export const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }

    // If file is already an SVG or tiny, or not an image
    if (!file.type.startsWith('image/')) {
      return reject(new Error('File is not an image'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original if canvas context unavailable
          return resolve(event.target.result);
        }

        // Draw image with smooth smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to lightweight JPEG data URL
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onerror = (err) => {
        console.warn('Image load error during compression, using raw data URL', err);
        resolve(event.target.result);
      };
    };

    reader.onerror = (err) => reject(err);
  });
};

// Fallback high-quality product image URL
export const FALLBACK_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80';
