import React from 'react';
import { getImageSrcSet, getOptimizedImageUrl } from '../utils';
import { ImageTransformOptions } from '../types';

/**
 * Props for the ThumborImage component
 */
export interface ThumborImageProps extends Omit<React.ComponentProps<'img'>, 'src'> {
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
export const ThumborImage: React.FC<ThumborImageProps> = ({
  src,
  thumborOptions = {},
  sizes = '100vw',
  responsive = true,
  alt = '',
  width,
  height,
  loading = 'lazy',
  ...props
}) => {
  // Generate the optimized image URL using Thumbor
  const optimizedSrc = getOptimizedImageUrl(src, {
    ...thumborOptions,
    width: typeof width === 'number' ? width : thumborOptions.width,
    height: typeof height === 'number' ? height : thumborOptions.height,
  });

  // Generate srcSet if responsive is enabled
  const srcSet = responsive ? getImageSrcSet(src, thumborOptions) : undefined;

  return React.createElement('img', {
    src: optimizedSrc,
    srcSet: srcSet,
    sizes: responsive ? sizes : undefined,
    alt,
    width,
    height,
    loading,
    ...props
  });
};

/**
 * Thumbor-powered image component for Next.js
 */
export const NextThumborImage: React.FC<any> = ({
  src,
  thumborOptions = {},
  alt = '',
  width,
  height,
  ...props
}) => {
  // Generate the optimized image URL
  const optimizedSrc = getOptimizedImageUrl(src, {
    ...thumborOptions,
    width: typeof width === 'number' ? width : thumborOptions.width,
    height: typeof height === 'number' ? height : thumborOptions.height,
  });

  // Import is handled dynamically in the component's render method
  if (typeof window !== 'undefined') {
    // Client-side rendering
    return React.createElement(ThumborImage, {
      src,
      thumborOptions,
      alt,
      width,
      height,
      ...props
    });
  }

  // Server-side rendering
  try {
    // Dynamic import on server side
    const NextImage = require('next/image').default;

    return React.createElement(NextImage, {
      src: optimizedSrc,
      alt,
      width,
      height,
      ...props
    });
  } catch (e) {
    // Fallback to standard img if next/image isn't available
    return React.createElement(ThumborImage, {
      src,
      thumborOptions,
      alt,
      width,
      height,
      ...props
    });
  }
};
