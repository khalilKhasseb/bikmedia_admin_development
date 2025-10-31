import { reactive, ref, computed } from 'vue';

/**
 * Error Handling Composable
 * 
 * Provides centralized error management for dashboard widgets with
 * widget-level isolation, retry mechanisms, user-friendly messages,
 * and error logging functionality.
 * 
 * @returns {Object} Error handling interface
 */
export function useErrorHandling() {
  // Widget error states
  const widgetErrors = reactive({
    gifts: null,
    equipment: null,
    levels: null,
    users: null,
    overview: null
  });

  // Retry counts for each widget
  const retryCounts = reactive({
    gifts: 0,
    equipment: 0,
    levels: 0,
    users: 0,
    overview: 0
  });

  // Maximum retry attempts before giving up
  const MAX_RETRY_ATTEMPTS = 2;
  
  // Retry delay in milliseconds
  const RETRY_DELAY = 2000;

  /**
   * Error types for categorization
   */
  const ErrorTypes = {
    NETWORK: 'network',
    API: 'api',
    PARSING: 'parsing',
    TIMEOUT: 'timeout',
    UNKNOWN: 'unknown'
  };

  /**
   * User-friendly error messages
   */
  const ErrorMessages = {
    [ErrorTypes.NETWORK]: 'Connection failed. Please check your internet connection and try again.',
    [ErrorTypes.API]: 'Unable to load data from the server. Please try again later.',
    [ErrorTypes.PARSING]: 'Data format error. Please contact support if this persists.',
    [ErrorTypes.TIMEOUT]: 'Request timed out. Please try again.',
    [ErrorTypes.UNKNOWN]: 'An unexpected error occurred. Please try again.'
  };

  /**
   * Determine error type from error object
   * @param {Error} error - Error object
   * @returns {string} Error type
   */
  const determineErrorType = (error) => {
    if (!error) return ErrorTypes.UNKNOWN;

    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('network') || message.includes('fetch') || error.code === 'NETWORK_ERROR') {
      return ErrorTypes.NETWORK;
    }
    
    if (message.includes('timeout') || error.code === 'TIMEOUT') {
      return ErrorTypes.TIMEOUT;
    }
    
    if (message.includes('json') || message.includes('parse') || message.includes('syntax')) {
      return ErrorTypes.PARSING;
    }
    
    if (error.status >= 400 && error.status < 600) {
      return ErrorTypes.API;
    }
    
    return ErrorTypes.UNKNOWN;
  };

  /**
   * Create normalized error object
   * @param {Error} error - Original error
   * @param {string} widgetType - Widget that encountered the error
   * @returns {Object} Normalized error object
   */
  const createErrorObject = (error, widgetType) => {
    const errorType = determineErrorType(error);
    
    return {
      type: errorType,
      message: ErrorMessages[errorType],
      originalMessage: error.message || 'Unknown error',
      timestamp: new Date(),
      widgetType,
      retryable: errorType !== ErrorTypes.PARSING,
      retryCount: retryCounts[widgetType] || 0
    };
  };

  /**
   * Set error for a specific widget
   * @param {string} widgetType - Widget type
   * @param {Error} error - Error object
   */
  const setWidgetError = (widgetType, error) => {
    if (!widgetType || !widgetErrors.hasOwnProperty(widgetType)) {
      console.warn('Invalid widget type:', widgetType);
      return;
    }

    const errorObject = createErrorObject(error, widgetType);
    widgetErrors[widgetType] = errorObject;
    
    // Log error for debugging
    logError(errorObject);
  };

  /**
   * Clear error for a specific widget
   * @param {string} widgetType - Widget type
   */
  const clearWidgetError = (widgetType) => {
    if (!widgetType || !widgetErrors.hasOwnProperty(widgetType)) {
      console.warn('Invalid widget type:', widgetType);
      return;
    }

    widgetErrors[widgetType] = null;
    retryCounts[widgetType] = 0;
  };

  /**
   * Clear all widget errors
   */
  const clearAllErrors = () => {
    Object.keys(widgetErrors).forEach(widgetType => {
      widgetErrors[widgetType] = null;
      retryCounts[widgetType] = 0;
    });
  };

  /**
   * Check if a widget can be retried
   * @param {string} widgetType - Widget type
   * @returns {boolean} True if retry is possible
   */
  const canRetry = (widgetType) => {
    const error = widgetErrors[widgetType];
    const retryCount = retryCounts[widgetType] || 0;
    
    return error && error.retryable && retryCount < MAX_RETRY_ATTEMPTS;
  };

  /**
   * Increment retry count for a widget
   * @param {string} widgetType - Widget type
   */
  const incrementRetryCount = (widgetType) => {
    if (retryCounts.hasOwnProperty(widgetType)) {
      retryCounts[widgetType]++;
    }
  };

  /**
   * Execute function with automatic retry logic
   * @param {Function} fn - Function to execute
   * @param {string} widgetType - Widget type
   * @param {Object} options - Retry options
   * @returns {Promise} Promise that resolves when function succeeds or max retries reached
   */
  const executeWithRetry = async (fn, widgetType, options = {}) => {
    const { maxRetries = MAX_RETRY_ATTEMPTS, delay = RETRY_DELAY } = options;
    
    let lastError = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Clear error on successful attempt
        if (attempt > 0) {
          clearWidgetError(widgetType);
        }
        
        const result = await fn();
        return result;
      } catch (error) {
        lastError = error;
        incrementRetryCount(widgetType);
        
        // If this is not the last attempt and error is retryable, wait and retry
        if (attempt < maxRetries && determineErrorType(error) !== ErrorTypes.PARSING) {
          console.log(`Retrying ${widgetType} (attempt ${attempt + 1}/${maxRetries + 1}) after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // Set error after all retries exhausted
        setWidgetError(widgetType, error);
        throw error;
      }
    }
    
    // This should never be reached, but just in case
    if (lastError) {
      setWidgetError(widgetType, lastError);
      throw lastError;
    }
  };

  /**
   * Manual retry for a specific widget
   * @param {Function} retryFunction - Function to retry
   * @param {string} widgetType - Widget type
   * @returns {Promise} Promise that resolves when retry succeeds
   */
  const retryWidget = async (retryFunction, widgetType) => {
    if (!canRetry(widgetType)) {
      console.warn(`Cannot retry widget ${widgetType}: max retries reached or not retryable`);
      return Promise.reject(new Error('Retry not available'));
    }

    try {
      clearWidgetError(widgetType);
      const result = await retryFunction();
      return result;
    } catch (error) {
      incrementRetryCount(widgetType);
      setWidgetError(widgetType, error);
      throw error;
    }
  };

  /**
   * Automatic retry with exponential backoff for network errors
   * @param {Function} fn - Function to execute
   * @param {string} widgetType - Widget type
   * @param {Object} options - Retry options
   * @returns {Promise} Promise that resolves when function succeeds
   */
  const autoRetryWithBackoff = async (fn, widgetType, options = {}) => {
    const { 
      maxRetries = MAX_RETRY_ATTEMPTS, 
      baseDelay = RETRY_DELAY,
      backoffMultiplier = 1.5,
      maxDelay = 10000
    } = options;
    
    let lastError = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Clear error on successful attempt
        if (attempt > 0) {
          clearWidgetError(widgetType);
        }
        
        const result = await fn();
        return result;
      } catch (error) {
        lastError = error;
        const errorType = determineErrorType(error);
        
        // Only auto-retry network and timeout errors
        if (attempt < maxRetries && (errorType === ErrorTypes.NETWORK || errorType === ErrorTypes.TIMEOUT)) {
          const delay = Math.min(baseDelay * Math.pow(backoffMultiplier, attempt), maxDelay);
          incrementRetryCount(widgetType);
          
          console.log(`Auto-retrying ${widgetType} (attempt ${attempt + 1}/${maxRetries + 1}) after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // Set error after all retries exhausted or non-retryable error
        setWidgetError(widgetType, error);
        throw error;
      }
    }
    
    // This should never be reached, but just in case
    if (lastError) {
      setWidgetError(widgetType, lastError);
      throw lastError;
    }
  };

  /**
   * Enhanced error logging for debugging and monitoring
   * @param {Object} errorObject - Normalized error object
   */
  const logError = (errorObject) => {
    const logData = {
      timestamp: errorObject.timestamp.toISOString(),
      widget: errorObject.widgetType,
      type: errorObject.type,
      message: errorObject.originalMessage,
      userMessage: errorObject.message,
      retryCount: errorObject.retryCount,
      retryable: errorObject.retryable,
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: getSessionId()
    };

    // Log to console for development
    console.error('Dashboard Widget Error:', logData);

    // Store error in local storage for debugging
    storeErrorLocally(logData);

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      sendErrorToTrackingService(logData);
    }
  };

  /**
   * Get or create session ID for error tracking
   * @returns {string} Session ID
   */
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('dashboard_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('dashboard_session_id', sessionId);
    }
    return sessionId;
  };

  /**
   * Store error locally for debugging purposes
   * @param {Object} logData - Error log data
   */
  const storeErrorLocally = (logData) => {
    try {
      const errors = JSON.parse(localStorage.getItem('dashboard_errors') || '[]');
      errors.push(logData);
      
      // Keep only last 50 errors to prevent storage bloat
      if (errors.length > 50) {
        errors.splice(0, errors.length - 50);
      }
      
      localStorage.setItem('dashboard_errors', JSON.stringify(errors));
    } catch (error) {
      console.warn('Failed to store error locally:', error);
    }
  };

  /**
   * Send error to tracking service (placeholder for production implementation)
   * @param {Object} logData - Error log data
   */
  const sendErrorToTrackingService = async (logData) => {
    try {
      // Placeholder for actual error tracking service integration
      // Example: await fetch('/api/errors', { method: 'POST', body: JSON.stringify(logData) });
      console.log('Would send to error tracking service:', logData);
    } catch (error) {
      console.warn('Failed to send error to tracking service:', error);
    }
  };

  /**
   * Get stored error logs for debugging
   * @returns {Array} Array of error logs
   */
  const getStoredErrors = () => {
    try {
      return JSON.parse(localStorage.getItem('dashboard_errors') || '[]');
    } catch (error) {
      console.warn('Failed to retrieve stored errors:', error);
      return [];
    }
  };

  /**
   * Clear stored error logs
   */
  const clearStoredErrors = () => {
    try {
      localStorage.removeItem('dashboard_errors');
    } catch (error) {
      console.warn('Failed to clear stored errors:', error);
    }
  };

  /**
   * Get user-friendly error message for a widget
   * @param {string} widgetType - Widget type
   * @returns {string|null} Error message or null if no error
   */
  const getWidgetErrorMessage = (widgetType) => {
    const error = widgetErrors[widgetType];
    return error ? error.message : null;
  };

  /**
   * Check if a specific widget has an error
   * @param {string} widgetType - Widget type
   * @returns {boolean} True if widget has an error
   */
  const hasWidgetError = (widgetType) => {
    return !!widgetErrors[widgetType];
  };

  /**
   * Get error details for a widget
   * @param {string} widgetType - Widget type
   * @returns {Object|null} Error object or null
   */
  const getWidgetError = (widgetType) => {
    return widgetErrors[widgetType];
  };

  /**
   * Computed: Check if any widget has errors
   */
  const hasAnyErrors = computed(() => {
    return Object.values(widgetErrors).some(error => error !== null);
  });

  /**
   * Computed: Get count of widgets with errors
   */
  const errorCount = computed(() => {
    return Object.values(widgetErrors).filter(error => error !== null).length;
  });

  /**
   * Computed: Get list of widgets with errors
   */
  const widgetsWithErrors = computed(() => {
    return Object.keys(widgetErrors).filter(widgetType => widgetErrors[widgetType] !== null);
  });

  /**
   * Computed: Get list of retryable widgets
   */
  const retryableWidgets = computed(() => {
    return Object.keys(widgetErrors).filter(widgetType => canRetry(widgetType));
  });

  /**
   * Create fallback data for partial failures
   * @param {string} widgetType - Widget type
   * @param {Array} cachedData - Cached data to use as fallback
   * @returns {Object} Fallback data structure
   */
  const createFallbackData = (widgetType, cachedData = []) => {
    const fallbackStructures = {
      gifts: {
        items: cachedData,
        total: cachedData.length,
        isFallback: true,
        fallbackMessage: 'Showing cached data due to connection issues'
      },
      equipment: {
        items: cachedData,
        total: cachedData.length,
        isFallback: true,
        fallbackMessage: 'Showing cached data due to connection issues'
      },
      levels: {
        items: cachedData,
        total: cachedData.length,
        isFallback: true,
        fallbackMessage: 'Showing cached data due to connection issues'
      },
      users: {
        items: cachedData,
        total: cachedData.length,
        isFallback: true,
        fallbackMessage: 'Showing cached data due to connection issues'
      }
    };

    return fallbackStructures[widgetType] || {
      items: [],
      total: 0,
      isFallback: true,
      fallbackMessage: 'No data available'
    };
  };

  /**
   * Check if widget should show fallback data
   * @param {string} widgetType - Widget type
   * @returns {boolean} True if should show fallback
   */
  const shouldShowFallback = (widgetType) => {
    const error = widgetErrors[widgetType];
    return error && (error.type === ErrorTypes.NETWORK || error.type === ErrorTypes.TIMEOUT);
  };

  return {
    // State
    widgetErrors,
    retryCounts,
    
    // Constants
    ErrorTypes,
    ErrorMessages,
    MAX_RETRY_ATTEMPTS,
    
    // Methods
    setWidgetError,
    clearWidgetError,
    clearAllErrors,
    canRetry,
    executeWithRetry,
    autoRetryWithBackoff,
    retryWidget,
    getWidgetErrorMessage,
    hasWidgetError,
    getWidgetError,
    logError,
    createFallbackData,
    shouldShowFallback,
    
    // Error logging utilities
    getStoredErrors,
    clearStoredErrors,
    
    // Computed
    hasAnyErrors,
    errorCount,
    widgetsWithErrors,
    retryableWidgets
  };
}