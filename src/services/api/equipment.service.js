import BaseService from './base.service.js';
import {
  transformListResponse,
  transformSingleResponse,
  transformErrorResponse,
  buildQueryParams
} from './utils/transformers.js';

/**
 * Equipment Service
 * 
 * Handles all equipment-related API operations including listing and updating equipment records.
 * This service supports bilingual content with English (nameEN) and Arabic (nameAR) name fields.
 * 
 * @class EquipmentService
 * @extends BaseService
 * 
 * Available Methods:
 * - getAll(filters): Fetch list of all equipment items
 * - create(formData): Create a new equipment item
 * - update(id, data): Update an existing equipment item
 * 
 * @example
 * // In Vuex action
 * import apiServices from '@/services/api';
 * 
 * async fetchEquipment({ commit }) {
 *   try {
 *     const { items } = await apiServices.equipment.getAll();
 *     commit('SET_EQUIPMENT', items);
 *   } catch (error) {
 *     console.error('Failed to fetch equipment:', error);
 *   }
 * }
 * 
 * @see Postman API Documentation:
 *   - POST /dashboard/equipment (index)
 *   - POST /dashboard/equipment/create (create)
 *   - POST /dashboard/equipment/edit (update)
 */
class EquipmentService extends BaseService {
  constructor() {
    super('/equipment');
  }

