/**
 * Crypto Utility for Token Encryption/Decryption
 * 
 * Purpose: Client-side token obfuscation using AES encryption with passphrase
 * 
 * Implementation: CryptoJS accepts any passphrase length and uses PBKDF2 internally
 * to derive encryption keys. The passphrase is stored in environment variables.
 * 
 * SECURITY NOTE: This is NOT true security, only obfuscation.
 * - Tokens can still be extracted by determined attackers with access to client code
 * - The encryption passphrase is stored in the bundled JavaScript (visible to anyone)
 * - This provides protection against casual inspection and basic XSS attacks
 * 
 * Use case: Protects against casual inspection of localStorage/sessionStorage
 * 
 * Recommendation: Always use HTTPS in production to protect tokens in transit
 * 
 * Author: Khalil Khasseb
 * Date: 2025-10-26
 */

import CryptoJS from 'crypto-js';

/**
 * Encrypts a token using AES-256 encryption
 * 
 * @param {string} token - The authentication token to encrypt
 * @returns {string} The encrypted token string, or the original token if encryption fails
 * 
 * @example
 * const encrypted = encryptToken('my-auth-token-123');
 * localStorage.setItem('authToken', encrypted);
 */
export const encryptToken = (token) => {
    if (!token) {
        return token;
    }

    // TEMPORARY: Disable encryption for development
    // Remove this after clearing browser storage and testing
    if (import.meta.env.DEV) {
        console.warn('[Crypto] Encryption temporarily disabled for development');
        return token;
    }

    const key = import.meta.env.VITE_ENCRYPTION_KEY;
    
    // Fallback for development if no key is configured
    if (!key) {
        if (import.meta.env.DEV) {
            console.warn('[Crypto] No encryption key configured. Token will be stored unencrypted.');
        }
        return token;
    }

    try {
        const encrypted = CryptoJS.AES.encrypt(token, key).toString();
        return encrypted;
    } catch (error) {
        console.error('[Crypto] Encryption failed:', error);
        return token; // Fallback to unencrypted token
    }
};

/**
 * Decrypts an encrypted token using AES-256 decryption
 * 
 * Backward Compatibility: If decryption fails, checks if the token is plaintext
 * (e.g., JWT with three dot-separated parts or alphanumeric token) and returns it as-is.
 * This allows existing plaintext tokens to continue working during migration.
 * 
 * @param {string} encryptedToken - The encrypted token string (or plaintext for backward compatibility)
 * @returns {string|null} The decrypted token string, plaintext token, or null if invalid
 * 
 * @example
 * const encrypted = localStorage.getItem('authToken');
 * const token = decryptToken(encrypted);
 * if (token) {
 *   // Use the token
 * }
 */
export const decryptToken = (encryptedToken) => {
    if (!encryptedToken) {
        return null;
    }

    const key = import.meta.env.VITE_ENCRYPTION_KEY;
    
    // If no key is configured, assume token is not encrypted
    if (!key) {
        if (import.meta.env.DEV) {
            console.warn('[Crypto] No encryption key configured. Assuming token is not encrypted.');
        }
        return encryptedToken;
    }

    try {
        const decrypted = CryptoJS.AES.decrypt(encryptedToken, key);
        const token = decrypted.toString(CryptoJS.enc.Utf8);
        
        // If decryption results in empty string, check for plaintext token (backward compatibility)
        if (!token) {
            // Check if encryptedToken matches plaintext token patterns
            // JWT pattern: three dot-separated base64 segments
            const isJWT = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(encryptedToken);
            // Alphanumeric token pattern (common for API tokens, at least 10 chars)
            const isAlphanumeric = /^[A-Za-z0-9_-]{10,}$/.test(encryptedToken);
            // Mixed alphanumeric with special chars (common API token format)
            const isApiToken = /^[A-Za-z0-9]{10,}$/.test(encryptedToken);
            
            if (isJWT || isAlphanumeric || isApiToken) {
                if (import.meta.env.DEV) {
                    console.warn('[Crypto] Decryption failed, but token appears to be plaintext. Using as-is for backward compatibility.');
                }
                return encryptedToken; // Return plaintext token
            }
            
            console.error('[Crypto] Decryption resulted in empty string and token does not match plaintext patterns.');
            return null;
        }
        
        return token;
    } catch (error) {
        // Decryption threw an error, check for plaintext token (backward compatibility)
        const isJWT = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(encryptedToken);
        const isAlphanumeric = /^[A-Za-z0-9_-]{10,}$/.test(encryptedToken);
        const isApiToken = /^[A-Za-z0-9]{10,}$/.test(encryptedToken);
        
        if (isJWT || isAlphanumeric || isApiToken) {
            if (import.meta.env.DEV) {
                console.warn('[Crypto] Decryption exception, but token appears to be plaintext. Using as-is for backward compatibility.');
            }
            return encryptedToken; // Return plaintext token
        }
        
        console.error('[Crypto] Decryption failed:', error);
        return null;
    }
};
