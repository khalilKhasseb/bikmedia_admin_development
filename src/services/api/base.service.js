import http from '../http.js';

/**
 * BaseService Class
 * 
 * Foundation class for all API resource services. Provides reusable CRUD methods
 * and abstracts HTTP mechanics, allowing resource services to focus on business logic.
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
   */
  constructor(resourcePath = '', httpClient = null) {
    this.resourcePath = resourcePath;
    this.http = httpClient || http;
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
   * Performs a GET request
   * 
   * @param {string} endpoint - Additional endpoint path to append to resourcePath
   * @param {Object} params - Query parameters to include in the request
   * @returns {Promise} Axios promise with the response
   * 
   * @example
   * const response = await service.get('/list', { page: 1, limit: 10 });
   */
  get(endpoint = '', params = {}) {
    const url = this._buildUrl(endpoint);
    return this.http.get(url, { params });
  }

  /**
   * Performs a POST request
   * 
   * @param {string} endpoint - Additional endpoint path to append to resourcePath
   * @param {Object} data - Request body data (will be transformed to URL-encoded by http client)
   * @param {Object} config - Optional axios config for custom headers or other options
   * @returns {Promise} Axios promise with the response
   * 
   * @example
   * const response = await service.post('/create', { name: 'Gift', price: 100 });
   */
  post(endpoint = '', data = {}, config = {}) {
    const url = this._buildUrl(endpoint);
    return this.http.post(url, data, config);
  }

  /**
   * Performs a PUT request
   * 
   * @param {string} endpoint - Additional endpoint path to append to resourcePath
   * @param {Object} data - Request body data (will be transformed to URL-encoded by http client)
   * @param {Object} config - Optional axios config for custom headers or other options
   * @returns {Promise} Axios promise with the response
   * 
   * @example
   * const response = await service.put('/update/123', { name: 'Updated Gift' });
   */
  put(endpoint = '', data = {}, config = {}) {
    const url = this._buildUrl(endpoint);
    return this.http.put(url, data, config);
  }

  /**
   * Performs a DELETE request
   * 
   * @param {string} endpoint - Additional endpoint path to append to resourcePath
   * @param {Object} data - Optional request body data for DELETE operations that require it
   * @returns {Promise} Axios promise with the response
   * 
   * @example
   * const response = await service.delete('/remove/123');
   */
  delete(endpoint = '', data = {}) {
    const url = this._buildUrl(endpoint);
    return this.http.delete(url, { data });
  }

  /**
   * Performs a PATCH request
   * 
   * @param {string} endpoint - Additional endpoint path to append to resourcePath
   * @param {Object} data - Request body data (will be transformed to URL-encoded by http client)
   * @param {Object} config - Optional axios config for custom headers or other options
   * @returns {Promise} Axios promise with the response
   * 
   * @example
   * const response = await service.patch('/update/123', { status: 'active' });
   */
  patch(endpoint = '', data = {}, config = {}) {
    const url = this._buildUrl(endpoint);
    return this.http.patch(url, data, config);
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
   * @returns {Promise} Axios promise with the response
   * 
   * @example
   * const formData = new FormData();
   * formData.append('file', fileInput.files[0]);
   * formData.append('name', 'Document');
   * const response = await service.postFormData('/upload', formData);
   */
  postFormData(endpoint = '', formData) {
    const url = this._buildUrl(endpoint);
    return this.http.post(url, formData);
  }
}

export default BaseService;
