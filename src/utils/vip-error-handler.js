/**
 * VIP-specific Error Handler Utility
 * 
 * Provides specialized error handling for VIP service operations.
 * Maps VIP-specific error codes to user-friendly messages and handles
 * common VIP operation failure scenarios.
 * 
 * @module utils/vip-error-handler
 */

import { handleApiError, translateError } from './error-handler.js';

/**
 * Maps VIP-specific error codes to translation keys
 */
const VIP_ERROR_TRANSLATIONS = {
  // Parameter validation errors
  'MISSING_VIP_ID': 'bikmedia.messages.errors.invalidVipId',
  'INVALID_VIP_ID': 'bikmedia.messages.errors.invalidVipId',
  'VIP_ID_OUT_OF_RANGE': 'bikmedia.messages.errors.invalidVipId',
  'MISSING_PRIVILEGE_ID': 'bikmedia.messages.errors.invalidPrivilegeId',
  'INVALID_PRIVILEGE_ID': 'bikmedia.messages.errors.invalidPrivilegeId',
  'PRIVILEGE_ID_OUT_OF_RANGE': 'bikmedia.messages.errors.invalidPrivilegeId',
  'MISSING_IS_ACTIVE': 'bikmedia.messages.errors.invalid',
  'INVALID_IS_ACTIVE': 'bikmedia.messages.errors.invalid',
  
  // API-specific errors
  'RESOURCE_NOT_FOUND': 'bikmedia.messages.errors.vipPackageNotFound',
  'PRIVILEGE_NOT_FOUND': 'bikmedia.messages.errors.privilegeNotFound',
  'INVALID_STATE': 'bikmedia.messages.errors.invalid',
  'INVALID_PRIVILEGE': 'bikmedia.messages.errors.invalidPrivilegeId',
  'PRIVILEGE_ALREADY_ACTIVE': 'bikmedia.messages.errors.privilegeAlreadyActive',
  'PRIVILEGE_ALREADY_INACTIVE': 'bikmedia.messages.errors.privilegeAlreadyInactive',
  
  // Service availability errors
  'API_UNAVAILABLE': 'bikmedia.messages.errors.vipServiceUnavailable',
  'SERVICE_UNAVAILABLE': 'bikmedia.messages.errors.vipServiceUnavailable',
  
  // Deprecated method errors
  'MISSING_OPTION_ID': 'bikmedia.messages.errors.invalidPrivilegeId',
  'INVALID_OPTION_ID': 'bikmedia.messages.errors.invalidPrivilegeId',
  'MISSING_NAME': 'bikmedia.messages.errors.required',
  'NAME_TOO_LONG': 'bikmedia.messages.errors.invalid',
  'DESCRIPTION_TOO_LONG': 'bikmedia.messages.errors.invalid',
  'NO_UPDATE_DATA': 'bikmedia.messages.errors.invalid',
  'INVALID_FORM_DATA': 'bikmedia.messages.errors.invalid',
  'INVALID_ACTIVE_STATUS': 'bikmedia.messages.errors.invalid'
};

/**
 * Maps VIP operations to specific error translation keys
 */
const VIP_OPERATION_ERRORS = {
  'getAll': 'bikmedia.messages.errors.failedToLoadVipPackages',
  'updatePrivilege': 'bikmedia.messages.errors.failedToUpdatePrivilege',
  'create': 'bikmedia.messages.errors.failedToCreate',
  'update': 'bikmedia.messages.errors.failedToUpdate',
  'toggleStatus': 'bikmedia.messages.errors.failedToUpdate'
};

/**
 * Translates VIP-specific errors to user-friendly messages
 * 
 * @param {Error} error - The error object
 * @param {string} operation - The VIP operation that failed
 * @returns {string} Localized error message
 */
export const translateVipError = (error, operation = null) => {
  // Check for VIP-specific error codes first
  if (error.code && VIP_ERROR_TRANSLATIONS[error.code]) {
    return translateError(error, VIP_ERROR_TRANSLATIONS[error.code]);
  }
  
  // Use operation-specific fallback
  if (operation && VIP_OPERATION_ERRORS[operation]) {
    return translateError(error, VIP_OPERATION_ERRORS[operation]);
  }
  
  // Fall back to general error handling
  return translateError(error, 'bikmedia.messages.errors.unknown');
};

