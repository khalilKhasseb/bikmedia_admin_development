/**
 * Media configuration utility for handling CSP and loading issues
 */

// Track CSP violations to automatically disable problematic features
let cspViolationDetected = false;
let svgaDisabled = false;

// List of domains that are known to be blocked by CSP
const blockedDomains = [
    'digitaloceanspaces.com',
    'amazonaws.com',
    's3.amazonaws.com'
];

/**
 * Check if a URL is likely to be blocked by CSP
 * @param {string} url - The URL to check
 * @returns {boolean} - True if URL is likely blocked
 */
export function isUrlBlockedByCSP(url) {
    if (!url || typeof url !== 'string') return false;

    // Check if URL contains any blocked domains
    return blockedDomains.some(domain => url.includes(domain));
}

/**
 * Mark that a CSP violation was detected
 */
export function markCSPViolation() {
    cspViolationDetected = true;
    console.warn('CSP violation detected, enabling fallback mode for media loading');
}

/**
 * Check if CSP violations have been detected
 * @returns {boolean}
 */
export function hasCSPViolations() {
    return cspViolationDetected;
}

/**
 * Disable SVGA loading globally
 */
export function disableSVGA() {
    svgaDisabled = true;
    console.warn('SVGA loading disabled due to CSP restrictions');
}

/**
 * Check if SVGA loading is disabled
 * @returns {boolean}
 */
export function isSVGADisabled() {
    return svgaDisabled;
}

/**
 * Generate fallback URLs for a given SVGA URL
 * @param {string} svgaUrl - The original SVGA URL
 * @returns {string[]} - Array of fallback URLs to try
 */
export function generateFallbackUrls(svgaUrl) {
    if (!svgaUrl || !svgaUrl.endsWith('.svga')) {
        return [svgaUrl];
    }

    const baseUrl = svgaUrl.replace(/\.svga$/, '');
    const fallbackExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

    return fallbackExtensions.map(ext => `${baseUrl}${ext}`);
}

/**
 * Get the best fallback URL for an SVGA file
 * @param {string} svgaUrl - The original SVGA URL
 * @returns {string} - The best fallback URL
 */
export function getBestFallbackUrl(svgaUrl) {
    const fallbacks = generateFallbackUrls(svgaUrl);
    return fallbacks[0] || svgaUrl; // Return PNG fallback first
}

/**
 * Initialize CSP detection
 */
export function initCSPDetection() {
    // Listen for CSP violations
    if (typeof window !== 'undefined') {
        window.addEventListener('securitypolicyviolation', (event) => {
            if (event.violatedDirective.includes('connect-src')) {
                markCSPViolation();

                // If it's an SVGA-related violation, disable SVGA loading
                if (event.blockedURI && event.blockedURI.includes('.svga')) {
                    disableSVGA();
                }
            }
        });
    }
}