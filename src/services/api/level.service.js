import BaseService from './base.service.js';
import {
  transformListResponse,
  transformSingleResponse,
  transformErrorResponse,
  buildQueryParams
} from './utils/transformers.js';

/**
 * Level Service
 * 
 * Handles level-related API operations. Currently, only read operations are supported
 * as the API does not provide edit/update endpoints for levels in the current version.
 * 
 * @class LevelService
 * @extends BaseService
 * 
 * Available Methods:
 * - getAll(filters): Fetch list of all levels
 * - getById(id, lang): Fetch a single level by ID with optional locale
 * 
 * Note: Update and delete methods are not available in the current API version.
 * These may be added in future API releases. Levels are read-only entities. Only read
 * operations (getAll, getById) are supported.
 * 
 * @example
 * // In Vuex action
 * import apiServices from '@/services/api';
 * 
 * async fetchLevels({ commit }) {
 *   try {
 *     const { items } = await apiServices.level.getAll();
 *     commit('SET_LEVELS', items);
 *   } catch (error) {
 *     console.error('Failed to fetch levels:', error);
 *   }
 * }
 * 
 * @see Postman API Documentation: POST /dashboard/levels (index)
 */
class LevelService extends BaseService {
  constructor() {
    super('/levels');
  }

  /**
   * Get all levels
   * 
   * Fetches the complete list of levels from the API.
   * Currently, the API accepts an empty body, but this method supports
   * optional filter parameters for future extensibility.
   * 
   * @param {Object} [filters={}] - Optional filter parameters for future use
   * @returns {Promise<Object>} Promise resolving to normalized response with items array
   * @returns {Array} returns.items - Array of level objects
   * @returns {Object} returns.raw - Raw API response data
   * 
   * @throws {Error} Normalized error object with message and details
   * 
   * @example
   * // Fetch all levels
   * const { items } = await levelService.getAll();
   * console.log('Total levels:', items.length);
   * 
   * @example
   * // Fetch with potential future filters
   * const { items } = await levelService.getAll({
   *   minLevel: 10,
   *   maxLevel: 50
   * });
   * 
   * @example
   * // Use in component
   * async mounted() {
   *   try {
   *     const { items } = await this.$store.dispatch('levels/fetchLevels');
   *     this.levels = items;
   *   } catch (error) {
   *     this.$notify.error('Failed to load levels');
   *   }
   * }
   */
  async getAll(filters = {}) {
    try {
      // Clean parameters (remove null/undefined values)
      const cleanedParams = buildQueryParams(filters || {});
      
      // Make POST request to /dashboard/levels
      const response = await this.post('', cleanedParams);
      
      // Transform and return list response
      return transformListResponse(response);
    } catch (error) {
      // Normalize error and re-throw
      const normalizedError = transformErrorResponse(error);
      throw normalizedError;
    }
  }

  /**
   * Get a single level by ID
   *
   * Fetches a specific level by its ID with optional locale support. Returns level data
   * including nested level object with name and icon variations.
   *
   * TODO: The API should support the ?lang= query parameter to return localized content
   * based on the requested locale (e.g., ?lang=en or ?lang=ar). Currently, this method
   * accepts the lang parameter but the API may not use it yet.
   *
   * @param {number|string} id - Level ID to fetch
   * @param {string} [lang] - Optional locale code (e.g., 'en', 'ar') for localized content
   * @returns {Promise<Object>} Promise resolving to normalized response with single item
   * @returns {Object} returns.item - Level object with nested level data
   * @returns {number} returns.item.id - Level ID
   * @returns {number} returns.item.lid - Level identifier
   * @returns {number} returns.item.lvl - Level number
   * @returns {number} returns.item.target - Target points required
   * @returns {Object} returns.item.level - Nested level object
   * @returns {string} returns.item.level.name - Level name (localized)
   * @returns {string} returns.item.level.icon - Active icon URL
   * @returns {string} returns.item.level.icon_disable - Disabled icon URL
   * @returns {string} returns.item.level.icon_anim - Animated icon URL
   * @returns {Object} returns.raw - Raw API response data
   *
   * @throws {Error} Normalized error object with message and details
   *
   * @example
   * // Fetch level by ID without locale
   * const { item } = await levelService.getById(5);
   *
   * @example
   * // Fetch level with Arabic locale for localized name
   * const { item } = await levelService.getById(5, 'ar');
   *
   * @example
   * // Access nested level properties
   * const { item } = await levelService.getById(5);
   * console.log(item.level.name, item.level.icon);
   */
  async getById(id, lang = null) {
    if (id === null || id === undefined || id === '') {
      throw new Error('LevelService.getById requires a valid id.');
    }

    try {
      // Clean parameters (remove null/undefined values)
      const cleanedParams = buildQueryParams({ id, lang });

      // Make POST request to /dashboard/levels
      const response = await this.post('', cleanedParams);

      // Transform and return single item response
      return transformSingleResponse(response);
    } catch (error) {
      // Normalize error and re-throw
      const normalizedError = transformErrorResponse(error);
      throw normalizedError;
    }
  }
}

// Export singleton instance
const levelService = new LevelService();
export default levelService;

// Export class for testing or advanced usage
export { LevelService };
