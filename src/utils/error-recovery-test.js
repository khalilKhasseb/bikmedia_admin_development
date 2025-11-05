/**
 * Error Recovery Testing Utility
 * 
 * Provides utilities to test error recovery mechanisms in the dashboard
 * This is for development and testing purposes only.
 */

import { useErrorHandling } from '@/composables/use-error-handling';
import errorLogger, { logWidgetError, ErrorCategories } from './error-logger';

/**
 * Test error scenarios for dashboard widgets
 */
export class ErrorRecoveryTester {
  constructor() {
    this.errorHandling = useErrorHandling();
  }

  /**
   * Simulate network error
   * @param {string} widgetType - Widget to test
   * @returns {Error} Network error
   */
  createNetworkError(widgetType) {
    const error = new Error('Network request failed');
    error.code = 'NETWORK_ERROR';
    error.name = 'NetworkError';
    return error;
  }

  /**
   * Simulate API error
   * @param {string} widgetType - Widget to test
   * @param {number} status - HTTP status code
   * @returns {Error} API error
   */
  createApiError(widgetType, status = 500) {
    const error = new Error(`API request failed with status ${status}`);
    error.status = status;
    error.name = 'ApiError';
    return error;
  }

  /**
   * Simulate timeout error
   * @param {string} widgetType - Widget to test
   * @returns {Error} Timeout error
   */
  createTimeoutError(widgetType) {
    const error = new Error('Request timeout');
    error.code = 'TIMEOUT';
    error.name = 'TimeoutError';
    return error;
  }

  /**
   * Simulate parsing error
   * @param {string} widgetType - Widget to test
   * @returns {Error} Parsing error
   */
  createParsingError(widgetType) {
    const error = new Error('Failed to parse JSON response');
    error.name = 'SyntaxError';
    return error;
  }

  /**
   * Test automatic retry mechanism
   * @param {string} widgetType - Widget to test
   * @param {string} errorType - Type of error to simulate
   */
  async testAutoRetry(widgetType, errorType = 'network') {
    console.log(`Testing auto-retry for ${widgetType} with ${errorType} error`);
    
    let error;
    switch (errorType) {
      case 'network':
        error = this.createNetworkError(widgetType);
        break;
      case 'api':
        error = this.createApiError(widgetType);
        break;
      case 'timeout':
        error = this.createTimeoutError(widgetType);
        break;
      case 'parsing':
        error = this.createParsingError(widgetType);
        break;
      default:
        error = new Error('Unknown error');
    }

    // Log the error
    await logWidgetError(widgetType, error, {
      testScenario: `auto-retry-${errorType}`,
      timestamp: Date.now()
    });

    // Simulate the error in error handling system
    this.errorHandling.setWidgetError(widgetType, error);

    // Test if retry is available
    const canRetry = this.errorHandling.canRetry(widgetType);
    console.log(`Can retry ${widgetType}:`, canRetry);

    // Test retry function
    if (canRetry) {
      try {
        await this.errorHandling.retryWidget(
          () => this.simulateSuccessfulRetry(widgetType),
          widgetType
        );
        console.log(`Retry successful for ${widgetType}`);
      } catch (retryError) {
        console.log(`Retry failed for ${widgetType}:`, retryError.message);
      }
    }

    return {
      widgetType,
      errorType,
      canRetry,
      error: this.errorHandling.getWidgetError(widgetType)
    };
  }

