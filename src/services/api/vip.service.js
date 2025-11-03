import BaseService from './base.service.js';
import {
  transformErrorResponse
} from './utils/transformers.js';
import {
  transformNobleToVip,
  validateNobleApiResponse,
  validateUpdatePrivilegeParams,
  prepareNobleUpdateRequest,
  validateUpdatePrivilegeResponse
} from './utils/vip-transformers.js';
import { handleApiError } from '../../utils/error-handler.js';
import { vipErrorHandlers } from '../../utils/vip-error-handler.js';
import vipLoadingManager from '../../utils/vip-loading-manager.js';

/**
 * Unified VIP Service
 * 
 * Handles all VIP package and privilege management operations.
 * Integrates with Noble API endpoints while maintaining VIP terminology for frontend.
 * Consolidates functionality from both vip.service.js and vip-option.service.js.
 * 
 * @class VipService
 * @extends BaseService
 * 
 * Available Methods:
 * - getAll(): Fetch all VIP packages with their privileges from Noble API
 * - updatePrivilege(params): Toggle privilege on/off for a VIP package
 * 
 * @example
 * // In Vuex action
 * import apiServices from '@/services/api';
 * 
 * async fetchVipPackages({ commit }) {
 *   try {
 *     const { items } = await apiServices.vip.getAll();
 *     commit('SET_VIP_PACKAGES', items);
 *   } catch (error) {
 *     console.error('Failed to fetch VIP packages:', error);
 *   }
 * }
 */
class VipService extends BaseService {
  constructor() {
    super('/');
    
    // Configuration for retry logic
    this.retryConfig = {
      maxRetries: 3,
      retryDelay: 1000, // 1 second
      retryDelayMultiplier: 2, // Exponential backoff
      retryableErrors: ['NETWORK_ERROR', 'TIMEOUT', 'API_UNAVAILABLE', 'ECONNREFUSED', 'ENOTFOUND', 'ECONNABORTED']
    };
    
    // Use centralized loading manager
    this.loadingManager = vipLoadingManager;
  }

  /**
   * Get loading state for a specific operation
   * 
   * @param {string} operation - Operation identifier ('getAll', 'updatePrivilege')
   * @returns {boolean} Current loading state
   */
  isLoading(operation) {
    return this.loadingManager.isLoading(operation);
  }

  /**
   * Get all current loading states
   * 
   * @returns {Object} Object with all loading states
   */
  getLoadingStates() {
    return this.loadingManager.getAllLoadingStates();
  }

  /**
   * Check if any operation is currently loading
   * 
   * @returns {boolean} True if any operation is loading
   */
  isAnyLoading() {
    return this.loadingManager.isAnyLoading();
  }

  /**
   * Get loading statistics
   * 
   * @returns {Object} Statistics about current loading operations
   */
  getLoadingStatistics() {
    return this.loadingManager.getStatistics();
  }

  /**
   * Sleep utility for retry delays
   * 
   * @private
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise} Promise that resolves after the delay
   */
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if an error is retryable
   * 
   * @private
   * @param {Error} error - Error to check
   * @returns {boolean} True if error is retryable
   */
  _isRetryableError(error) {
    // Check error code
    if (error.code && this.retryConfig.retryableErrors.includes(error.code)) {
      return true;
    }
    
    // Check error message for network-related issues
    const errorMessage = error.message?.toLowerCase() || '';
    const networkKeywords = ['network', 'timeout', 'connection', 'unavailable', 'refused'];
    
    return networkKeywords.some(keyword => errorMessage.includes(keyword));
  }

  /**
   * Execute a request with retry logic
   * 
   * @private
   * @param {Function} requestFn - Function that returns a promise for the request
   * @param {string} operation - Operation identifier for loading state
   * @param {Object} options - Retry options
   * @returns {Promise} Promise that resolves with the request result
   */
  async _executeWithRetry(requestFn, operation, options = {}) {
    const config = { ...this.retryConfig, ...options };
    let lastError;
    
    const requestId = this.loadingManager.startLoading(operation, {
      maxRetries: config.maxRetries,
      retryDelay: config.retryDelay
    });
    
    try {
      for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
        try {
          const result = await requestFn();
          return result;
        } catch (error) {
          lastError = error;
          
          // Don't retry if it's the last attempt or error is not retryable
          if (attempt === config.maxRetries || !this._isRetryableError(error)) {
            throw error;
          }
          
          // Calculate delay with exponential backoff
          const delay = config.retryDelay * Math.pow(config.retryDelayMultiplier, attempt);
          
          // Log retry attempt in development
          if (import.meta.env.DEV) {
            console.warn(`[VipService] Retry attempt ${attempt + 1}/${config.maxRetries} for ${operation} after ${delay}ms`, error);
          }
          
          await this._sleep(delay);
        }
      }
    } finally {
      this.loadingManager.stopLoading(operation, requestId);
    }
    
