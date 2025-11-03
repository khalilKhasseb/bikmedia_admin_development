import BaseService from './base.service.js';
import {
  transformPaginatedResponse,
  transformSingleResponse,
  transformErrorResponse,
  buildQueryParams
} from './utils/transformers.js';

/**
 * Gift Service
 * 
 * Handles all gift-related API operations including listing with pagination/search
 * and updating gift records.
 * 
 * @class GiftService
 * @extends BaseService
 * 
 * Available Methods:
 * - getAll(filters): Fetch paginated list of gifts with optional filters
 * - getById(id, lang): Fetch a single gift by ID with optional locale
 * - create(formData): Create a new gift item
 * - update(id, data): Update an existing gift
 * 
 * @example
 * // In Vuex action
 * import apiServices from '@/services/api';
 * 
 * async fetchGifts({ commit }, filters) {
 *   try {
 *     const { items, pagination } = await apiServices.gift.getAll(filters);
 *     commit('SET_GIFTS', items);
 *     commit('SET_PAGINATION', pagination);
 *   } catch (error) {
 *     console.error('Failed to fetch gifts:', error);
 *   }
 * }
 * 
 * @see Postman API Documentation: 
 *   - POST /dashboard/gifts (index)
 *   - POST /dashboard/gifts/create (create)
 *   - POST /dashboard/gifts/edit (update)
 */
class GiftService extends BaseService {
  constructor() {
    super('/gifts');
  }

  /**
   * Get all gifts with optional filters
   * 
   * Fetches a paginated list of gifts with support for language filtering,
   * search, type filtering, and pagination controls.
   * 
   * @param {Object} [filters={}] - Filter parameters
   * @param {string} [filters.lang] - Language code (e.g., 'ar', 'en')
   * @param {string} [filters.search] - Search term to filter gifts by name
   * @param {number} [filters.type] - Gift type filter
   * @param {number} [filters.limit] - Items per page for pagination
   * @param {number} [filters.p] - Page number for pagination
   * @returns {Promise<Object>} Promise resolving to normalized paginated response
   * @returns {Array} returns.items - Array of gift objects
   * @returns {Object} returns.pagination - Pagination metadata
   * @returns {number} returns.pagination.total - Total number of items
   * @returns {number} returns.pagination.page - Current page number
   * @returns {number} returns.pagination.limit - Items per page
   * @returns {number} returns.pagination.pages - Total number of pages
   * @returns {Object} returns.raw - Raw API response data
   * 
   * @throws {Error} Normalized error object with message and details
   * 
   * @example
   * // Fetch first page with default limit
   * const { items, pagination } = await giftService.getAll({ p: 1 });
   * 
   * @example
   * // Search for gifts with pagination
   * const { items, pagination } = await giftService.getAll({
   *   search: 'kiss',
   *   p: 1,
   *   limit: 10,
   *   lang: 'en'
   * });
   * 
   * @example
   * // Filter by type
   * const { items } = await giftService.getAll({
   *   type: 1,
   *   limit: 20
   * });
   */
  async getAll(filters = {}) {
    try {
      // Clean parameters (remove null/undefined values)
      const cleanedParams = buildQueryParams(filters);
      
      // Make POST request to /dashboard/gifts
      const response = await this.post('', cleanedParams);
      
      // Transform and return paginated response
      return transformPaginatedResponse(response);
    } catch (error) {
      // Normalize error and re-throw
      const normalizedError = transformErrorResponse(error);
      throw normalizedError;
    }
  }

  /**
   * Get a single gift item by ID
   *
   * Fetches a specific gift item by its ID with optional locale support.
   *
   * TODO: The API should support the ?lang= query parameter to return localized content
   * based on the requested locale (e.g., ?lang=en or ?lang=ar). Currently, this method
   * accepts the lang parameter but the API may not use it yet.
   *
   * @param {number|string} id - Gift ID to fetch
   * @param {string} [lang] - Optional locale code (e.g., 'en', 'ar') for localized content
   * @returns {Promise<Object>} Promise resolving to normalized response with single item
   * @returns {Object} returns.item - Gift object
   * @returns {Object} returns.raw - Raw API response data
   *
   * @throws {Error} Normalized error object with message and details
   *
   * @example
   * // Fetch gift by ID without locale
   * const { item } = await giftService.getById(42);
   *
   * @example
   * // Fetch gift with Arabic locale
   * const { item } = await giftService.getById(42, 'ar');
   */
  async getById(id, lang = null) {
    if (id === null || id === undefined || id === '') {
      throw new Error('GiftService.getById requires a valid id.');
    }

    try {
      // Clean parameters (remove null/undefined values)
      const cleanedParams = buildQueryParams({ id, lang });

      // Make POST request to /dashboard/gifts
      const response = await this.post('', cleanedParams);

      // Transform and return single item response
      return transformSingleResponse(response);
    } catch (error) {
      // Normalize error and re-throw
      const normalizedError = transformErrorResponse(error);
      throw normalizedError;
    }
  }

