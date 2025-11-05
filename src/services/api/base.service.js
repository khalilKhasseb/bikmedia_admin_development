import http from '../http.js';
import { handleApiError, createLocalizedError } from '../../utils/error-handler.js';

/**
 * BaseService Class
 * 
 * Foundation class for all API resource services. Provides reusable CRUD methods
 * and abstracts HTTP mechanics, allowing resource services to focus on business logic.
 * Includes localized error handling for better user experience.
 * 
 * @example
 * // Create a simple resource service
 * const giftService = new BaseService('/dashboard/gifts');
 * 
 * // Or extend for custom behavior
 * class UserService extends BaseService {
 *   constructor() {
 *     super('/dashboard/users');
 *   }
 *   
 *   async getActive() {
 *     return this.post('/list', { status: 'active' });
 *   }
 * }
 */
class BaseService {
  /**
   * Creates a new BaseService instance
   * 
   * @param {string} resourcePath - The base endpoint path for the resource (e.g., '/dashboard/gifts')
   * @param {Object} httpClient - Optional custom axios instance (defaults to main http client)
   * @param {Object} options - Configuration options
   * @param {boolean} options.enableErrorLocalization - Enable automatic error localization (default: true)
   * @param {string} options.errorFallbackKey - Default fallback translation key for errors
   */
  constructor(resourcePath = '', httpClient = null, options = {}) {
    this.resourcePath = resourcePath;
    this.http = httpClient || http;
    this.options = {
      enableErrorLocalization: true,
      errorFallbackKey: 'bikmedia.messages.errors.unknown',
      ...options
    };
  }

  /**
   * Safely joins resource path and endpoint, preventing double slashes
   * 
   * @private
   * @param {string} endpoint - Endpoint path to append
   * @returns {string} Properly joined URL path
   */
  _buildUrl(endpoint = '') {
    // Remove trailing slash from resourcePath
    const basePath = this.resourcePath.replace(/\/$/, '');
    
    // Ensure endpoint starts with single leading slash if not empty
    const endpointPath = endpoint ? (endpoint.startsWith('/') ? endpoint : `/${endpoint}`) : '';
    
    return `${basePath}${endpointPath}`;
  }

  /**
   * Handles errors with localization if enabled
   * 
   * @private
   * @param {Error} error - The error to handle
   * @param {string} fallbackKey - Optional fallback translation key
   * @returns {Error} Processed error (localized if enabled)
   */
  _handleError(error, fallbackKey = null) {
    if (!this.options.enableErrorLocalization) {
      return error;
    }

    const translationKey = fallbackKey || this.options.errorFallbackKey;
    return createLocalizedError(error, translationKey);
  }

  /**
   * Wraps HTTP requests with error handling
   * 
   * @private
   * @param {Promise} requestPromise - The axios request promise
   * @param {string} fallbackKey - Optional fallback translation key for errors
   * @returns {Promise} Request promise with error handling
   */
  async _executeRequest(requestPromise, fallbackKey = null) {
    try {
      return await requestPromise;
    } catch (error) {
      throw this._handleError(error, fallbackKey);
    }
  }

  /**
   * Performs a GET request
   * 
   * @param {string} endpoint - Additional endpoint path to append to resourcePath
   * @param {Object} params - Query parameters to include in the request
   * @param {string} errorFallbackKey - Optional fallback translation key for errors
   * @returns {Promise} Axios promise with the response
   * 
   * @example
   * const response = await service.get('/list', { page: 1, limit: 10 });
   */
  get(endpoint = '', params = {}, errorFallbackKey = null) {
    const url = this._buildUrl(endpoint);
    const requestPromise = this.http.get(url, { params });
    return this._executeRequest(requestPromise, errorFallbackKey || 'bikmedia.messages.errors.failedToLoad');
  }