    throw lastError;
  }

  /**
   * Validate common parameters
   * 
   * @private
   * @param {Object} params - Parameters to validate
   * @param {Array} requiredFields - Array of required field names
   * @throws {Error} If validation fails
   */
  _validateCommonParams(params, requiredFields = []) {
    if (!params || typeof params !== 'object') {
      const error = new Error('Invalid parameters: Expected an object.');
      error.code = 'INVALID_PARAMS';
      throw error;
    }

    for (const field of requiredFields) {
      if (params[field] === null || params[field] === undefined || params[field] === '') {
        const error = new Error(`Invalid parameters: Missing required field '${field}'.`);
        error.code = `MISSING_${field.toUpperCase()}`;
        throw error;
      }
    }
  }

  /**
   * Create user-friendly error messages for common scenarios
   * 
   * @private
   * @param {Error} error - Original error
   * @param {string} operation - Operation that failed
   * @returns {Error} Enhanced error with user-friendly message
   */
  _createUserFriendlyError(error, operation) {
    let userMessage = error.message;
    let errorCode = error.code || 'UNKNOWN_ERROR';

    // Map common error scenarios to user-friendly messages
    if (error.response) {
      const status = error.response.status;
      const apiError = error.response.data;

      switch (status) {
        case 401:
          userMessage = 'Authentication failed. Please check your login credentials and try again.';
          errorCode = 'AUTH_FAILED';
          break;
        case 403:
          userMessage = 'You do not have permission to perform this action.';
          errorCode = 'PERMISSION_DENIED';
          break;
        case 404:
          userMessage = operation === 'getAll' 
            ? 'VIP packages endpoint not found. Please contact support.'
            : 'The requested VIP package or privilege was not found.';
          errorCode = 'NOT_FOUND';
          break;
        case 422:
          userMessage = 'Invalid data provided. Please check your input and try again.';
          errorCode = 'VALIDATION_ERROR';
          break;
        case 429:
          userMessage = 'Too many requests. Please wait a moment and try again.';
          errorCode = 'RATE_LIMITED';
          break;
        case 500:
          userMessage = 'Server error occurred. Please try again later or contact support.';
          errorCode = 'SERVER_ERROR';
          break;
        case 502:
        case 503:
        case 504:
          userMessage = 'Service temporarily unavailable. Please try again in a few minutes.';
          errorCode = 'SERVICE_UNAVAILABLE';
          break;
        default:
          if (apiError && apiError.err) {
            userMessage = `API Error: ${apiError.err}`;
            errorCode = 'API_ERROR';
          }
      }
    } else if (error.request && !error.response) {
      userMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      errorCode = 'NETWORK_ERROR';
    } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      userMessage = 'Request timed out. Please check your connection and try again.';
      errorCode = 'TIMEOUT';
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      userMessage = 'Service is currently unavailable. Please try again later or contact support.';
      errorCode = 'API_UNAVAILABLE';
    }

    // Create enhanced error
    const enhancedError = new Error(userMessage);
    enhancedError.code = errorCode;
    enhancedError.originalError = error;
    enhancedError.operation = operation;
    enhancedError.timestamp = new Date().toISOString();

    return enhancedError;
  }

  /**
   * Get all VIP packages with their privileges
   * 
   * Fetches all VIP packages (called "noble" in API) with their associated privileges.
   * Transforms the Noble API response to frontend VIP format for consistency.
   * Includes comprehensive error handling, retry logic, and loading state management.
   * 
   * @param {Object} options - Request options
   * @param {boolean} options.skipRetry - Skip retry logic for this request
   * @param {number} options.maxRetries - Override default max retries
   * @returns {Promise<Object>} Promise resolving to normalized response
   * @returns {Array} returns.items - Array of VIP package objects with privileges
   * @returns {Object} returns.raw - Raw API response data
   * 
   * @throws {Error} Enhanced error object with user-friendly message
   * 
   * @example
   * // Fetch all VIP packages with default retry logic
   * const { items } = await vipService.getAll();
   * console.log('VIP packages:', items);
   * 
   * @example
   * // Fetch without retry logic
   * const { items } = await vipService.getAll({ skipRetry: true });
   * 
   * @example
   * // Check loading state
   * if (vipService.isLoading('getAll')) {
   *   console.log('Loading VIP packages...');
   * }
   * 
   * @example
   * // Handle errors with user-friendly messages
   * try {
   *   const { items } = await vipService.getAll();
   *   console.log('VIP packages loaded:', items.length);
   * } catch (error) {
   *   console.error('User-friendly error:', error.message);
   *   console.error('Error code:', error.code);
   * }
   */
  async getAll(options = {}) {
    const { skipRetry = false, maxRetries } = options;
    
    const requestFn = async () => {
      try {
        // Real API call to Noble endpoint
        // POST {{bikmediaURL}}/dashboard/noble with empty body (urlencoded)
        // Headers: API-KEY and Auth-Token are automatically added by HTTP interceptor
        const response = await this.post('/noble', {}, {}, 'bikmedia.messages.errors.failedToLoadVipPackages');
        
        // Validate API response structure
        validateNobleApiResponse(response);
        
        // Transform Noble API response to VIP format
        const vipPackages = transformNobleToVip(response.data.data);
        
        return {
          items: vipPackages,
          raw: response.data
        };
      } catch (error) {
        // Create user-friendly error
        const enhancedError = this._createUserFriendlyError(error, 'getAll');
        throw enhancedError;
      }
    };

    if (skipRetry) {
      const requestId = this.loadingManager.startLoading('getAll', { skipRetry: true });
      try {
        return await requestFn();
      } finally {
        this.loadingManager.stopLoading('getAll', requestId);
      }
    } else {
      const retryOptions = maxRetries !== undefined ? { maxRetries } : {};
      return await this._executeWithRetry(requestFn, 'getAll', retryOptions);
    }
  }

  /**
   * Update privilege state for a VIP package
   * 
   * Toggles a privilege on/off for a specific VIP package by calling the Noble API.
   * Includes comprehensive parameter validation, error handling, retry logic, and loading state management.
   * 
   * @param {Object} params - Privilege update parameters
   * @param {number} params.vipId - VIP package ID (called "noble ID" in API)
   * @param {number} params.privilegeId - Privilege ID to toggle
   * @param {boolean} params.isActive - New privilege state (true = add, false = remove)
   * @param {Object} options - Request options
   * @param {boolean} options.skipRetry - Skip retry logic for this request
   * @param {boolean} options.skipValidation - Skip parameter validation (use with caution)
   * @param {number} options.maxRetries - Override default max retries
   * @returns {Promise<Object>} Promise resolving to API response
   * @returns {Object} returns.data - API response data with success/error information
   * 
   * @throws {Error} Enhanced error object with user-friendly message
   * 
   * @example
   * // Enable a privilege with default retry logic
   * await vipService.updatePrivilege({
   *   vipId: 1,
   *   privilegeId: 2,
   *   isActive: true
   * });
   * 
   * @example
   * // Disable a privilege without retry
   * await vipService.updatePrivilege({
   *   vipId: 1,
   *   privilegeId: 2,
   *   isActive: false
   * }, { skipRetry: true });
   * 
   * @example
   * // Check loading state
   * if (vipService.isLoading('updatePrivilege')) {
   *   console.log('Updating privilege...');
   * }
   * 
   * @example
   * // Handle validation errors
   * try {
   *   await vipService.updatePrivilege({ vipId: null });
   * } catch (error) {
   *   if (error.code === 'MISSING_VIP_ID') {
   *     console.error('VIP ID is required');
   *   }
   * }
   */
  async updatePrivilege(params, options = {}) {
    const { skipRetry = false, skipValidation = false, maxRetries } = options;
    
    // Enhanced parameter validation
    if (!skipValidation) {
      try {
        // Use existing validation function
        validateUpdatePrivilegeParams(params);
        
        // Additional business logic validation
        this._validatePrivilegeUpdateBusiness(params);
      } catch (error) {
        // Create user-friendly validation error
        const enhancedError = this._createUserFriendlyError(error, 'updatePrivilege');
        throw enhancedError;
      }
    }

    const requestFn = async () => {
      try {
        // Prepare request data for Noble API according to Postman documentation
        // POST {{bikmediaURL}}/dashboard/updatePrivileges
        // Body (urlencoded): id (noble id), state (0=delete, 1=add), privilegeID
        // Headers: API-KEY and Auth-Token are automatically added by HTTP interceptor
        const requestData = prepareNobleUpdateRequest(params);

        // Real API call to updatePrivileges endpoint
        const response = await this.post('updatePrivileges', requestData, {}, 'bikmedia.messages.errors.failedToUpdatePrivilege');
        
        // Validate API response
        validateUpdatePrivilegeResponse(response);
        
        return response;
      } catch (error) {
        // Create user-friendly error
        const enhancedError = this._createUserFriendlyError(error, 'updatePrivilege');
        
        // Add specific context for privilege update errors
        if (error.response && error.response.data && error.response.data.err) {
          const apiError = error.response.data.err;
          
          switch (apiError) {
            case 'notFound':
              enhancedError.message = `VIP package (ID: ${params.vipId}) or privilege (ID: ${params.privilegeId}) not found.`;
              enhancedError.code = 'RESOURCE_NOT_FOUND';
              break;
            case 'invalidState':
              enhancedError.message = 'Invalid privilege state. Please refresh the page and try again.';
              enhancedError.code = 'INVALID_STATE';
              break;
            case 'invalidPrivilege':
              enhancedError.message = `Privilege (ID: ${params.privilegeId}) is not valid for this VIP package.`;
              enhancedError.code = 'INVALID_PRIVILEGE';
              break;
            case 'privilegeAlreadyActive':
              enhancedError.message = 'This privilege is already active for the VIP package.';
              enhancedError.code = 'PRIVILEGE_ALREADY_ACTIVE';
              break;
            case 'privilegeAlreadyInactive':
              enhancedError.message = 'This privilege is already inactive for the VIP package.';
              enhancedError.code = 'PRIVILEGE_ALREADY_INACTIVE';
              break;
          }
        }
        
        throw enhancedError;
      }
    };

    if (skipRetry) {
      const requestId = this.loadingManager.startLoading('updatePrivilege', { 
        skipRetry: true,
        vipId: params.vipId,
        privilegeId: params.privilegeId
      });
      try {
        return await requestFn();
      } finally {
        this.loadingManager.stopLoading('updatePrivilege', requestId);
      }
    } else {
      const retryOptions = maxRetries !== undefined ? { maxRetries } : {};
      return await this._executeWithRetry(requestFn, 'updatePrivilege', retryOptions);
    }
  }

  /**
   * Additional business logic validation for privilege updates
   * 
   * @private
   * @param {Object} params - Parameters to validate
   * @throws {Error} If business logic validation fails
   */
  _validatePrivilegeUpdateBusiness(params) {
    // Validate VIP ID range (assuming valid range is 1-100)
    const vipId = Number(params.vipId);
    if (vipId < 1 || vipId > 100) {
      const error = new Error(`VIP ID must be between 1 and 100. Received: ${vipId}`);
      error.code = 'VIP_ID_OUT_OF_RANGE';
      throw error;
    }

    // Validate privilege ID range (assuming valid range is 1-1000)
    const privilegeId = Number(params.privilegeId);
    if (privilegeId < 1 || privilegeId > 1000) {
      const error = new Error(`Privilege ID must be between 1 and 1000. Received: ${privilegeId}`);
      error.code = 'PRIVILEGE_ID_OUT_OF_RANGE';
      throw error;
    }
  }



  // ========================================
  // BACKWARD COMPATIBILITY METHODS
  // ========================================
  // These methods maintain compatibility with existing VIP option management views
  // They will be deprecated once the frontend is updated to use the new unified API

  /**
   * Create a new VIP option (DEPRECATED - for backward compatibility)
   * 
   * @deprecated Use updatePrivilege() method instead for new implementations
   * @param {number|string} vipId - VIP package ID
   * @param {FormData} formData - FormData containing option data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Promise resolving to created option
   */
  async create(vipId, formData, options = {}) {
    console.warn('VipService.create() is deprecated. Use updatePrivilege() for new implementations.');
    
    const operation = 'create';
    const requestId = this.loadingManager.startLoading(operation, { vipId });
    
    try {
      // Enhanced parameter validation for backward compatibility
      this._validateDeprecatedParams({ vipId, formData });
      this._validateCreateParams(formData);

      // Mock implementation for backward compatibility
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const optionData = {
        name: formData.get('name'),
        description: formData.get('description') || '',
        icon: formData.get('icon') || '',
        svga: formData.get('svga') || '',
        isActive: true
      };

      // Generate mock response
      const newOption = {
        id: Date.now(),
        ...optionData,
        vipId: parseInt(vipId)
      };

      return {
        item: newOption,
        raw: { code: 200, err: null, data: newOption }
      };
    } catch (error) {
      const enhancedError = this._createUserFriendlyError(error, operation);
      throw enhancedError;
    } finally {
      this.loadingManager.stopLoading(operation, requestId);
    }
  }

  /**
   * Update an existing VIP option (DEPRECATED - for backward compatibility)
   * 
   * @deprecated Use updatePrivilege() method instead for new implementations
   * @param {number|string} optionId - Option ID to update
   * @param {FormData} formData - FormData containing updated option data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Promise resolving to updated option
   */
  async update(optionId, formData, options = {}) {
    console.warn('VipService.update() is deprecated. Use updatePrivilege() for new implementations.');
    
    const operation = 'update';
    const requestId = this.loadingManager.startLoading(operation, { optionId });
    
    try {
      // Enhanced parameter validation for backward compatibility
      this._validateDeprecatedParams({ optionId, formData });
      this._validateUpdateParams(formData);

      // Mock implementation for backward compatibility
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updateData = {};
      if (formData.get('name')) updateData.name = formData.get('name');
      if (formData.get('description') !== null) updateData.description = formData.get('description');
      if (formData.get('icon')) updateData.icon = formData.get('icon');
      if (formData.get('svga')) updateData.svga = formData.get('svga');

      // Generate mock response
      const updatedOption = {
        id: parseInt(optionId),
        ...updateData,
        isActive: true // Assume active for mock
      };

      return {
        item: updatedOption,
        raw: { code: 200, err: null, data: updatedOption }
      };
    } catch (error) {
      const enhancedError = this._createUserFriendlyError(error, operation);
      throw enhancedError;
    } finally {
      this.loadingManager.stopLoading(operation, requestId);
    }
  }

  /**
   * Toggle VIP option status (DEPRECATED - for backward compatibility)
   * 
   * @deprecated Use updatePrivilege() method instead for new implementations
   * @param {number|string} optionId - Option ID to toggle
   * @param {boolean} isActive - New active status
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Promise resolving to updated option
   */
  async toggleStatus(optionId, isActive = null, options = {}) {
    console.warn('VipService.toggleStatus() is deprecated. Use updatePrivilege() for new implementations.');
    
    const operation = 'toggleStatus';
    const requestId = this.loadingManager.startLoading(operation, { optionId, isActive });
    
    try {
      // Enhanced parameter validation for backward compatibility
      this._validateToggleStatusParams(optionId, isActive);

      // Mock implementation for backward compatibility
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Generate mock response
      const updatedOption = {
        id: parseInt(optionId),
        name: `option_${optionId}`,
        description: `Option ${optionId}`,
        isActive: isActive !== null ? isActive : true,
        icon: `/assets/images/icons/option-${optionId}.png`,
        svga: `/assets/images/animations/option-${optionId}.svga`
      };

      return {
        item: updatedOption,
        raw: { code: 200, err: null, data: updatedOption }
      };
    } catch (error) {
      const enhancedError = this._createUserFriendlyError(error, operation);
      throw enhancedError;
    } finally {
      this.loadingManager.stopLoading(operation, requestId);
    }
  }

  /**
   * Validate parameters for deprecated methods
   * 
   * Provides enhanced validation for backward compatibility methods.
   * 
   * @private
   * @param {Object} params - Parameters to validate
   * @throws {Error} If validation fails
   */
  _validateDeprecatedParams(params) {
    if (params.vipId !== undefined) {
      if (params.vipId === null || params.vipId === undefined || params.vipId === '') {
        const error = new Error('VIP ID is required and cannot be empty.');
        error.code = 'MISSING_VIP_ID';
        throw error;
      }
      
      const vipId = Number(params.vipId);
      if (isNaN(vipId) || vipId <= 0) {
        const error = new Error('VIP ID must be a positive number.');
        error.code = 'INVALID_VIP_ID';
        throw error;
      }
    }

    if (params.optionId !== undefined) {
      if (params.optionId === null || params.optionId === undefined || params.optionId === '') {
        const error = new Error('Option ID is required and cannot be empty.');
        error.code = 'MISSING_OPTION_ID';
        throw error;
      }
      
      const optionId = Number(params.optionId);
      if (isNaN(optionId) || optionId <= 0) {
        const error = new Error('Option ID must be a positive number.');
        error.code = 'INVALID_OPTION_ID';
        throw error;
      }
    }

    if (params.formData !== undefined) {
      if (!params.formData || !(params.formData instanceof FormData)) {
        const error = new Error('Form data must be a valid FormData object.');
        error.code = 'INVALID_FORM_DATA';
        throw error;
      }
    }
  }

  /**
   * Validate create parameters for deprecated create method
   * 
   * @private
   * @param {FormData} formData - FormData to validate
   * @throws {Error} If validation fails
   */
  _validateCreateParams(formData) {
    const name = formData.get('name');
    if (!name || name.trim() === '') {
      const error = new Error('Option name is required and cannot be empty.');
      error.code = 'MISSING_NAME';
      throw error;
    }

    if (name.length > 100) {
      const error = new Error('Option name cannot exceed 100 characters.');
      error.code = 'NAME_TOO_LONG';
      throw error;
    }

    const description = formData.get('description');
    if (description && description.length > 500) {
      const error = new Error('Option description cannot exceed 500 characters.');
      error.code = 'DESCRIPTION_TOO_LONG';
      throw error;
    }
  }

  /**
   * Validate update parameters for deprecated update method
   * 
   * @private
   * @param {FormData} formData - FormData to validate
   * @throws {Error} If validation fails
   */
  _validateUpdateParams(formData) {
    const name = formData.get('name');
    if (name && name.length > 100) {
      const error = new Error('Option name cannot exceed 100 characters.');
      error.code = 'NAME_TOO_LONG';
      throw error;
    }

    const description = formData.get('description');
    if (description && description.length > 500) {
      const error = new Error('Option description cannot exceed 500 characters.');
      error.code = 'DESCRIPTION_TOO_LONG';
      throw error;
    }

    // Check if at least one field is being updated
    const hasUpdates = name || description || formData.get('icon') || formData.get('svga');
    if (!hasUpdates) {
      const error = new Error('At least one field must be provided for update.');
      error.code = 'NO_UPDATE_DATA';
      throw error;
    }
  }

  /**
   * Validate toggle status parameters for deprecated toggleStatus method
   * 
   * @private
   * @param {number|string} optionId - Option ID to validate
   * @param {boolean} isActive - Active status to validate
   * @throws {Error} If validation fails
   */
  _validateToggleStatusParams(optionId, isActive) {
    if (optionId === null || optionId === undefined || optionId === '') {
      const error = new Error('Option ID is required for status toggle.');
      error.code = 'MISSING_OPTION_ID';
      throw error;
    }

    const id = Number(optionId);
    if (isNaN(id) || id <= 0) {
      const error = new Error('Option ID must be a positive number.');
      error.code = 'INVALID_OPTION_ID';
      throw error;
    }

    if (isActive !== null && typeof isActive !== 'boolean') {
      const error = new Error('Active status must be a boolean value or null.');
      error.code = 'INVALID_ACTIVE_STATUS';
      throw error;
    }
  }
}

// Export singleton instance
const vipService = new VipService();
export default vipService;

// Export class for testing or advanced usage
export { VipService };