# URL Fix Utility

This utility provides functions to fix malformed image URLs returned by the API.

## Problem

The API currently returns URLs without proper file extensions:
- **Expected**: `https://example.com/file.svga`
- **Actual**: `https://example.com/filesvga`

## Solution

The `url-fix.js` utility detects and fixes missing dots before common image file extensions.

## Usage

### Basic URL Fixing

```javascript
import { fixImageUrl } from '@/utils/url-fix.js';

// Fix a single URL
const fixedUrl = fixImageUrl('https://example.com/filesvga');
// Result: 'https://example.com/file.svga'
```

### Batch Processing

```javascript
import { fixImageUrls } from '@/utils/url-fix.js';

// Fix multiple URLs
const urls = ['https://example.com/file1svga', 'https://example.com/file2webp'];
const fixedUrls = fixImageUrls(urls);
// Result: ['https://example.com/file1.svga', 'https://example.com/file2.webp']
```

### Object Processing

```javascript
import { fixImageUrlInObject, fixImageUrlsInObjects } from '@/utils/url-fix.js';

// Fix URL in a single object
const subGift = { id: 1, name: 'Gift', icon: 'https://example.com/iconsvga' };
const fixedSubGift = fixImageUrlInObject(subGift);
// Result: { id: 1, name: 'Gift', icon: 'https://example.com/icon.svga' }

// Fix URLs in array of objects (useful for sub-gifts)
const subGifts = [
  { id: 1, name: 'Gift 1', icon: 'https://example.com/icon1svga' },
  { id: 2, name: 'Gift 2', icon: 'https://example.com/icon2webp' }
];
const fixedSubGifts = fixImageUrlsInObjects(subGifts);
```

## Supported Extensions

- `.svga` (SVGA animation files)
- `.webp` (WebP images)
- `.png` (PNG images)
- `.jpg` (JPEG images)
- `.jpeg` (JPEG images)
- `.gif` (GIF images)

## Backward Compatibility

The utility is designed to be backward compatible:
- URLs that already have correct extensions are left unchanged
- When the API is fixed in the future, this utility can be safely removed
- No breaking changes to existing code

## Testing

Run the manual tests to verify functionality:

```javascript
import { runTests } from '@/utils/url-fix.test.js';
runTests();
```

## Integration with SubGift Carousel

This utility will be used in the SubGiftCard component to preprocess URLs before passing them to the SmartIcon component:

```javascript
import { fixImageUrl } from '@/utils/url-fix.js';

// In SubGiftCard component
const processedIconUrl = fixImageUrl(subGift.icon);
```