  /**
   * Performs a POST request
   * 
   * @param {string} endpoint - Additional endpoint path to append to resourcePath
   * @param {Object} data - Request body data (will be transformed to URL-encoded by http client)
   * @param {Object} config - Optional axios config for custom headers or other options
   * @param {string} errorFallbackKey - Optional fallback translation key for errors
   * @returns {Promise} Axios promise with the response
   * 
   * @example
   * const response = await service.post('/create', { name: 'Gift', price: 100 });
   */
  post(endpoint = '', data = {}, config = {}, errorFallbackKey = null) {
    const url = this._buildUrl(endpoint);
    const requestPromise = this.http.post(url, data, config);
    return this._executeRequest(requestPromise, errorFallbackKey || 'bikmedia.messages.errors.failedToCreate');
  }

  /**
   * Performs a PUT request
   * 
   * @param {string} endpoint - Additional endpoint path to append to resourcePath
   * @param {Object} data - Request body data (will be transformed to URL-encoded by http client)
   * @param {Object} config - Optional axios config for custom headers or other options
   * @param {string} errorFallbackKey - Optional fallback translation key for errors
   * @returns {Promise} Axios promise with the response
   * 
   * @example
   * const response = await service.put('/update/123', { name: 'Updated Gift' });
   */
  put(endpoint = '', data = {}, config = {}, errorFallbackKey = null) {
    const url = this._buildUrl(endpoint);
    const requestPromise = this.http.put(url, data, config);
    return this._executeRequest(requestPromise, errorFallbackKey || 'bikmedia.messages.errors.failedToUpdate');
  }

  /**
   * Performs a DELETE request
   * 
   * @param {string} endpoint - Additional endpoint path to append to resourcePath
   * @param {Object} data - Optional request body data for DELETE operations that require it
   * @param {string} errorFallbackKey - Optional fallback translation key for errors
   * @returns {Promise} Axios promise with the response
   * 
   * @example
   * const response = await service.delete('/remove/123');
   */
  delete(endpoint = '', data = {}, errorFallbackKey = null) {
    const url = this._buildUrl(endpoint);
    const requestPromise = this.http.delete(url, { data });
    return this._executeRequest(requestPromise, errorFallbackKey || 'bikmedia.messages.errors.failedToDelete');
  }

  /**
   * Performs a PATCH request
   * 
   * @param {string} endpoint - Additional endpoint path to append to resourcePath
   * @param {Object} data - Request body data (will be transformed to URL-encoded by http client)
   * @param {Object} config - Optional axios config for custom headers or other options
   * @param {string} errorFallbackKey - Optional fallback translation key for errors
   * @returns {Promise} Axios promise with the response
   * 
   * @example
   * const response = await service.patch('/update/123', { status: 'active' });
   */
  patch(endpoint = '', data = {}, config = {}, errorFallbackKey = null) {
    const url = this._buildUrl(endpoint);
    const requestPromise = this.http.patch(url, data, config);
    return this._executeRequest(requestPromise, errorFallbackKey || 'bikmedia.messages.errors.failedToUpdate');
  }

  /**
   * Performs a POST request with FormData
   * 
   * Useful for endpoints that require multipart/form-data (file uploads, etc.)
   * The http client interceptor automatically detects FormData and removes the
   * Content-Type header, allowing the browser to set the correct multipart boundary.
   * 
   * @param {string} endpoint - Additional endpoint path to append to resourcePath
   * @param {FormData} formData - FormData object containing the request data
   * @param {string} errorFallbackKey - Optional fallback translation key for errors
   * @returns {Promise} Axios promise with the response
   * 
   * @example
   * const formData = new FormData();
   * formData.append('file', fileInput.files[0]);
   * formData.append('name', 'Document');
   * const response = await service.postFormData('/upload', formData);
   */
  postFormData(endpoint = '', formData, errorFallbackKey = null) {
    const url = this._buildUrl(endpoint);
    const requestPromise = this.http.post(url, formData);
    return this._executeRequest(requestPromise, errorFallbackKey || 'bikmedia.messages.errors.failedToCreate');
  }
}

export default BaseService;