  /**
   * Get all equipment items
   * 
   * Fetches the complete list of equipment items from the API.
   * Currently, the API accepts an empty body, but this method supports
   * optional filter parameters for future extensibility.
   * 
   * @param {Object} [filters={}] - Optional filter parameters for future use
   * @returns {Promise<Object>} Promise resolving to normalized response with items array
   * @returns {Array} returns.items - Array of equipment objects
   * @returns {Object} returns.raw - Raw API response data
   * 
   * @throws {Error} Normalized error object with message and details
   * 
   * @example
   * // Fetch all equipment
   * const { items } = await equipmentService.getAll();
   * 
   * @example
   * // Fetch with potential future filters
   * const { items } = await equipmentService.getAll({
   *   type: 1,
   *   minLevel: 5
   * });
   */
  async getAll(filters = {}) {
    try {
      // Clean parameters (remove null/undefined values)
      const cleanedParams = buildQueryParams(filters || {});
      
      // Make POST request to /dashboard/equipment
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
   * Get a single equipment item by ID
   * 
   * Fetches a specific equipment item by its ID with optional locale support.
   * 
   * TODO: The API should support the ?lang= query parameter to return localized
   * content based on the requested locale (e.g., ?lang=en or ?lang=ar).
   * Currently, this method accepts the lang parameter but the API may not use it yet.
   * 
   * @param {number|string} id - Equipment ID to fetch
   * @param {string} [lang] - Optional locale code (e.g., 'en', 'ar') for localized content
   * @returns {Promise<Object>} Promise resolving to normalized response with single item
   * @returns {Object} returns.item - Equipment object
   * @returns {Object} returns.raw - Raw API response data
   * 
   * @throws {Error} Normalized error object with message and details
   * 
   * @example
   * // Fetch equipment by ID
   * const { item } = await equipmentService.getById(123);
   * 
   * @example
   * // Fetch equipment with locale
   * const { item } = await equipmentService.getById(123, 'ar');
   */
  async getById(id, lang = null) {
    try {
      // Build query parameters
      const params = { id };
      if (lang) {
        params.lang = lang;
      }
      
      // Clean parameters (remove null/undefined values)
      const cleanedParams = buildQueryParams(params);
      
      // Make POST request to /dashboard/equipment with id parameter
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
   * Create a new equipment item
   * 
   * Creates a new equipment record with the provided FormData. Supports bilingual names
   * (English and Arabic), file uploads (icon, animation), and various equipment properties
   * including coin value, duration, type, level requirement, and VIP status.
   * 
   * @param {FormData} formData - FormData object containing equipment data and files
   * @param {string} [formData.nameEN] - Equipment name in English
   * @param {string} [formData.nameAR] - Equipment name in Arabic
   * @param {string} [formData.descriptionEN] - Equipment description in English
   * @param {string} [formData.descriptionAR] - Equipment description in Arabic
   * @param {number} [formData.coin] - Coin value/price of the equipment
   * @param {number} [formData.days] - Duration or validity period in days
   * @param {number} [formData.type] - Equipment type identifier (required)
   * @param {number} [formData.lvl] - Level requirement for the equipment
   * @param {number} [formData.vip] - VIP status or requirement
   * @param {File|string} [formData.icon] - Icon file or URL
   * @param {File|string} [formData.anim] - Animation file or URL
   * @returns {Promise<Object>} Promise resolving to normalized response with created equipment
   * @returns {Object} returns.item - Created equipment object
   * @returns {Object} returns.raw - Raw API response data
   * 
   * @throws {Error} Normalized error object with message and details
   * 
   * @example
   * // Create equipment with FormData
   * const formData = new FormData();
   * formData.append('nameEN', 'Golden Sword');
   * formData.append('nameAR', 'السيف الذهبي');
   * formData.append('coin', 1000);
   * formData.append('type', 1);
   * formData.append('icon', iconFile);
   * 
   * const { item } = await equipmentService.create(formData);
   */
  async create(formData) {
    try {
      // Make POST request to /dashboard/equipment/edit with FormData (API expects same endpoint for create without id)
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
   * Update an existing equipment item
   * 
   * Updates an equipment record with the provided data. Supports bilingual names
   * (English and Arabic), descriptions, file uploads (icon, animation), and various
   * equipment properties including coin value, duration, type, animation type, level
   * requirement, and VIP status. Accepts either a plain object payload or a FormData
   * instance when file uploads are required.
   * 
   * Note: The id parameter is optional based on the API documentation showing it
   * as disabled in some cases. If provided, it will be included in the request.
   * 
   * @param {number} [id] - Equipment ID to update (optional)
   * @param {Object|FormData} data - Equipment data to update (required)
   * @param {string} [data.nameEN] - Equipment name in English
   * @param {string} [data.nameAR] - Equipment name in Arabic
   * @param {string} [data.descriptionEN] - Equipment description in English
   * @param {string} [data.descriptionAR] - Equipment description in Arabic
   * @param {number} [data.coin] - Coin value/price of the equipment
   * @param {number} [data.days] - Duration or validity period in days
   * @param {number} [data.type] - Equipment type identifier
   * @param {number} [data.anim_type] - Animation type for the equipment
   * @param {number} [data.lvl] - Level requirement for the equipment
   * @param {number} [data.vip] - VIP status or requirement
   * @param {File|string} [data.icon] - Icon file or URL (use FormData when supplying files)
   * @param {File|string} [data.anim] - Animation file or URL (use FormData when supplying files)
   * @returns {Promise<Object>} Promise resolving to normalized response with updated equipment
   * @returns {Object} returns.item - Updated equipment object
   * @returns {Object} returns.raw - Raw API response data
   * 
   * @throws {Error} Normalized error object with message and details
   * 
   * @example
   * // Update equipment with object payload
   * const { item } = await equipmentService.update(11, {
   *   nameEN: 'Golden Sword',
   *   nameAR: 'السيف الذهبي',
   *   coin: 1000
   * });
   * 
   * @example
   * // Update equipment with FormData payload including files
   * const formData = new FormData();
   * formData.append('nameEN', 'Diamond Armor');
   * formData.append('nameAR', 'درع الماس');
   * formData.append('coin', 2000);
   * formData.append('type', 1);
   * formData.append('icon', iconFile);
   * const { item } = await equipmentService.update(11, formData);
   */
  async update(id, data) {
    try {
      const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

      if (isFormData) {
        if (typeof data.delete === 'function') {
          data.delete('id');
        }

        if (id !== undefined && id !== null) {
          if (typeof data.set === 'function') {
            data.set('id', id);
          } else {
            data.append('id', id);
          }
        }

        // Make POST request to /dashboard/equipment/edit with FormData payload
        const response = await this.postFormData('/edit', data);

        // Transform and return single item response
        return transformSingleResponse(response);
      }

      // Create payload, conditionally including id if not null/undefined (allows id=0)
      const payload = {
        ...(id !== undefined && id !== null && { id }),
        ...data
      };
      
      // Make POST request to /dashboard/equipment/edit
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
   * Delete an equipment item
   * 
   * Deletes an equipment record by its ID. The API returns a structured response
   * with success/error codes that need to be handled appropriately.
   * 
   * @param {number|string} itemId - Equipment ID to delete (required)
   * @returns {Promise<Object>} Promise resolving to raw API response for success/error handling
   * @returns {Object} returns.data - API response data
   * @returns {number} returns.data.code - Response code (200 for success, 201 for errors)
   * @returns {string|null} returns.data.err - Error message (null for success, "notFound" for missing item)
   * @returns {Object} returns.data.data - Response payload (contains success: 1 for successful deletion)
   * 
   * @throws {Error} Normalized error object with message and details
   * 
   * @example
   * // Delete an equipment item
   * try {
   *   const response = await equipmentService.delete(123);
   *   if (response.data?.code === 200 && response.data?.err === null) {
   *     console.log('Equipment deleted successfully');
   *   }
   * } catch (error) {
   *   console.error('Failed to delete equipment:', error.message);
   * }
   */
  async delete(itemId) {
    if (itemId === null || itemId === undefined || itemId === '') {
      throw new Error('EquipmentService.delete requires a valid itemId.');
    }

    try {
      // Create FormData with the item ID
      const formData = new FormData();
      formData.append('id', itemId);

      // Make POST request to /dashboard/equipment/delete with FormData payload
      const response = await this.postFormData('/delete', formData);

      // Return raw response for component-level success/error handling
      return response;
    } catch (error) {
      // Normalize error and re-throw
      const normalizedError = transformErrorResponse(error);
      throw normalizedError;
    }
  }
}

// Export singleton instance
const equipmentService = new EquipmentService();
export default equipmentService;

// Export class for testing or advanced usage
export { EquipmentService };
