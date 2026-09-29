import defaultBottleImg from '../assets/images/transparent (1).png';

/**
 * Client-side image compressor using HTML5 Canvas.
 * Resizes large images down to reasonable dimensions (max 600px)
 * and compresses them to ~20-40KB WebP/JPEG data URLs.
 * This prevents browser localStorage QuotaExceededError and ensures lightning-fast rendering.
 */
export const compressImage = (file, maxWidth = 600, maxHeight = 600, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }

    // If file is not an image
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

        // Convert to WebP data URL (preserves transparency + highly compact ~20-40KB)
        let compressedDataUrl;
        try {
          compressedDataUrl = canvas.toDataURL('image/webp', quality);
        } catch (e) {
          // fallback
        }
        if (!compressedDataUrl || !compressedDataUrl.startsWith('data:image/webp')) {
          try {
            compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          } catch (e) {
            compressedDataUrl = canvas.toDataURL('image/png');
          }
        }
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

// Fallback authentic product packaging image (Shimanzu bottle packaging instead of random tomatoes/crops)
export const FALLBACK_PRODUCT_IMAGE = defaultBottleImg;

