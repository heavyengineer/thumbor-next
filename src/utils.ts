import { createThumbor } from './thumbor';
import { ImageTransformOptions, ThumborOptions } from './types';

/**
 * Cache the Thumbor client instance for reuse
 */
let thumborClientInstance: ReturnType<typeof createThumbor> | null = null;

/**
 * Get or create a Thumbor client instance
 */
export function getThumbor(options?: Partial<ThumborOptions>) {
  // Try to use environment variables by default in both Node.js and browser environments
  const getEnv = (key: string) => {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || '';
    }
    return '';
  };

  const defaultOptions: ThumborOptions = {
    serverUrl: getEnv('NEXT_PUBLIC_THUMBOR_SERVER_URL'),
    securityKey: getEnv('THUMBOR_SECURITY_KEY'),
    requiresSecurityKey: !!getEnv('THUMBOR_SECURITY_KEY'),
  };

  // Create a new client if it doesn't exist or if options are provided
  if (!thumborClientInstance || options) {
    thumborClientInstance = createThumbor({
      ...defaultOptions,
      ...options,
    });
  }

  return thumborClientInstance;
}

/**
 * Generate an optimized image URL using Thumbor
 *
 * @param originalUrl Original image URL
 * @param options Transformation options
 * @returns Processed image URL
 */
export function getOptimizedImageUrl(originalUrl: string, options: ImageTransformOptions = {}): string {
  if (!originalUrl) return '';

  // Get the Thumbor client
  const thumbor = getThumbor();

  // Start building the image URL
  let imageBuilder = thumbor.setImageUrl(originalUrl);

  // Apply transformations based on options
  if (options.width !== undefined || options.height !== undefined) {
    imageBuilder = imageBuilder.resize(options.width, options.height);
  }

  if (options.smartCrop) {
    imageBuilder = imageBuilder.smartCrop(true);
  }

  if (options.quality) {
    imageBuilder = imageBuilder.quality(options.quality);
  }

  if (options.format) {
    imageBuilder = imageBuilder.format(options.format);
  }

  if (options.blur) {
    imageBuilder = imageBuilder.blur(options.blur);
  }

  if (options.grayscale) {
    imageBuilder = imageBuilder.grayscale();
  }

  if (options.trim) {
    imageBuilder = imageBuilder.trim();
  }

  if (options.flipHorizontally) {
    imageBuilder = imageBuilder.flipHorizontally();
  }

  if (options.flipVertically) {
    imageBuilder = imageBuilder.flipVertically();
  }

  // Build and return the final URL
  return imageBuilder.buildUrl();
}

/**
 * Generate a responsive image URL for specific device sizes
 *
 * @param originalUrl Original image URL
 * @param options Base transformation options
 * @returns Object with URLs for different device sizes
 */
export function getResponsiveImageUrls(originalUrl: string, options: ImageTransformOptions = {}) {
  return {
    small: getOptimizedImageUrl(originalUrl, {
      ...options,
      width: options.width ? Math.floor(options.width / 3) : 320,
    }),
    medium: getOptimizedImageUrl(originalUrl, {
      ...options,
      width: options.width ? Math.floor(options.width / 1.5) : 768,
    }),
    large: getOptimizedImageUrl(originalUrl, options),
  };
}

/**
 * Generate srcSet string for responsive images
 *
 * @param originalUrl Original image URL
 * @param options Base transformation options
 * @returns srcSet string for use in <img> tags
 */
export function getImageSrcSet(originalUrl: string, options: ImageTransformOptions = {}): string {
  const widths = [320, 640, 960, 1280, 1920];

  return widths
    .map((width) => {
      const url = getOptimizedImageUrl(originalUrl, {
        ...options,
        width,
        height: options.height ? Math.floor((options.height * width) / (options.width || width)) : undefined,
      });

      return `${url} ${width}w`;
    })
    .join(', ');
}