/**
 * Creates a VIP-specific error object with enhanced context
 * 
 * @param {Error} originalError - The original error
 * @param {string} operation - The VIP operation that failed
 * @param {Object} context - Additional context about the error
 * @returns {Object} Enhanced error object
 */
export const createVipError = (originalError, operation, context = {}) => {
  const localizedMessage = translateVipError(originalError, operation);
  
  return {
    ...originalError,
    localizedMessage,
    originalMessage: originalError.message,
    operation,
    context,
    timestamp: new Date().toISOString(),
    isVipError: true,
    toString: () => localizedMessage
  };
};

/**
 * Handles VIP service errors with operation-specific logic
 * 
 * @param {Error} error - The error from VIP service
 * @param {string} operation - The VIP operation that failed
 * @param {Object} options - Options for error handling
 * @param {Object} options.context - Additional context about the error
 * @param {Function} options.onError - Custom error handler function
 * @param {boolean} options.throwEnhanced - Whether to throw enhanced error
 * @returns {string|Error} Localized error message or throws enhanced error
 */
export const handleVipError = (error, operation, options = {}) => {
  const {
    context = {},
    onError,
    throwEnhanced = false
  } = options;
  
  const enhancedError = createVipError(error, operation, context);
  
  // Call custom error handler if provided
  if (typeof onError === 'function') {
    onError(enhancedError);
  }
  
  // Log error in development with VIP-specific context
  if (import.meta.env.DEV) {
    console.group(`[VIP Service Error] ${operation}`);
    console.error('Localized message:', enhancedError.localizedMessage);
    console.error('Original error:', error);
    console.error('Context:', context);
    console.error('Timestamp:', enhancedError.timestamp);
    console.groupEnd();
  }
  
  if (throwEnhanced) {
    throw enhancedError;
  }
  
  return enhancedError.localizedMessage;
};

/**
 * Specific error handlers for VIP operations
 */
export const vipErrorHandlers = {
  /**
   * Handles VIP package loading errors
   */
  getAll: (error, context = {}) => handleVipError(error, 'getAll', {
    context,
    throwEnhanced: true
  }),
  
  /**
   * Handles privilege update errors
   */
  updatePrivilege: (error, context = {}) => handleVipError(error, 'updatePrivilege', {
    context,
    throwEnhanced: true
  }),
  
  /**
   * Handles VIP option creation errors (deprecated)
   */
  create: (error, context = {}) => handleVipError(error, 'create', {
    context,
    throwEnhanced: true
  }),
  
  /**
   * Handles VIP option update errors (deprecated)
   */
  update: (error, context = {}) => handleVipError(error, 'update', {
    context,
    throwEnhanced: true
  }),
  
  /**
   * Handles VIP option status toggle errors (deprecated)
   */
  toggleStatus: (error, context = {}) => handleVipError(error, 'toggleStatus', {
    context,
    throwEnhanced: true
  })
};

/**
 * Validates VIP error handling configuration
 * 
 * @returns {Object} Validation result with any missing translations
 */
export const validateVipErrorConfig = () => {
  const missingTranslations = [];
  
  // Check if all VIP error codes have translations
  for (const [code, translationKey] of Object.entries(VIP_ERROR_TRANSLATIONS)) {
    // This would need to be implemented with actual i18n instance
    // For now, just return the structure
    if (!translationKey) {
      missingTranslations.push(code);
    }
  }
  
  return {
    isValid: missingTranslations.length === 0,
    missingTranslations,
    totalErrorCodes: Object.keys(VIP_ERROR_TRANSLATIONS).length,
    totalOperations: Object.keys(VIP_OPERATION_ERRORS).length
  };
};

export default {
  translateVipError,
  createVipError,
  handleVipError,
  vipErrorHandlers,
  validateVipErrorConfig
};