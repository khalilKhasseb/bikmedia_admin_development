/**
 * Author: Khalil Khasseb
 * Date: 2025-10-24
 * Version: 1.0.0
*/
import axios from 'axios';
import { clearAuthStorage, getAuthToken } from '../utils/auth-storage';

const http = axios.create({
    baseURL: "/api",
    headers: {
        'API-KEY': import.meta.env.VITE_API_KEY,
        // 'Auth-Token': import.meta.env.VITE_AUTH_TOKEN
        // Auth-Token is added dynamically in request interceptor when user is authenticated
    },
});

http.interceptors.request.use(
    (config) => {
        // Retrieve and decrypt auth token from storage (checks both sessionStorage and localStorage)
        const token = getAuthToken();

       
        if (token) {
            console.log('Auth-Token:', token);
            config.headers['Auth-Token'] = String(token);
        }
        // Note: We don't set Auth-Token if no token exists, avoiding default env value

        // Transform request body to URL-encoded format for POST, PUT, PATCH
        if (config.data && typeof config.data === 'object' &&
            ['post', 'put', 'patch'].includes(config.method.toLowerCase())) {

            // Handle FormData: delete Content-Type to let browser set multipart boundary
            if (config.data instanceof FormData) {
                delete config.headers['Content-Type'];
                return config;
            }

            // Handle URLSearchParams: set urlencoded Content-Type
            if (config.data instanceof URLSearchParams) {
                config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
                return config;
            }

            // Serialize plain objects with support for arrays and nested objects
            const serialize = (obj, prefix = '') => {
                const pairs = [];
                for (const key in obj) {
                    if (!obj.hasOwnProperty(key)) continue;
                    const value = obj[key];

                    // Skip null/undefined or convert to empty string per API expectations
                    if (value === null || value === undefined) {
                        pairs.push(`${encodeURIComponent(prefix ? `${prefix}[${key}]` : key)}=`);
                        continue;
                    }

                    const fullKey = prefix ? `${prefix}[${key}]` : key;

                    if (Array.isArray(value)) {
                        // Handle arrays
                        value.forEach((item, index) => {
                            if (typeof item === 'object' && item !== null) {
                                pairs.push(serialize(item, `${fullKey}[${index}]`));
                            } else {
                                pairs.push(`${encodeURIComponent(`${fullKey}[${index}]`)}=${encodeURIComponent(item ?? '')}`);
                            }
                        });
                    } else if (typeof value === 'object' && value !== null) {
                        // Handle nested objects
                        pairs.push(serialize(value, fullKey));
                    } else {
                        // Handle primitive values
                        pairs.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`);
                    }
                }
                return pairs.filter(p => p).join('&');
            };

            config.data = serialize(config.data);
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        }

        // Development mode logging
        if (import.meta.env.DEV) {
            console.log('[HTTP Request]', config.method.toUpperCase(), config.url, config);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    (response) => {
        // Development mode logging
        if (import.meta.env.DEV) {
            console.log('[HTTP Response]', response.status, response.config.url, response.data);
        }
        return response;
    },
    (error) => {
        // Development mode error logging
        if (import.meta.env.DEV) {
            console.error('[HTTP Error]', error);
        }

        if (error.response) {
            const status = error.response.status;

            switch (status) {
                case 401:
                    // Unauthorized - Clear storage and redirect to login
                    console.error('Unauthorized: Token expired or invalid. Redirecting to login...');
                    clearAuthStorage();

                    // Lazy import router to avoid circular dependency
                    import('../router/index.js').then(({ default: router }) => {
                        // Guard against duplicate redirects
                        if (router.currentRoute.value.path !== '/auth/login') {
                            router.replace('/auth/login');
                        }
                    }).catch(error => {
                        console.error('Failed to import router for redirect:', error);
                        // Fallback: redirect using window.location
                        if (window.location.pathname !== '/auth/login') {
                            window.location.href = '/auth/login';
                        }
                    });
                    break;

                case 403:
                    // Forbidden - Insufficient permissions
                    console.error('Forbidden: You do not have permission to access this resource.');
                    break;

                case 500:
                    // Internal Server Error
                    console.error('Internal Server Error: Something went wrong on the server.');
                    break;

                default:
                    // Other errors
                    console.error(`HTTP Error ${status}:`, error.response.data);
                    break;
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error('Network Error: No response received from server.');
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }

        return Promise.reject(error);
    }
);

/**
 * HTTP Admin Client
 * 
 * Dedicated axios instance for admin endpoints (/admin/*).
 * Uses /apiAdmin base URL which proxies to /admin on the backend.
 * Shares the same interceptors as the main http client.
 */
const httpAdmin = axios.create({
    baseURL: "/apiAdmin",
    headers: {
        'API-KEY': import.meta.env.VITE_API_KEY
        // Auth-Token is added dynamically in request interceptor when user is authenticated
    },
});

// Apply the same request interceptor to httpAdmin
httpAdmin.interceptors.request.use(
    http.interceptors.request.handlers[0].fulfilled,
    http.interceptors.request.handlers[0].rejected
);

// Apply the same response interceptor to httpAdmin
httpAdmin.interceptors.response.use(
    http.interceptors.response.handlers[0].fulfilled,
    http.interceptors.response.handlers[0].rejected
);

export default http;
export { httpAdmin };