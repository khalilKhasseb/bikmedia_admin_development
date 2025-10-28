/**
 * Authentication storage utility functions
 * Provides centralized access to authentication data in browser storage
 * 
 * This module provides:
 * - Automatic encryption/decryption of tokens when stored/retrieved
 * - Consistent access to auth data across the application
 * - Use these functions instead of directly accessing localStorage/sessionStorage
 */

import { decryptToken } from './crypto.js';

/**
 * Clears authentication data from both localStorage and sessionStorage.
 * Removes 'authToken', 'user', and 'authExpiresAt' keys from both storage types.
 */
export const clearAuthStorage = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('authExpiresAt');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
};

/**
 * Retrieves and decrypts the authentication token from browser storage.
 * Checks sessionStorage first, then falls back to localStorage.
 * 
 * @returns {string|null} The decrypted authentication token, or null if not found or decryption fails
 * 
 * @example
 * const token = getAuthToken();
 * if (token) {
 *   // Use the token for API requests
 * }
 */
export const getAuthToken = () => {
    // Check sessionStorage first, then fall back to localStorage
    const encryptedToken = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    
    if (!encryptedToken) {
        return null;
    }
    
    // Decrypt and return the token
    const token = decryptToken(encryptedToken);
    return token;
};

/**
 * Retrieves the user object from browser storage.
 * Checks sessionStorage first, then falls back to localStorage.
 * 
 * @returns {Object|null} The parsed user object, or null if not found or parsing fails
 * 
 * @example
 * const user = getStoredUser();
 * if (user) {
 *   console.log(user.name);
 * }
 */
export const getStoredUser = () => {
    // Check sessionStorage first, then fall back to localStorage
    const userJson = sessionStorage.getItem('user') || localStorage.getItem('user');
    
    if (!userJson) {
        return null;
    }
    
    // Parse the JSON with error handling
    try {
        const user = JSON.parse(userJson);
        return user;
    } catch (error) {
        console.error('[Auth Storage] Failed to parse user data:', error);
        return null;
    }
};
