/**
 * Authentication Service
 * 
 * Note: This service does not extend BaseService because authentication
 * has unique requirements including storage management, Vuex integration,
 * router navigation, and remember-me functionality that don't fit the
 * standard resource service pattern.
 * 
 * For standard API resources, see src/services/api/README.md
 * 
 * Author: Khalil Khasseb
 * Date: 2025-10-24
 * Version: 1.0.0
 */

/**
 * ============================================================================
 * SECURITY CONSIDERATIONS
 * ============================================================================
 * 
 * 1. TOKEN STORAGE SECURITY:
 *    - Tokens are encrypted using AES-256 before storing in localStorage/sessionStorage
 *    - Encryption key is stored in environment variables (VITE_ENCRYPTION_KEY)
 *    - This provides obfuscation against casual inspection and basic XSS attacks
 *    - WARNING: Client-side encryption is NOT true security. Determined attackers
 *      with access to client code can still extract tokens.
 *    - Always use HTTPS in production to protect tokens in transit
 * 
 * 2. TOKEN EXPIRATION:
 *    - localStorage tokens expire after 24 hours (TTL-based)
 *    - sessionStorage tokens expire when the browser session ends
 *    - Expired tokens are automatically cleared by the router guard and initializeAuth action
 *    - Token expiration is tracked in the Vuex store (tokenExpiresAt)
 * 
 * 3. XSS PROTECTION:
 *    - User inputs should be sanitized using the sanitizeInput utility from src/utils/sanitize.js
 *    - Components should sanitize inputs before passing to this service
 *    - The http client already handles request body encoding
 *    - Content Security Policy (CSP) headers in index.html provide additional XSS protection
 * 
 * 4. CSRF PROTECTION:
 *    - Not required for this API (token-based auth, no cookies)
 *    - API uses API-KEY and Auth-Token headers instead of cookies
 *    - If the backend adds cookie-based sessions in the future, implement CSRF tokens
 * 
 * 5. TOKEN REFRESH:
 *    - Currently not supported by the backend API
 *    - The validateToken function (line 110) is a placeholder for future implementation
 *    - When backend adds refresh endpoint, implement automatic token refresh before expiration
 *    - Recommended flow: Check expiration 5 minutes before TTL, call refresh endpoint, update stored token
 * 
 * 6. BEST PRACTICES:
 *    - Never log tokens in production (use import.meta.env.DEV checks)
 *    - Clear all auth data on logout (already implemented in clearAuthStorage)
 *    - Validate token on app initialization (already implemented in initializeAuth action)
 *    - Use the router guard to protect routes (already implemented in src/router/index.js)
 *    - Consider implementing rate limiting on the backend for login attempts
 * 
 * 7. KNOWN LIMITATIONS:
 *    - Client-side encryption key can be extracted from bundled JavaScript
 *    - Local storage is vulnerable to XSS attacks (mitigated by input sanitization)
 *    - No protection against physical access to the device (user should log out on shared devices)
 *    - Token refresh is not implemented (tokens expire after 24 hours)
 * 
 * ============================================================================
 */

import http from './http';
import store from '../store';
import router from '../router';
import { clearAuthStorage } from '../utils/auth-storage';
import { encryptToken } from '../utils/crypto.js';
/**
 * 
 * @param {*} username 
 * @param {*} password 
 * @returns {authToken , UserData}
 */
/**
 * Logs in a user with the provided username and password.
 * If the login is successful, the response is destructured to only return the user data.
 * 
 * Token Expiration:
 * - localStorage (rememberMe=true): 24-hour TTL (86400000ms)
 * - sessionStorage (rememberMe=false): Session-based, no expiration tracking
 * 
 * Security:
 * - Tokens are encrypted using AES-256 before storage (see src/utils/crypto.js)
 * - Encryption key is stored in .env as VITE_ENCRYPTION_KEY
 * - This is client-side obfuscation, not true security
 * - User inputs should be sanitized before calling this function
 * 
 * @param {string} username The username to log in with.
 * @param {string} password The password to log in with.
 * @param {boolean} rememberMe Whether to persist the login across sessions.
 * @param {string} lang The language code for the login request (default: 'ar').
 * @returns {Promise<Object>} A promise that resolves with the user data if the login is successful.
 */
