/*
 * Copyright (c) 2026 Averion
 * Email: security@averion.id
 * 
 * PROPRIETARY LICENSE
 * 
 * This software is the confidential and proprietary information of Averion.
 * Unauthorized reproduction, distribution, or modification of this source code
 * is strictly prohibited.
 * 
 * WARNING: Modifying this source code without permission is a criminal offense.
 */

// Global Set to track loaded image URLs - shared between preloadImages and ImageWithSkeleton
export const loadedImages = new Set<string>();

const images = import.meta.glob('../assets/**/*.{png,jpg,jpeg,svg,ico}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

/**
 * Resolves image paths from mock data to actual asset paths in src/assets.
 * Uses Vite's import.meta.glob to ensure assets are bundled and accessible.
 */
export const getImageUrl = (path: string | undefined | null): string | null => {
  if (!path) return null;
  if (path.startsWith("data:") || path.startsWith("http")) return path;

  // Convert stored path (e.g. ./products/foo.png) to match glob path style
  const cleanPath = path.replace(/^(\.\/|\/)/, "");
  
  // Try to find the exact asset in the glob map
  const globPath = `../assets/${cleanPath}`;
  return images[globPath] || null;
};

// Preload images in the background to cache them in browser
export const preloadImages = (imagePaths: (string | undefined | null)[]) => {
  imagePaths.forEach((path) => {
    const url = getImageUrl(path);
    if (url && !loadedImages.has(url)) {
      const img = new Image();
      img.onload = () => {
        loadedImages.add(url);
      };
      img.src = url;
    }
  });
};
