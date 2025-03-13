import React from 'react';

/**
 * Common image transformation options
 */
interface ImageTransformOptions {
    width?: number;
    height?: number;
    smartCrop?: boolean;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png' | 'avif';
    blur?: number;
    grayscale?: boolean;
    trim?: boolean;
    flipHorizontally?: boolean;
    flipVertically?: boolean;
}

/**
 * Props for the ThumborImage component
 */
interface ThumborImageProps extends Omit<React.ComponentProps<'img'>, 'src'> {
    /**
     * Original image URL
     */
    src: string;
    /**
     * Thumbor transformation options
     */
    thumborOptions?: ImageTransformOptions;
    /**
     * Sizes attribute for responsive images
     * @default "100vw"
     */
    sizes?: string;
    /**
     * Whether to generate a srcSet for responsive images
     * @default true
     */
    responsive?: boolean;
}
/**
 * A simple React component for displaying images processed with Thumbor
 */
declare const ThumborImage: React.FC<ThumborImageProps>;
/**
 * Thumbor-powered image component for Next.js
 */
declare const NextThumborImage: React.FC<any>;

export { NextThumborImage, ThumborImage, type ThumborImageProps };
