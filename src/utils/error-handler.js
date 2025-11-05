/**
 * Error Handler Utility
 * 
 * Provides centralized error handling with localization support for API errors.
 * Maps HTTP status codes and error types to localized error messages.
 */

import i18n from '../i18n.js';

/**
 * Maps HTTP status codes to translation keys
 */
const HTTP_STATUS_TRANSLATIONS = {
  400: 'bikmedia.messages.errors.api.400',
  401: 'bikmedia.messages.errors.api.401',
  403: 'bikmedia.messages.errors.api.403',
  404: 'bikmedia.messages.errors.api.404',
  408: 'bikmedia.messages.errors.api.408',
  409: 'bikmedia.messages.errors.api.409',
  422: 'bikmedia.messages.errors.api.422',
  429: 'bikmedia.messages.errors.api.429',
  500: 'bikmedia.messages.errors.api.500',
  502: 'bikmedia.messages.errors.api.502',
  503: 'bikmedia.messages.errors.api.503',
  504: 'bikmedia.messages.errors.api.504'
};

/**
 * Maps error types to translation keys
 */
const ERROR_TYPE_TRANSLATIONS = {
  'network': 'bikmedia.messages.errors.api.networkError',
  'timeout': 'bikmedia.messages.errors.timeout',
  'request': 'bikmedia.messages.errors.api.requestFailed',
  'connection': 'bikmedia.messages.errors.api.connectionLost',
  'server': 'bikmedia.messages.errors.api.serverUnavailable'
};

/**
 * Gets the translation function from i18n
 * @returns {Function} Translation function
 */
const getTranslationFunction = () => {
  return i18n.global.t;
};

/**
 * Translates an error based on HTTP status code or error type
 * 
 * @param {Error|Object} error - The error object from axios or custom error
 * @param {string} fallbackKey - Fallback translation key if no specific mapping found
 * @returns {string} Localized error message
 */
export const translateError = (error, fallbackKey = 'bikmedia.messages.errors.unknown') => {
  const t = getTranslationFunction();
  
  // Handle axios errors with response
  if (error.response && error.response.status) {
    const statusCode = error.response.status;
    const translationKey = HTTP_STATUS_TRANSLATIONS[statusCode];
    
    if (translationKey) {
      return t(translationKey);
    }
  }
  
  // Handle network errors (no response)
  if (error.request && !error.response) {
    return t(ERROR_TYPE_TRANSLATIONS.network);
  }
  
  // Handle timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return t(ERROR_TYPE_TRANSLATIONS.timeout);
  }
  
  // Handle custom error types
  if (error.type && ERROR_TYPE_TRANSLATIONS[error.type]) {
    return t(ERROR_TYPE_TRANSLATIONS[error.type]);
  }
  
  // Check if error message contains specific keywords
  const errorMessage = error.message?.toLowerCase() || '';
  if (errorMessage.includes('network')) {
    return t(ERROR_TYPE_TRANSLATIONS.network);
  }
  if (errorMessage.includes('timeout')) {
    return t(ERROR_TYPE_TRANSLATIONS.timeout);
  }
  if (errorMessage.includes('connection')) {
    return t(ERROR_TYPE_TRANSLATIONS.connection);
  }
  
  // Use fallback translation
  return t(fallbackKey);
};

/**
 * Creates a localized error object with translated message
 * 
 * @param {Error|Object} originalError - The original error
 * @param {string} fallbackKey - Fallback translation key
 * @returns {Object} Error object with localized message
 */
export const createLocalizedError = (originalError, fallbackKey) => {
  const localizedMessage = translateError(originalError, fallbackKey);
  
  return {
    ...originalError,
    localizedMessage,
    originalMessage: originalError.message,
    toString: () => localizedMessage
  };
};

/**
 * Handles API errors with localization and optional custom handling
 * 
 * @param {Error} error - The error from API call
 * @param {Object} options - Options for error handling
 * @param {string} options.fallbackKey - Custom fallback translation key
 * @param {Function} options.onError - Custom error handler function
 * @param {boolean} options.throwLocalized - Whether to throw localized error
 * @returns {string|Error} Localized error message or throws localized error
 */
export const handleApiError = (error, options = {}) => {
  const {
    fallbackKey = 'bikmedia.messages.errors.unknown',
    onError,
    throwLocalized = false
  } = options;
  
  const localizedMessage = translateError(error, fallbackKey);
  
  // Call custom error handler if provided
  if (typeof onError === 'function') {
    onError(error, localizedMessage);
  }
  
  // Log error in development
  if (import.meta.env.DEV) {
    console.error('[Localized Error]', localizedMessage, error);
  }
  
  if (throwLocalized) {
    const localizedError = createLocalizedError(error, fallbackKey);
    throw localizedError;
  }
  
  return localizedMessage;
};

/**
 * Specific error handlers for common bikmedia operations
 */
export const bikMediaErrorHandlers = {
  /**
   * Handles gift-related API errors
   */
  gift: (error) => handleApiError(error, {
    fallbackKey: 'bikmedia.messages.errors.loadGifts'
  }),
  
  /**
   * Handles equipment-related API errors
   */
  equipment: (error) => handleApiError(error, {
    fallbackKey: 'bikmedia.messages.errors.loadEquipment'
  }),
  
  /**
   * Handles level-related API errors
   */
  level: (error) => handleApiError(error, {
    fallbackKey: 'bikmedia.messages.errors.loadLevels'
  }),
  
  /**
   * Handles create operation errors
   */
  create: (error) => handleApiError(error, {
    fallbackKey: 'bikmedia.messages.errors.failedToCreate'
  }),
  
  /**
   * Handles update operation errors
   */
  update: (error) => handleApiError(error, {
    fallbackKey: 'bikmedia.messages.errors.failedToUpdate'
  }),
  
  /**
   * Handles delete operation errors
   */
  delete: (error) => handleApiError(error, {
    fallbackKey: 'bikmedia.messages.errors.failedToDelete'
  })
};

export default {
  translateError,
  createLocalizedError,
  handleApiError,
  bikMediaErrorHandlers
};