  /**
   * Create a new gift item
   *
   * Creates a new gift record with the provided FormData. Supports bilingual names (English
   * and Arabic), file uploads (icon, animation), and various gift properties including coin
   * value, type, animation type, level requirement, VIP status, list order, and mark.
   *
   * @param {FormData} formData - FormData object containing gift data and files
   * @param {string} [formData.nameEN] - Gift name in English
   * @param {string} [formData.nameAR] - Gift name in Arabic
   * @param {string} [formData.descriptionEN] - Gift description in English
   * @param {string} [formData.descriptionAR] - Gift description in Arabic
   * @param {number} [formData.coin] - Coin value/price of the gift
   * @param {number} [formData.type] - Gift type identifier (required)
   * @param {number} [formData.lvl] - Level requirement for the gift
   * @param {number} [formData.vip] - VIP status or requirement
   * @param {number} [formData.anim_type] - Animation type for the gift
   * @param {number} [formData.list_order] - Display order (lower numbers appear first)
   * @param {number} [formData.mark] - Mark value
   * @param {File|string} [formData.icon] - Icon file or URL
   * @param {File|string} [formData.anim] - Animation file or URL
   * @returns {Promise<Object>} Promise resolving to normalized response with created gift
   * @returns {Object} returns.item - Created gift object
   * @returns {Object} returns.raw - Raw API response data
   *
   * @throws {Error} Normalized error object with message and details
   *
   * @example
   * // Create gift with FormData including files
   * const formData = new FormData();
   * formData.append('nameEN', 'Golden Crown');
   * formData.append('type', 1);
   * formData.append('icon', iconFile);
   * formData.append('anim', animFile);
   * const { item } = await giftService.create(formData);
   *
   * @example
   * // Create gift with minimal required fields
   * const minimalFormData = new FormData();
   * minimalFormData.append('nameEN', 'Rose');
   * minimalFormData.append('type', 1);
   * const { item } = await giftService.create(minimalFormData);
   */
  async create(formData) {
    try {
      // Make POST request to /dashboard/gifts/create with FormData payload
      const response = await this.postFormData('/edit', formData);

      // Transform and return single item response
      return transformSingleResponse(response);
    } catch (error) {
      // Normalize error and re-throw
      const normalizedError = transformErrorResponse(error);
      throw normalizedError;
    }
  }


  /**
   * Delete a gift item
   * 
   * Deletes a gift record by its ID. The API returns a structured response
   * with success/error codes that need to be handled appropriately.
   * 
   * @param {number|string} itemId - Gift ID to delete (required)
   * @returns {Promise<Object>} Promise resolving to raw API response for success/error handling
   * @returns {Object} returns.data - API response data
   * @returns {number} returns.data.code - Response code (200 for success, 201 for errors)
   * @returns {string|null} returns.data.err - Error message (null for success, "notFound" for missing item)
   * @returns {Object} returns.data.data - Response payload (contains success: 1 for successful deletion)
   * 
   * @throws {Error} Normalized error object with message and details
   * 
   * @example
   * // Delete a gift
   * try {
   *   const response = await giftService.delete(42);
   *   if (response.data?.code === 200 && response.data?.err === null) {
   *     console.log('Gift deleted successfully');
   *   }
   * } catch (error) {
   *   console.error('Failed to delete gift:', error.message);
   * }
   */
  async delete(itemId) {
    if (itemId === null || itemId === undefined || itemId === '') {
      throw new Error('GiftService.delete requires a valid itemId.');
    }

    try {
      // Create FormData with the item ID
      const formData = new FormData();
      formData.append('id', itemId);

      // Make POST request to /dashboard/gifts/delete with FormData payload
      const response = await this.postFormData('/delete', formData);

      // Return raw response for component-level success/error handling
      return response;
    } catch (error) {
      // Normalize error and re-throw
      const normalizedError = transformErrorResponse(error);
      throw normalizedError;
    }
  }

