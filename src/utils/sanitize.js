/**
 * Input Sanitization Utility
 * 
 * Purpose: Sanitize user inputs to prevent XSS (Cross-Site Scripting) attacks
 * 
 * How it works: Uses DOMPurify to strip HTML tags and dangerous attributes from user inputs
 * 
 * When to use: Sanitize all user inputs before storing or displaying, especially in forms
 * 
 * Best practice: Sanitize on input (before storing) rather than on output (before displaying)
 * 
 * Note: This protects against XSS but not SQL injection (backend responsibility)
 * 
 * Author: Khalil Khasseb
 * Date: 2025-10-26
 */

import DOMPurify from 'dompurify';

/**
 * Default DOMPurify configuration
 * Strips all HTML tags and attributes by default, keeping only text content
 */
const defaultConfig = {
    ALLOWED_TAGS: [], // Strip all HTML tags by default
    ALLOWED_ATTR: [], // Strip all attributes
    KEEP_CONTENT: true, // Keep text content, remove only tags
};

/**
 * Sanitizes a single input value by removing HTML tags and dangerous characters
 * 
 * @param {*} input - The input value to sanitize (string, number, or any type)
 * @param {Object} config - Optional DOMPurify configuration to override defaults
 * @returns {*} The sanitized string, or the original value if not a string
 * 
 * @example
 * // Basic usage
 * const clean = sanitizeInput('<script>alert("xss")</script>Hello');
 * // Returns: 'Hello'
 * 
 * @example
 * // With custom config (allow specific tags)
 * const clean = sanitizeInput('<b>Bold</b> text', { ALLOWED_TAGS: ['b'] });
 * // Returns: '<b>Bold</b> text'
 */
export const sanitizeInput = (input, config = {}) => {
    // Return non-string values as-is (numbers, booleans, null, undefined don't need sanitization)
    if (input === null || input === undefined || typeof input !== 'string') {
        return input;
    }

    // Merge provided config with defaults
    const mergedConfig = { ...defaultConfig, ...config };

    try {
        // Sanitize the input and trim whitespace
        const sanitized = DOMPurify.sanitize(input, mergedConfig).trim();
        return sanitized;
    } catch (error) {
        console.error('[Sanitize] Sanitization failed:', error);
        return input; // Fallback to original input
    }
};

/**
 * Sanitizes multiple fields in an object
 * 
 * @param {Object} obj - The object containing fields to sanitize
 * @param {Array<string>} fieldsToSanitize - Array of field names to sanitize. If empty, sanitizes all string fields
 * @returns {Object} A new object with sanitized fields
 * 
 * @example
 * // Sanitize specific fields
 * const data = { name: '<script>xss</script>John', age: 25, role: 'admin' };
 * const clean = sanitizeObject(data, ['name', 'role']);
 * // Returns: { name: 'John', age: 25, role: 'admin' }
 * 
 * @example
 * // Sanitize all string fields
 * const data = { name: '<b>John</b>', age: 25 };
 * const clean = sanitizeObject(data);
 * // Returns: { name: 'John', age: 25 }
 */
export const sanitizeObject = (obj, fieldsToSanitize = []) => {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    // Create a new object to avoid mutating the original
    const sanitized = { ...obj };

    // Determine which fields to sanitize
    const shouldSanitizeAll = fieldsToSanitize.length === 0;

    for (const key in sanitized) {
        if (!sanitized.hasOwnProperty(key)) continue;

        const value = sanitized[key];
        const shouldSanitize = shouldSanitizeAll 
            ? typeof value === 'string' 
            : fieldsToSanitize.includes(key);

        if (shouldSanitize && typeof value === 'string') {
            sanitized[key] = sanitizeInput(value);
        }
    }

    return sanitized;
};

/**
 * Vue composable for using sanitization functions in components
 * 
 * @returns {Object} Object containing sanitization functions
 * 
 * @example
 * // In a Vue component
 * import { useSanitize } from '@/utils/sanitize';
 * 
 * const { sanitizeInput, sanitizeObject } = useSanitize();
 * const cleanName = sanitizeInput(userInput.value);
 */
export const useSanitize = () => {
    return {
        sanitizeInput,
        sanitizeObject
    };
};
