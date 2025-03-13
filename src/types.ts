/**
 * Options for configuring the Thumbor client
 */
export interface ThumborOptions {
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

export interface WindowSizeAndPosition {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface ImageOperations {
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
export enum FitInType {
  DEFAULT = 'fit-in',
  FULL = 'full-fit-in',
  ADAPTIVE = 'adaptative-fit-in',
}

/**
 * Vertical position options
 */
export enum VerticalPosition {
  TOP = 'top',
  MIDDLE = 'middle',
  BOTTOM = 'bottom',
}

/**
 * Horizontal position options
 */
export enum HorizontalPosition {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

/**
 * Common image transformation options
 */
export interface ImageTransformOptions {
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