  /**
   * Update an existing gift
   * 
   * Updates a gift record with the provided data. Supports bilingual names (English and Arabic),
   * descriptions, file uploads (icon, animation), and various gift properties including coin value,
   * type, animation type, level requirement, VIP status, list order, and mark. Accepts either a
   * plain object payload or a FormData instance when file uploads are required.
   * 
   * @param {number|string} id - Gift ID to update (required)
   * @param {Object|FormData} data - Gift data to update (required)
   * @param {string} [data.nameEN] - Gift name in English
   * @param {string} [data.nameAR] - Gift name in Arabic
   * @param {string} [data.descriptionEN] - Gift description in English
   * @param {string} [data.descriptionAR] - Gift description in Arabic
   * @param {number} [data.coin] - Coin value/price of the gift
   * @param {number} [data.type] - Gift type identifier
   * @param {number} [data.anim_type] - Animation type for the gift
   * @param {number} [data.lvl] - Level requirement for the gift
   * @param {number} [data.vip] - VIP status or requirement
   * @param {number} [data.list_order] - Display order (lower numbers appear first)
   * @param {number} [data.mark] - Mark value
   * @param {File|string} [data.icon] - Icon file or URL (use FormData when supplying files)
   * @param {File|string} [data.anim] - Animation file or URL (use FormData when supplying files)
   * @returns {Promise<Object>} Promise resolving to normalized response with updated gift
   * @returns {Object} returns.item - Updated gift object
   * @returns {Object} returns.raw - Raw API response data
   * 
   * @throws {Error} Normalized error object with message and details
   * 
   * @example
   * // Update gift with object payload
   * const { item } = await giftService.update(42, {
   *   nameEN: 'Golden Rose',
   *   nameAR: 'الوردة الذهبية',
   *   coin: 500
   * });
   * 
   * @example
   * // Update gift with FormData payload including files
   * const formData = new FormData();
   * formData.append('nameEN', 'Diamond Ring');
   * formData.append('nameAR', 'خاتم الماس');
   * formData.append('coin', 1000);
   * formData.append('type', 2);
   * formData.append('icon', iconFile);
   * const { item } = await giftService.update(42, formData);
   */
  async update(id, data) {
    if (id === null || id === undefined || id === '') {
      throw new Error('GiftService.update requires a valid id.');
    }

    try {
      const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

      if (isFormData) {
        if (typeof data.delete === 'function') {
          data.delete('id');
        }

        if (typeof data.set === 'function') {
          data.set('id', id);
        } else {
          data.append('id', id);
        }

        // Make POST request to /dashboard/gifts/edit with FormData payload
        const response = await this.postFormData('/edit', data);

        // Transform and return single item response
        return transformSingleResponse(response);
      }

      // Merge id with data for JSON payloads
      const payload = {
        ...data,
        id
      };

      // Make POST request to /dashboard/gifts/edit
      const response = await this.post('/edit', payload);

      // Transform and return single item response
      return transformSingleResponse(response);
    } catch (error) {
      // Normalize error and re-throw
      const normalizedError = transformErrorResponse(error);
      throw normalizedError;
    }
  }

  /**
   * Add a sub-gift (icon) to an existing gift
   *
   * @param {number|string} giftId
   * @param {{ file?: File, name: string }} payload
   * @returns {Promise<Object>}
   */
  async addSubGift(giftId, payload) {
    if (giftId === null || giftId === undefined || giftId === '') {
      throw new Error('GiftService.addSubGift requires a valid giftId.');
    }
    if (!payload || !payload.name) {
      throw new Error('GiftService.addSubGift requires a name.');
    }

    try {
      const form = new FormData();
      form.append('id', giftId);
      form.append('name', payload.name);
      if (payload.file) {
        form.append('icon', payload.file);
      }

      const response = await this.postFormData('/addMore', form);
      return transformSingleResponse(response);
    } catch (error) {
      const normalizedError = transformErrorResponse(error);
      throw normalizedError;
    }
  }

  async updateGoAllServer(id , data) { 

     this.post('/edit' , data);
  }
}

// Export singleton instance
const giftService = new GiftService();
export default giftService;

// Export class for testing or advanced usage
export { GiftService };
