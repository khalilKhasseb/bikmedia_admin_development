/**
 * VIP Loading State Management Utility
 * 
 * Provides centralized loading state management for VIP service operations.
 * Supports multiple concurrent operations and provides reactive state updates.
 * 
 * @module utils/vip-loading-manager
 */

import { ref, reactive, computed } from 'vue';

/**
 * Global loading state manager for VIP operations
 */
class VipLoadingManager {
  constructor() {
    // Reactive loading states for each operation
    this.loadingStates = reactive({
      getAll: false,
      updatePrivilege: false,
      create: false,
      update: false,
      toggleStatus: false
    });
    
    // Track individual requests for concurrent operations
    this.requestCounters = reactive({
      getAll: 0,
      updatePrivilege: 0,
      create: 0,
      update: 0,
      toggleStatus: 0
    });
    
    // Track request metadata
    this.requestMetadata = reactive({});
  }

  /**
   * Start loading for a specific operation
   * 
   * @param {string} operation - Operation identifier
   * @param {Object} metadata - Optional metadata about the request
   * @returns {string} Request ID for tracking
   */
  startLoading(operation, metadata = {}) {
    if (!this.loadingStates.hasOwnProperty(operation)) {
      console.warn(`[VipLoadingManager] Unknown operation: ${operation}`);
      return null;
    }

    const requestId = `${operation}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Increment request counter
    this.requestCounters[operation]++;
    
    // Set loading state to true
    this.loadingStates[operation] = true;
    
    // Store request metadata
    this.requestMetadata[requestId] = {
      operation,
      startTime: Date.now(),
      metadata
    };

    if (import.meta.env.DEV) {
      console.log(`[VipLoadingManager] Started loading for ${operation} (ID: ${requestId})`);
    }

    return requestId;
  }

  /**
   * Stop loading for a specific operation
   * 
   * @param {string} operation - Operation identifier
   * @param {string} requestId - Optional request ID for tracking
   */
  stopLoading(operation, requestId = null) {
    if (!this.loadingStates.hasOwnProperty(operation)) {
      console.warn(`[VipLoadingManager] Unknown operation: ${operation}`);
      return;
    }

    // Decrement request counter
    if (this.requestCounters[operation] > 0) {
      this.requestCounters[operation]--;
    }

    // Set loading state to false only if no more requests are pending
    if (this.requestCounters[operation] === 0) {
      this.loadingStates[operation] = false;
    }

    // Clean up request metadata
    if (requestId && this.requestMetadata[requestId]) {
      const duration = Date.now() - this.requestMetadata[requestId].startTime;
      
      if (import.meta.env.DEV) {
        console.log(`[VipLoadingManager] Stopped loading for ${operation} (ID: ${requestId}, Duration: ${duration}ms)`);
      }
      
      delete this.requestMetadata[requestId];
    }
  }

  /**
   * Check if a specific operation is loading
   * 
   * @param {string} operation - Operation identifier
   * @returns {boolean} True if operation is loading
   */
  isLoading(operation) {
    return this.loadingStates[operation] || false;
  }

  /**
   * Check if any VIP operation is loading
   * 
   * @returns {boolean} True if any operation is loading
   */
  isAnyLoading() {
    return Object.values(this.loadingStates).some(state => state);
  }

  /**
   * Get all current loading states
   * 
   * @returns {Object} Object with all loading states
   */
  getAllLoadingStates() {
    return { ...this.loadingStates };
  }

  /**
   * Get loading state for multiple operations
   * 
   * @param {Array<string>} operations - Array of operation identifiers
   * @returns {Object} Object with loading states for specified operations
   */
  getLoadingStates(operations) {
    const states = {};
    for (const operation of operations) {
      states[operation] = this.loadingStates[operation] || false;
    }
    return states;
  }

  /**
   * Reset all loading states (useful for cleanup)
   */
  resetAll() {
    for (const operation in this.loadingStates) {
      this.loadingStates[operation] = false;
      this.requestCounters[operation] = 0;
    }
    
    // Clear all metadata
    for (const requestId in this.requestMetadata) {
      delete this.requestMetadata[requestId];
    }

    if (import.meta.env.DEV) {
      console.log('[VipLoadingManager] Reset all loading states');
    }
  }

  /**
   * Get statistics about current loading operations
   * 
   * @returns {Object} Statistics object
   */
  getStatistics() {
    const activeOperations = Object.entries(this.loadingStates)
      .filter(([, isLoading]) => isLoading)
      .map(([operation]) => operation);

    const totalActiveRequests = Object.values(this.requestCounters)
      .reduce((sum, count) => sum + count, 0);

    const activeRequests = Object.entries(this.requestCounters)
      .filter(([, count]) => count > 0)
      .reduce((acc, [operation, count]) => {
        acc[operation] = count;
        return acc;
      }, {});

    return {
      activeOperations,
      totalActiveRequests,
      activeRequests,
      totalOperations: Object.keys(this.loadingStates).length
    };
  }

  /**
   * Create a composable for Vue components
   * 
   * @param {Array<string>} operations - Operations to track (optional)
   * @returns {Object} Composable object with reactive loading states
   */
  createComposable(operations = null) {
    const targetOperations = operations || Object.keys(this.loadingStates);
    
    const loadingStates = computed(() => {
      const states = {};
      for (const operation of targetOperations) {
        states[operation] = this.loadingStates[operation];
      }
      return states;
    });

    const isAnyLoading = computed(() => {
      return targetOperations.some(operation => this.loadingStates[operation]);
    });

    return {
      loadingStates,
      isAnyLoading,
      isLoading: (operation) => this.isLoading(operation),
      startLoading: (operation, metadata) => this.startLoading(operation, metadata),
      stopLoading: (operation, requestId) => this.stopLoading(operation, requestId),
      getStatistics: () => this.getStatistics()
    };
  }
}

// Create singleton instance
const vipLoadingManager = new VipLoadingManager();

/**
 * Vue composable for VIP loading states
 * 
 * @param {Array<string>} operations - Operations to track (optional)
 * @returns {Object} Reactive loading state management
 * 
 * @example
 * // In a Vue component
 * import { useVipLoading } from '@/utils/vip-loading-manager';
 * 
 * export default {
 *   setup() {
 *     const { loadingStates, isAnyLoading, isLoading } = useVipLoading();
 *     
 *     return {
 *       loadingStates,
 *       isAnyLoading,
 *       isLoadingPackages: computed(() => isLoading('getAll')),
 *       isUpdatingPrivilege: computed(() => isLoading('updatePrivilege'))
 *     };
 *   }
 * };
 */
export const useVipLoading = (operations = null) => {
  return vipLoadingManager.createComposable(operations);
};

/**
 * Decorator function to automatically manage loading states
 * 
 * @param {string} operation - Operation identifier
 * @param {Object} options - Decorator options
 * @returns {Function} Decorator function
 * 
 * @example
 * class VipService {
 *   @withVipLoading('getAll')
 *   async getAll() {
 *     // Method implementation
 *   }
 * }
 */
export const withVipLoading = (operation, options = {}) => {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args) {
      const requestId = vipLoadingManager.startLoading(operation, options.metadata);
      
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } finally {
        vipLoadingManager.stopLoading(operation, requestId);
      }
    };
    
    return descriptor;
  };
};

// Export singleton instance and utilities
export default vipLoadingManager;
export { VipLoadingManager };