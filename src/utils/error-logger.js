/**
 * Error Logging Utility
 * 
 * Provides centralized error logging functionality for the dashboard
 * with support for local storage, console logging, and external service integration.
 */

/**
 * Log levels for categorizing errors
 */
export const LogLevels = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

/**
 * Error categories for better organization
 */
export const ErrorCategories = {
  NETWORK: 'network',
  API: 'api',
  WIDGET: 'widget',
  CHART: 'chart',
  USER_ACTION: 'user_action',
  SYSTEM: 'system'
};

/**
 * Enhanced error logger class
 */
class ErrorLogger {
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.maxStoredErrors = 100;
    this.storageKey = 'dashboard_error_logs';
  }

  /**
   * Get or create session ID for tracking
   * @returns {string} Session ID
   */
  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('dashboard_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('dashboard_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Create standardized error log entry
   * @param {Object} options - Error log options
   * @returns {Object} Standardized error log entry
   */
  createLogEntry({
    level = LogLevels.ERROR,
    category = ErrorCategories.SYSTEM,
    message,
    error,
    context = {},
    widget = null,
    userId = null
  }) {
    return {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      level,
      category,
      message: message || (error && error.message) || 'Unknown error',
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code
      } : null,
      context: {
        ...context,
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        timestamp: Date.now()
      },
      widget,
      userId,
      retryable: this.isRetryableError(error),
      severity: this.calculateSeverity(level, category, error)
    };
  }

  /**
   * Determine if an error is retryable
   * @param {Error} error - Error object
   * @returns {boolean} True if retryable
   */
  isRetryableError(error) {
    if (!error) return false;
    
    const retryablePatterns = [
      /network/i,
      /timeout/i,
      /fetch/i,
      /connection/i,
      /502|503|504/
    ];
    
    const message = error.message || '';
    return retryablePatterns.some(pattern => pattern.test(message));
  }

  /**
   * Calculate error severity
   * @param {string} level - Log level
   * @param {string} category - Error category
   * @param {Error} error - Error object
   * @returns {number} Severity score (1-10)
   */
  calculateSeverity(level, category, error) {
    let severity = 1;
    
    // Base severity by level
    switch (level) {
      case LogLevels.ERROR:
        severity = 7;
        break;
      case LogLevels.WARN:
        severity = 4;
        break;
      case LogLevels.INFO:
        severity = 2;
        break;
      case LogLevels.DEBUG:
        severity = 1;
        break;
    }
    
    // Adjust by category
    if (category === ErrorCategories.NETWORK) severity += 2;
    if (category === ErrorCategories.API) severity += 1;
    
    // Adjust by error type
    if (error && error.name === 'TypeError') severity += 1;
    if (error && error.message && error.message.includes('timeout')) severity += 1;
    
    return Math.min(severity, 10);
  }

  /**
   * Log error to console
   * @param {Object} logEntry - Log entry
   */
  logToConsole(logEntry) {
    const { level, message, error, context, widget } = logEntry;
    
    const consoleMessage = [
      `[${level.toUpperCase()}]`,
      widget ? `[${widget}]` : '',
      message
    ].filter(Boolean).join(' ');
    
    const consoleData = {
      timestamp: logEntry.timestamp,
      sessionId: logEntry.sessionId,
      context,
      error: error || undefined
    };
    
    switch (level) {
      case LogLevels.ERROR:
        console.error(consoleMessage, consoleData);
        break;
      case LogLevels.WARN:
        console.warn(consoleMessage, consoleData);
        break;
      case LogLevels.INFO:
        console.info(consoleMessage, consoleData);
        break;
      case LogLevels.DEBUG:
        console.debug(consoleMessage, consoleData);
        break;
      default:
        console.log(consoleMessage, consoleData);
    }
  }

  /**
   * Store error in local storage
   * @param {Object} logEntry - Log entry
   */
  storeLocally(logEntry) {
    try {
      const stored = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      stored.push(logEntry);
      
      // Keep only the most recent errors
      if (stored.length > this.maxStoredErrors) {
        stored.splice(0, stored.length - this.maxStoredErrors);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(stored));
    } catch (error) {
      console.warn('Failed to store error locally:', error);
    }
  }

  /**
   * Send error to external tracking service
   * @param {Object} logEntry - Log entry
   */
  async sendToTrackingService(logEntry) {
    // Only send high-severity errors in production
    if (process.env.NODE_ENV !== 'production' || logEntry.severity < 6) {
      return;
    }
    
    try {
      // Placeholder for actual error tracking service integration
      // Examples: Sentry, LogRocket, Bugsnag, etc.
      
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(logEntry)
      // });
      
      console.log('Would send to error tracking service:', logEntry);
    } catch (error) {
      console.warn('Failed to send error to tracking service:', error);
    }
  }

  /**
   * Main logging method
   * @param {Object} options - Logging options
   */
  async log(options) {
    const logEntry = this.createLogEntry(options);
    
    // Always log to console
    this.logToConsole(logEntry);
    
    // Store locally for debugging
    this.storeLocally(logEntry);
    
    // Send to external service if configured
    await this.sendToTrackingService(logEntry);
    
    return logEntry;
  }

  /**
   * Log widget-specific error
   * @param {string} widget - Widget name
   * @param {Error} error - Error object
   * @param {Object} context - Additional context
   */
  async logWidgetError(widget, error, context = {}) {
    return this.log({
      level: LogLevels.ERROR,
      category: ErrorCategories.WIDGET,
      message: `Widget error in ${widget}`,
      error,
      context,
      widget
    });
  }

  /**
   * Log network error
   * @param {Error} error - Network error
   * @param {Object} context - Request context
   */
  async logNetworkError(error, context = {}) {
    return this.log({
      level: LogLevels.ERROR,
      category: ErrorCategories.NETWORK,
      message: 'Network request failed',
      error,
      context
    });
  }

  /**
   * Log API error
   * @param {Error} error - API error
   * @param {Object} context - API context
   */
  async logApiError(error, context = {}) {
    return this.log({
      level: LogLevels.ERROR,
      category: ErrorCategories.API,
      message: 'API request failed',
      error,
      context
    });
  }

  /**
   * Get stored error logs
   * @param {Object} filters - Filter options
   * @returns {Array} Filtered error logs
   */
  getStoredLogs(filters = {}) {
    try {
      const stored = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      
      if (!filters || Object.keys(filters).length === 0) {
        return stored;
      }
      
      return stored.filter(log => {
        if (filters.level && log.level !== filters.level) return false;
        if (filters.category && log.category !== filters.category) return false;
        if (filters.widget && log.widget !== filters.widget) return false;
        if (filters.minSeverity && log.severity < filters.minSeverity) return false;
        if (filters.since && new Date(log.timestamp) < new Date(filters.since)) return false;
        
        return true;
      });
    } catch (error) {
      console.warn('Failed to retrieve stored logs:', error);
      return [];
    }
  }

  /**
   * Clear stored error logs
   * @param {Object} filters - Filter options for selective clearing
   */
  clearStoredLogs(filters = {}) {
    try {
      if (!filters || Object.keys(filters).length === 0) {
        localStorage.removeItem(this.storageKey);
        return;
      }
      
      const stored = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const filtered = stored.filter(log => {
        if (filters.level && log.level === filters.level) return false;
        if (filters.category && log.category === filters.category) return false;
        if (filters.widget && log.widget === filters.widget) return false;
        if (filters.olderThan && new Date(log.timestamp) < new Date(filters.olderThan)) return false;
        
        return true;
      });
      
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    } catch (error) {
      console.warn('Failed to clear stored logs:', error);
    }
  }

  /**
   * Get error statistics
   * @returns {Object} Error statistics
   */
  getErrorStats() {
    try {
      const stored = this.getStoredLogs();
      
      const stats = {
        total: stored.length,
        byLevel: {},
        byCategory: {},
        byWidget: {},
        bySeverity: {},
        recent: stored.filter(log => 
          new Date(log.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length
      };
      
      stored.forEach(log => {
        stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
        stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1;
        if (log.widget) {
          stats.byWidget[log.widget] = (stats.byWidget[log.widget] || 0) + 1;
        }
        stats.bySeverity[log.severity] = (stats.bySeverity[log.severity] || 0) + 1;
      });
      
      return stats;
    } catch (error) {
      console.warn('Failed to generate error stats:', error);
      return { total: 0, byLevel: {}, byCategory: {}, byWidget: {}, bySeverity: {}, recent: 0 };
    }
  }
}

// Create singleton instance
const errorLogger = new ErrorLogger();

export default errorLogger;

// Export convenience methods
export const logError = (options) => errorLogger.log({ level: LogLevels.ERROR, ...options });
export const logWarning = (options) => errorLogger.log({ level: LogLevels.WARN, ...options });
export const logInfo = (options) => errorLogger.log({ level: LogLevels.INFO, ...options });
export const logDebug = (options) => errorLogger.log({ level: LogLevels.DEBUG, ...options });

export const logWidgetError = (widget, error, context) => errorLogger.logWidgetError(widget, error, context);
export const logNetworkError = (error, context) => errorLogger.logNetworkError(error, context);
export const logApiError = (error, context) => errorLogger.logApiError(error, context);

export const getErrorLogs = (filters) => errorLogger.getStoredLogs(filters);
export const clearErrorLogs = (filters) => errorLogger.clearStoredLogs(filters);
export const getErrorStats = () => errorLogger.getErrorStats();