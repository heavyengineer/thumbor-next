/**
 * Options for configuring the Thumbor client
 */
interface ThumborOptions {
    /**
     * URL of the Thumbor server
     */
    serverUrl: string;
    /**
     * Optional security key for accessing the Thumbor server
     */
    securityKey?: string;
    /**
     * Whether to require security key for URL generation
     * @default true if securityKey is provided
     */
    requiresSecurityKey?: boolean;
    /**
     * Whether to always use unsafe mode (no security key)
     * This overrides requiresSecurityKey if set to true
     * @default false
     */
    unsafeMode?: boolean;
    /**
     * Whether to use cloaked URLs which will be rewritten by the server
     * This is useful for hiding the original image URL/thumbor
     * @default false
     */
    cloaked?: boolean;
}
interface WindowSizeAndPosition {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
interface ImageOperations {
    imagePath: string;
    width?: number;
    height?: number;
    smart?: boolean;
    trim?: boolean;
    fitIn?: FitInType;
    flipHorizontally?: boolean;
    flipVertically?: boolean;
    halign?: HorizontalPosition;
    valign?: VerticalPosition;
    crop?: WindowSizeAndPosition;
    filters?: string[];
}
/**
 * Different types of fitting for an image
 */
declare enum FitInType {
    DEFAULT = "fit-in",
    FULL = "full-fit-in",
    ADAPTIVE = "adaptative-fit-in"
}
/**
 * Vertical position options
 */
declare enum VerticalPosition {
    TOP = "top",
    MIDDLE = "middle",
    BOTTOM = "bottom"
}
/**
 * Horizontal position options
 */
declare enum HorizontalPosition {
    LEFT = "left",
    CENTER = "center",
    RIGHT = "right"
}
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
 * Create a Thumbor client for generating image URLs
 * @param options Configuration options for the Thumbor client
 */
declare function createThumbor(options: ThumborOptions): {
    setImagePath: (path: string) => /*elided*/ any;
    setImageUrl: (url: string) => /*elided*/ any;
    resize: (width?: number, height?: number) => /*elided*/ any;
    smartCrop: (enable?: boolean) => /*elided*/ any;
    trim: () => /*elided*/ any;
    fitIn: (width: number, height: number, type?: FitInType) => /*elided*/ any;
    flipHorizontally: () => /*elided*/ any;
    flipVertically: () => /*elided*/ any;
    horizontalAlign: (align: HorizontalPosition) => /*elided*/ any;
    verticalAlign: (align: VerticalPosition) => /*elided*/ any;
    filter: (filterCall: string) => /*elided*/ any;
    crop: (crop: WindowSizeAndPosition) => /*elided*/ any;
    format: (format: string) => /*elided*/ any;
    quality: (quality: number) => /*elided*/ any;
    brightness: (amount: number) => /*elided*/ any;
    contrast: (amount: number) => /*elided*/ any;
    grayscale: () => /*elided*/ any;
    blur: (radius: number) => /*elided*/ any;
    buildUrl: () => string;
};

/**
 * Get or create a Thumbor client instance
 */
declare function getThumbor(options?: Partial<ThumborOptions>): {
    setImagePath: (path: string) => /*elided*/ any;
    setImageUrl: (url: string) => /*elided*/ any;
    resize: (width?: number, height?: number) => /*elided*/ any;
    smartCrop: (enable?: boolean) => /*elided*/ any;
    trim: () => /*elided*/ any;
    fitIn: (width: number, height: number, type?: FitInType) => /*elided*/ any;
    flipHorizontally: () => /*elided*/ any;
    flipVertically: () => /*elided*/ any;
    horizontalAlign: (align: HorizontalPosition) => /*elided*/ any;
    verticalAlign: (align: VerticalPosition) => /*elided*/ any;
    filter: (filterCall: string) => /*elided*/ any;
    crop: (crop: WindowSizeAndPosition) => /*elided*/ any;
    format: (format: string) => /*elided*/ any;
    quality: (quality: number) => /*elided*/ any;
    brightness: (amount: number) => /*elided*/ any;
    contrast: (amount: number) => /*elided*/ any;
    grayscale: () => /*elided*/ any;
    blur: (radius: number) => /*elided*/ any;
    buildUrl: () => string;
};
/**
 * Generate an optimized image URL using Thumbor
 *
 * @param originalUrl Original image URL
 * @param options Transformation options
 * @returns Processed image URL
 */
declare function getOptimizedImageUrl(originalUrl: string, options?: ImageTransformOptions): string;
/**
 * Generate a responsive image URL for specific device sizes
 *
 * @param originalUrl Original image URL
 * @param options Base transformation options
 * @returns Object with URLs for different device sizes
 */
declare function getResponsiveImageUrls(originalUrl: string, options?: ImageTransformOptions): {
    small: string;
    medium: string;
    large: string;
};
/**
 * Generate srcSet string for responsive images
 *
 * @param originalUrl Original image URL
 * @param options Base transformation options
 * @returns srcSet string for use in <img> tags
 */
declare function getImageSrcSet(originalUrl: string, options?: ImageTransformOptions): string;

export { FitInType, HorizontalPosition, type ImageOperations, type ImageTransformOptions, type ThumborOptions, VerticalPosition, type WindowSizeAndPosition, createThumbor, getImageSrcSet, getOptimizedImageUrl, getResponsiveImageUrls, getThumbor };