  /**
   * Simulate successful retry
   * @param {string} widgetType - Widget type
   * @returns {Promise} Success promise
   */
  async simulateSuccessfulRetry(widgetType) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simulate successful response
    return {
      success: true,
      data: `Mock data for ${widgetType}`,
      timestamp: Date.now()
    };
  }

  /**
   * Test fallback data mechanism
   * @param {string} widgetType - Widget to test
   */
  testFallbackData(widgetType) {
    console.log(`Testing fallback data for ${widgetType}`);
    
    const networkError = this.createNetworkError(widgetType);
    this.errorHandling.setWidgetError(widgetType, networkError);
    
    const shouldShowFallback = this.errorHandling.shouldShowFallback(widgetType);
    const fallbackData = this.errorHandling.createFallbackData(widgetType, [
      { id: 1, name: 'Cached Item 1' },
      { id: 2, name: 'Cached Item 2' }
    ]);

    console.log(`Should show fallback for ${widgetType}:`, shouldShowFallback);
    console.log(`Fallback data:`, fallbackData);

    return {
      widgetType,
      shouldShowFallback,
      fallbackData
    };
  }

  /**
   * Test error logging functionality
   * @param {string} widgetType - Widget to test
   */
  async testErrorLogging(widgetType) {
    console.log(`Testing error logging for ${widgetType}`);
    
    const errors = [
      this.createNetworkError(widgetType),
      this.createApiError(widgetType, 404),
      this.createTimeoutError(widgetType),
      this.createParsingError(widgetType)
    ];

    const logResults = [];
    
    for (const error of errors) {
      const logEntry = await logWidgetError(widgetType, error, {
        testScenario: 'error-logging-test',
        errorType: error.name
      });
      logResults.push(logEntry);
    }

    // Get error statistics
    const stats = errorLogger.getErrorStats();
    console.log('Error statistics:', stats);

    return {
      widgetType,
      loggedErrors: logResults.length,
      stats
    };
  }

  /**
   * Test complete error recovery flow
   * @param {string} widgetType - Widget to test
   */
  async testCompleteFlow(widgetType) {
    console.log(`Testing complete error recovery flow for ${widgetType}`);
    
    const results = {
      widgetType,
      autoRetry: null,
      fallbackData: null,
      errorLogging: null,
      finalState: null
    };

    try {
      // Test auto-retry
      results.autoRetry = await this.testAutoRetry(widgetType, 'network');
      
      // Test fallback data
      results.fallbackData = this.testFallbackData(widgetType);
      
      // Test error logging
      results.errorLogging = await this.testErrorLogging(widgetType);
      
      // Get final error state
      results.finalState = {
        hasError: this.errorHandling.hasWidgetError(widgetType),
        canRetry: this.errorHandling.canRetry(widgetType),
        errorMessage: this.errorHandling.getWidgetErrorMessage(widgetType),
        retryCount: this.errorHandling.retryCounts[widgetType]
      };

    } catch (error) {
      console.error(`Error during complete flow test for ${widgetType}:`, error);
      results.error = error.message;
    }

    return results;
  }

  /**
   * Run all error recovery tests
   */
  async runAllTests() {
    console.log('Starting comprehensive error recovery tests...');
    
    const widgets = ['gifts', 'equipment', 'levels', 'users'];
    const results = {};

    for (const widget of widgets) {
      console.log(`\n--- Testing ${widget} widget ---`);
      results[widget] = await this.testCompleteFlow(widget);
    }

    console.log('\n--- Test Results Summary ---');
    console.log(JSON.stringify(results, null, 2));

    return results;
  }

  /**
   * Clear all test data
   */
  clearTestData() {
    // Clear error states
    this.errorHandling.clearAllErrors();
    
    // Clear stored error logs
    errorLogger.clearStoredLogs({
      category: ErrorCategories.WIDGET
    });
    
    console.log('Test data cleared');
  }
}

// Export singleton instance for easy use
export const errorRecoveryTester = new ErrorRecoveryTester();

// Export convenience methods
export const testWidgetErrorRecovery = (widgetType) => 
  errorRecoveryTester.testCompleteFlow(widgetType);

export const testAllWidgetErrorRecovery = () => 
  errorRecoveryTester.runAllTests();

export const clearErrorTestData = () => 
  errorRecoveryTester.clearTestData();

// Development helper - expose to window for manual testing
if (process.env.NODE_ENV === 'development') {
  window.errorRecoveryTester = errorRecoveryTester;
  window.testWidgetErrorRecovery = testWidgetErrorRecovery;
  window.testAllWidgetErrorRecovery = testAllWidgetErrorRecovery;
  window.clearErrorTestData = clearErrorTestData;
}