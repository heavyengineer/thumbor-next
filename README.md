# thumbor-next
## Alpha - not to be used in production - unless you like it spicey

A modern Thumbor client optimised for Next.js applications, with built-in TypeScript support and React components.

## Features

- 🚀 Modern, functional API with TypeScript support
- ⚡ Server and client components compatible
- 🖼️ Built-in React components for easy integration
- 🌐 Responsive image handling with `srcSet` generation
- 🔐 Secure URL generation with HMAC signatures
- 🧩 Tree-shakable for optimal bundle size

## Installation

```bash
npm install thumbor-next
# or
yarn add thumbor-next
# or
pnpm add thumbor-next
```

## Basic Usage

### 1. Configure in your environment variables

```env
# .env.local
NEXT_PUBLIC_THUMBOR_SERVER_URL=https://your-thumbor-server.com
THUMBOR_SECURITY_KEY=your-secret-key
```

### 2. Using the Core API

```typescript
import { createThumbor, getOptimizedImageUrl } from 'thumbor-next';

// Create a Thumbor client directly
const thumbor = createThumbor({
  serverUrl: 'https://your-thumbor-server.com',
  securityKey: 'your-secret-key'
});

// Build a URL with the fluent API
const imageUrl = thumbor
  .setImageUrl('https://example.com/image.jpg')
  .resize(800, 600)
  .smartCrop(true)
  .format('webp')
  .quality(85)
  .buildUrl();

// Or use the helper function
const optimizedUrl = getOptimizedImageUrl('https://example.com/image.jpg', {
  width: 800,
  height: 600,
  smartCrop: true,
  quality: 85,
  format: 'webp'
});
```

### 3. Using the React Components

```tsx
import { ThumborImage, NextThumborImage } from 'thumbor-next/react';

// Standard React component
function MyComponent() {
  return (
    <ThumborImage
      src="https://example.com/image.jpg"
      alt="Example image"
      width={800}
      height={600}
      thumborOptions={{
        smartCrop: true,
        quality: 85,
        format: 'webp'
      }}
      responsive={true}
      sizes="(max-width: 768px) 100vw, 800px"
      className="rounded-lg shadow-md"
    />
  );
}

// Next.js Image component integration
function MyNextComponent() {
  return (
    <NextThumborImage
      src="https://example.com/image.jpg"
      alt="Example image"
      width={800}
      height={600}
      thumborOptions={{
        smartCrop: true,
        quality: 85,
        format: 'webp'
      }}
      priority
      className="rounded-lg shadow-md"
    />
  );
}
```

## API Reference

### Core API

#### `createThumbor(options)`

Creates a new Thumbor client instance.

```typescript
import { createThumbor } from 'thumbor-next';

const thumbor = createThumbor({
  serverUrl: 'https://your-thumbor-server.com',
  securityKey: 'your-secret-key',
  requiresSecurityKey: true // default: true if securityKey is provided
});
```

The Thumbor client provides the following methods:

| Method                  | Description                                        |
|-------------------------|----------------------------------------------------|
| `setImageUrl(url)`      | Set the image URL                                  |
| `setImagePath(path)`    | Set the image path                                 |
| `resize(width, height)` | Resize the image                                   |
| `smartCrop(enable)`     | Enable smart cropping                              |
| `trim()`                | Enable trimming                                    |
| `fitIn(width, height, type)` | Use the fit-in mode                           |
| `flipHorizontally()`    | Flip the image horizontally                        |
| `flipVertically()`      | Flip the image vertically                          |
| `horizontalAlign(align)`| Set horizontal alignment                           |
| `verticalAlign(align)`  | Set vertical alignment                             |
| `filter(filterCall)`    | Add a filter                                       |
| `crop(crop)`            | Set crop values                                    |
| `format(format)`        | Set the output format                              |
| `quality(quality)`      | Set the output quality                             |
| `brightness(amount)`    | Adjust brightness                                  |
| `contrast(amount)`      | Adjust contrast                                    |
| `grayscale()`           | Convert to grayscale                               |
| `blur(radius)`          | Apply blur                                         |
| `buildUrl()`            | Build the final URL                                |

#### Utility functions

| Function                  | Description                                        |
|---------------------------|----------------------------------------------------|
| `getThumbor(options?)`    | Get or create a singleton Thumbor client           |
| `getOptimizedImageUrl(url, options)` | Generate an optimized image URL         |
| `getResponsiveImageUrls(url, options)` | Generate URLs for different sizes     |
| `getImageSrcSet(url, options)` | Generate a srcSet string                      |

### React Components

#### `ThumborImage`

A React component for displaying images processed with Thumbor.

```tsx
import { ThumborImage } from 'thumbor-next/react';

<ThumborImage
  src="https://example.com/image.jpg"
  alt="Example image"
  width={800}
  height={600}
  thumborOptions={{
    smartCrop: true,
    quality: 85,
    format: 'webp'
  }}
  responsive={true}
  sizes="(max-width: 768px) 100vw, 800px"
  className="rounded-lg shadow-md"
/>
```

#### `NextThumborImage`

An optimized component for Next.js that integrates with `next/image`.

```tsx
import { NextThumborImage } from 'thumbor-next/react';

<NextThumborImage
  src="https://example.com/image.jpg"
  alt="Example image"
  width={800}
  height={600}
  thumborOptions={{
    smartCrop: true,
    quality: 85,
    format: 'webp'
  }}
  priority
  className="rounded-lg shadow-md"
/>
```

## Advanced Usage

### 1. Server-Side Rendering

The package works seamlessly with Next.js server components:

```tsx
// app/page.tsx (Server Component)
import { getOptimizedImageUrl } from 'thumbor-next';
import Image from 'next/image';

export default function Page() {
  const optimizedImageUrl = getOptimizedImageUrl('https://example.com/image.jpg', {
    width: 800,
    height: 600,
    smartCrop: true,
    format: 'webp'
  });

  return (
    <Image
      src={optimizedImageUrl}
      alt="Optimized image"
      width={800}
      height={600}
      priority
    />
  );
}
```

### 2. Custom Filters

You can apply any Thumbor filter:

```typescript
const url = thumbor
  .setImageUrl('https://example.com/image.jpg')
  .filter('watermark(https://example.com/watermark.png,10,10,50)')
  .filter('round_corner(20,255,255,255)')
  .buildUrl();
```

### 3. Custom Configuration

You can override the default configuration:

```typescript
import { getThumbor } from 'thumbor-next';

// Override the default configuration
const thumbor = getThumbor({
  serverUrl: 'https://custom-thumbor-server.com',
  securityKey: 'custom-key'
});
```

## License

MIT
