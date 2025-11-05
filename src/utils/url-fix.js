/**
 * Utility function to fix malformed image URLs from API
 * 
 * The API currently returns URLs without proper file extensions:
 * - Expected: "https://example.com/file.svga"
 * - Actual: "https://example.com/filesvga"
 * 
 * This function detects and fixes missing dots before file extensions.
 * 
 * @param {string} url - The potentially malformed URL
 * @returns {string} - The corrected URL with proper file extension
 * 
 * @example
 * // Fix malformed URL
 * fixImageUrl('https://example.com/filesvga') // returns 'https://example.com/file.svga'
 * 
 * // Already correct URLs are unchanged
 * fixImageUrl('https://example.com/file.svga') // returns 'https://example.com/file.svga'
 * 
 * // Handles edge cases
 * fixImageUrl(null) // returns null
 * fixImageUrl('') // returns ''
 */
export function fixImageUrl(url) {
    // Return early if URL is falsy
    if (!url || typeof url !== 'string') {
        return url;
    }

    // Common extension patterns to fix - look for extensions without preceding dot
    const extensionFixes = [
        { pattern: /([^.])svga$/, replacement: '$1.svga' },
        { pattern: /([^.])webp$/, replacement: '$1.webp' },
        { pattern: /([^.])png$/, replacement: '$1.png' },
        { pattern: /([^.])jpg$/, replacement: '$1.jpg' },
        { pattern: /([^.])jpeg$/, replacement: '$1.jpeg' },
        { pattern: /([^.])gif$/, replacement: '$1.gif' }
    ];

    // Apply the first matching fix
    for (const fix of extensionFixes) {
        if (fix.pattern.test(url)) {
            return url.replace(fix.pattern, fix.replacement);
        }
    }

    // Return original URL if no pattern matches
    return url;
}

/**
 * Batch process multiple URLs
 * 
 * @param {string[]} urls - Array of URLs to fix
 * @returns {string[]} - Array of corrected URLs
 */
export function fixImageUrls(urls) {
    if (!Array.isArray(urls)) {
        return urls;
    }

    return urls.map(fixImageUrl);
}

/**
 * Fix URL in an object property
 * 
 * @param {Object} obj - Object containing URL property
 * @param {string} property - Property name containing the URL
 * @returns {Object} - Object with corrected URL property
 */
export function fixImageUrlInObject(obj, property = 'icon') {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    return {
        ...obj,
        [property]: fixImageUrl(obj[property])
    };
}

/**
 * Fix URLs in an array of objects
 * 
 * @param {Object[]} objects - Array of objects containing URL properties
 * @param {string} property - Property name containing the URL
 * @returns {Object[]} - Array of objects with corrected URL properties
 */
export function fixImageUrlsInObjects(objects, property = 'icon') {
    if (!Array.isArray(objects)) {
        return objects;
    }

    return objects.map(obj => fixImageUrlInObject(obj, property));
}