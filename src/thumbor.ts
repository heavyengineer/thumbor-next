import crypto from 'crypto';
import {
  FitInType,
  HorizontalPosition,
  ImageOperations,
  ThumborOptions,
  VerticalPosition,
  WindowSizeAndPosition
} from './types';

/**
 * Create a Thumbor client for generating image URLs
 * @param options Configuration options for the Thumbor client
 */
export function createThumbor(options: ThumborOptions) {
  const {
    serverUrl,
    securityKey,
    requiresSecurityKey = !!securityKey,
    cloaked = false
  } = options;
  let operations: ImageOperations = createEmptyOperations();

  /**
   * Create an empty operations object
   */
  function createEmptyOperations(): ImageOperations {
    return {
      imagePath: '',
      filters: []
    };
  }

  /**
   * Reset the operations to default values
   */
  function resetOperations() {
    operations = createEmptyOperations();
  }

  /**
   * Set the image path
   * @param path Path to the image
   */
  function setImagePath(path: string) {
    operations.imagePath = path.startsWith('/') ? path.slice(1) : path;
    return api;
  }

  /**
   * Set the image URL
   * @param url URL of the image
   */
  function setImageUrl(url: string) {
    operations.imagePath = url;
    return api;
  }

  /**
   * Resize the image
   * @param width Desired width
   * @param height Desired height
   */
  function resize(width?: number, height?: number) {
    operations.width = width;
    operations.height = height;
    operations.fitIn = undefined;
    return api;
  }

  /**
   * Enable smart cropping
   * @param enable Whether to enable smart cropping
   */
  function smartCrop(enable = true) {
    operations.smart = enable;
    return api;
  }

  /**
   * Enable trimming of the image
   */
  function trim() {
    operations.trim = true;
    return api;
  }

  /**
   * Set fit-in parameters
   * @param width Width to fit in
   * @param height Height to fit in
   * @param type Type of fitting
   */
  function fitIn(width: number, height: number, type = FitInType.DEFAULT) {
    operations.width = width;
    operations.height = height;
    operations.fitIn = type;
    return api;
  }

  /**
   * Flip the image horizontally
   */
  function flipHorizontally() {
    operations.flipHorizontally = true;
    return api;
  }

  /**
   * Flip the image vertically
   */
  function flipVertically() {
    operations.flipVertically = true;
    return api;
  }

  /**
   * Set horizontal alignment
   * @param align Horizontal alignment
   */
  function horizontalAlign(align: HorizontalPosition) {
    operations.halign = align;
    return api;
  }

  /**
   * Set vertical alignment
   * @param align Vertical alignment
   */
  function verticalAlign(align: VerticalPosition) {
    operations.valign = align;
    return api;
  }

  /**
   * Add a filter
   * @param filterCall Filter expression
   */
  function filter(filterCall: string) {
    operations.filters = operations.filters || [];
    operations.filters.push(filterCall);
    return api;
  }

  /**
   * Set crop values
   * @param crop Crop dimensions
   */
  function crop(crop: WindowSizeAndPosition) {
    operations.crop = crop;
    return api;
  }

  /**
   * Format the image to a specific type
   * @param format Image format (webp, jpeg, png, etc)
   */
  function format(format: string) {
    return filter(`format(${format})`);
  }

  /**
   * Set the image quality
   * @param quality Quality percentage (1-100)
   */
  function quality(quality: number) {
    return filter(`quality(${quality})`);
  }

  /**
   * Set the image brightness
   * @param amount Brightness amount (-100 to 100)
   */
  function brightness(amount: number) {
    return filter(`brightness(${amount})`);
  }

  /**
   * Set the image contrast
   * @param amount Contrast amount (-100 to 100)
   */
  function contrast(amount: number) {
    return filter(`contrast(${amount})`);
  }

  /**
   * Apply a grayscale filter
   */
  function grayscale() {
    return filter('grayscale()');
  }

  /**
   * Apply a blur to the image
   * @param radius Blur radius
   */
  function blur(radius: number) {
    return filter(`blur(${radius})`);
  }

  /**
   * Convert URL parts based on operations
   */
  function getUrlParts(): string[] {
    const parts: string[] = [];

    if (operations.trim) {
      parts.push('trim');
    }

    if (operations.crop) {
      parts.push(
        `${operations.crop.left}x${operations.crop.top}:${operations.crop.right}x${operations.crop.bottom}`
      );
    }

    if (operations.fitIn) {
      parts.push(operations.fitIn);
    }

    if (
      operations.width !== undefined ||
      operations.height !== undefined ||
      operations.flipHorizontally ||
      operations.flipVertically
    ) {
      let sizeString = '';

      if (operations.flipHorizontally) {
        sizeString += '-';
      }

      sizeString += operations.width ?? 0;
      sizeString += 'x';

      if (operations.flipVertically) {
        sizeString += '-';
      }

      sizeString += operations.height ?? 0;

      parts.push(sizeString);
    }

    if (operations.halign) {
      parts.push(operations.halign);
    }

    if (operations.valign) {
      parts.push(operations.valign);
    }

    if (operations.smart) {
      parts.push('smart');
    }

    if (operations.filters && operations.filters.length > 0) {
      parts.push(`filters:${operations.filters.join(':')}`);
    }

    return parts;
  }

  /**
   * Build the operation path for the URL
   */
  function getOperationPath(): string {
    const parts = getUrlParts();
    return parts.length > 0 ? parts.join('/') : '';
  }

/**
   * Build the final URL with all operations
   */
function buildUrl(): string {
  const operationPath = getOperationPath();
  const imagePath = operations.imagePath;
  const dataToEncrypt = operationPath
    ? `${operationPath}/${imagePath}`
    : imagePath;

  // Always use unsafe mode, otherwise check security key
  let url = `${serverUrl}/unsafe/${dataToEncrypt}`;

  if (securityKey && requiresSecurityKey) {
    const digest = crypto
      .createHmac('sha1', securityKey)
      .update(dataToEncrypt)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    url = `${serverUrl}/${digest}/${dataToEncrypt}`;

  }
  if (cloaked) {
    url = `${serverUrl}/${dataToEncrypt}`;
  }
  // Reset operations for next use
  resetOperations();

  return url;
}

  // Public API
  const api = {
    setImagePath,
    setImageUrl,
    resize,
    smartCrop,
    trim,
    fitIn,
    flipHorizontally,
    flipVertically,
    horizontalAlign,
    verticalAlign,
    filter,
    crop,
    format,
    quality,
    brightness,
    contrast,
    grayscale,
    blur,
    buildUrl
  };

  return api;
}
