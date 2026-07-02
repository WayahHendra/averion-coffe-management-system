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

import { useState, useEffect, useRef } from 'react';
import { getImageUrl, loadedImages } from '@/utils/image';
import { Image as ImageIcon } from 'lucide-react';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src?: string;
    alt: string;
    className?: string;
    skeletonClassName?: string;
    fallbackIcon?: boolean;
}

const ImageWithSkeleton = ({
    src,
    alt,
    className = '',
    skeletonClassName = '',
    fallbackIcon = true,
    ...props
}: ImageWithSkeletonProps) => {
    const resolvedSrc = getImageUrl(src);
    const isAlreadyLoaded = resolvedSrc ? loadedImages.has(resolvedSrc) : false;

    const [isLoaded, setIsLoaded] = useState(isAlreadyLoaded);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
            setIsLoaded(true);
            if (resolvedSrc) loadedImages.add(resolvedSrc);
        }
    }, [resolvedSrc]);

    const handleLoad = () => {
        setIsLoaded(true);
        if (resolvedSrc) loadedImages.add(resolvedSrc);
    };

    const handleError = () => {
        setHasError(true);
        setIsLoaded(true);
    };

    return (
        <div
            className={`image-skeleton-wrapper ${className}`}
            style={{
                position: 'relative',
                overflow: 'hidden',
                display: 'inline-block',
                backgroundColor: 'var(--color-bg-secondary)'
            }}
        >
            {!isLoaded && (
                <div
                    className={`skeleton-box ${skeletonClassName}`}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 2
                    }}
                />
            )}

            {resolvedSrc && !hasError ? (
                <img
                    ref={imgRef}
                    src={resolvedSrc}
                    alt={alt}
                    className={isLoaded ? 'loaded' : 'loading'}
                    onLoad={handleLoad}
                    onError={handleError}
                    style={{
                        opacity: isLoaded ? 1 : 0,
                        transition: isLoaded ? 'none' : 'opacity 0.15s ease-in-out',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                    }}
                    {...props}
                />
            ) : (
                <div
                    className="image-fallback"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'var(--color-bg-secondary)',
                        color: 'var(--color-text-muted)',
                        width: '100%',
                        height: '100%',
                        zIndex: 1
                    }}
                >
                    {fallbackIcon && <ImageIcon size={20} />}
                </div>
            )}
        </div>
    );
};

export default ImageWithSkeleton;
