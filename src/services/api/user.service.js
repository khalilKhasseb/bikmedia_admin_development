import BaseService from './base.service.js';
import { httpAdmin } from '../http.js';
import { transformListResponse, transformErrorResponse } from './utils/transformers.js';

/**
 * User Service
 * 
 * Handles all user-related API operations.
 * This service uses FormData for requests as required by the `/admin/user` endpoint.
 * Uses a dedicated httpAdmin client with /apiAdmin base URL that proxies to /admin.
 * 
 * @class UserService
 * @extends BaseService
 * 
 * @example
 * // In Vuex action
 * import apiServices from '@/services/api';
 * 
 * async fetchUsers({ commit }) {
 *   try {
 *     const { items } = await apiServices.user.getAll();
 *     commit('SET_USERS', items);
 *   } catch (error) {
 *     console.error('Failed to fetch users:', error);
 *   }
 * }
 * 
 * @see Postman API Documentation: POST /admin/user
 */
class UserService extends BaseService {
  constructor() {
    // Use httpAdmin client with /apiAdmin base URL (proxies to /admin)
    // Path /user resolves to /apiAdmin/user -> /admin/user
    super('/user', httpAdmin);
  }

  /**
   * Get all users
   * 
   * Fetches the complete list of users from the API.
   * This endpoint uses FormData for the request body as specified in the API documentation.
   * 
   * @param {Object} [params={}] - Optional parameters for filtering or pagination
   * @returns {Promise<Object>} Promise resolving to normalized response with items array
   * @returns {Array} returns.items - Array of user objects
   * @returns {Object} returns.raw - Raw API response data
   * 
   * @throws {Error} Normalized error object with message and details
   * 
   * @example
   * // Fetch all users
   * const { items } = await userService.getAll();
   * 
   * @example
   * // Fetch users with optional parameters
   * const { items } = await userService.getAll({ 
   *   filter: 'active',
   *   page: 1 
   * });
   */
  async getAll(params = {}) {
    try {
      // Create FormData instance as required by the API
      const formData = new FormData();
      
      // Append parameters to FormData if provided
      if (params && Object.keys(params).length > 0) {
        Object.keys(params).forEach(key => {
          if (params[key] !== null && params[key] !== undefined) {
            formData.append(key, params[key]);
          }
        });
      }
      
      // Make request using postFormData method
      const response = await this.postFormData('', formData);
      
      // Transform and return normalized response
      return transformListResponse(response);
    } catch (error) {
      // Normalize error and re-throw
      const normalizedError = transformErrorResponse(error);
      throw normalizedError;
    }
  }
}

// Export singleton instance
const userService = new UserService();
export default userService;

// Export class for testing or advanced usage
export { UserService };