const login = async (username, password, rememberMe = false, lang = 'ar') => {
    try {
        // Clear both storages to ensure clean state for each login attempt
        clearAuthStorage();
        const response = await http.post('/auth/login', {
            username: username,
            password: password,
            lang: lang
        });
        // If the response is ok, then perform the storage to local storage and the store
        if (response.status === 200) {
            // Check if login was successful (backend returns code: 200 for success)
            if (response.data.code !== 200) {
                console.error('Login failed: Backend returned error code', response.data.code);
                console.error('Response:', response.data);
                // return null;
            }
            
            // now destrucutre the response to only return the token and user data
            // for now we will return only the user in the user object
            // and the user object is not on local storage
            // we need to handle storage of the user data
            // console.log("statment" , user && typeof user === 'object' && !Array.isArray(user) && token);
            console.log('Login response:', response.data);
            const { data:{user,token} } = response.data;
            // const {token} = response.data;
            console.log('User:', user);
            console.log('Token:', token);
            
            // Check if user is a valid object (not an empty array)
            if (user && typeof user === 'object' && !Array.isArray(user) && token) {
                // Use dynamic storage selection based on rememberMe preference
                const storage = rememberMe ? localStorage : sessionStorage;
                storage.setItem('user', JSON.stringify(user));
                
                // Encrypt token before storing
                const encryptedToken = encryptToken(token);
                console.log('Encrypted token:', encryptedToken);
                storage.setItem('authToken', encryptedToken);
                
                // Handle token expiration for persistent logins
                if (rememberMe) {
                    // Set 24-hour expiration for localStorage logins
                    const expiresAt = Date.now() + (24 * 60 * 60 * 1000);
                    localStorage.setItem('authExpiresAt', expiresAt.toString());
                    store.commit('auth/setTokenExpiresAt', expiresAt);
                } else {
                    // Session-based logins don't expire
                    store.commit('auth/setTokenExpiresAt', null);
                }
                
                // Update Vuex store with authentication state
                store.commit('auth/setIsAuthenticated', true);
                store.commit('auth/setRememberMe', rememberMe);
                store.commit('auth/setStorageType', rememberMe ? 'local' : 'session');
                store.commit('auth/setUser', user);
            }
            
            return user || null;
        }
    } catch (error) {
        if (error.response) {
            console.log(`login failed: ${error.response.data}`);
        } else {
            console.log('login failed: network error');
        }
    }
};

const logout = () => {
    // return http.post('/logout');
    // log out by flushing user from both storage types
    clearAuthStorage();
    store.commit('auth/setUser', null);
    store.commit('auth/setIsAuthenticated', false);
    store.commit('auth/setRememberMe', false);
    store.commit('auth/setStorageType', 'session');
    store.commit('auth/setTokenExpiresAt', null);
    router.push('/auth/login');
};

/**
 * Validates an authentication token with the backend API.
 * This is a placeholder for future implementation. Currently returns true without validation.
 * @param {string} token - The authentication token to validate
 * @returns {Promise<boolean>} - True if token is valid, false otherwise
 * @note This is a placeholder for future implementation. Currently returns true without validation.
 */
const validateToken = async (token) => {
    // TODO: Implement token validation endpoint when available on backend
    // Example implementation:
    // try {
    //     const response = await http.post('/auth/validate', { token });
    //     return response.status === 200 && response.data.valid === true;
    // } catch (error) {
    //     return false;
    // }
    
    return Promise.resolve(true);
};

export default {
    login,
    logout,
    validateToken,
};
