/**
 * VIP Service Usage Examples
 * 
 * Demonstrates how to use the enhanced VIP service with comprehensive
 * error handling, validation, and loading state management.
 */

import vipService from '../services/api/vip.service.js';
import { useVipLoading } from '../utils/vip-loading-manager.js';

/**
 * Example 1: Basic VIP package loading with error handling
 */
export async function loadVipPackagesExample() {
  try {
    console.log('Loading VIP packages...');
    
    // Check if already loading
    if (vipService.isLoading('getAll')) {
      console.log('Already loading VIP packages, please wait...');
      return;
    }
    
    // Load VIP packages with automatic retry logic
    const { items } = await vipService.getAll();
    
    console.log(`✅ Loaded ${items.length} VIP packages successfully`);
    return items;
    
  } catch (error) {
    // Error is already user-friendly thanks to enhanced error handling
    console.error('❌ Failed to load VIP packages:', error.message);
    console.error('Error code:', error.code);
    
    // Handle specific error types
    switch (error.code) {
      case 'NETWORK_ERROR':
        console.log('💡 Suggestion: Check your internet connection');
        break;
      case 'AUTH_FAILED':
        console.log('💡 Suggestion: Please log in again');
        break;
      case 'API_UNAVAILABLE':
        console.log('💡 Suggestion: Try again in a few minutes');
        break;
      default:
        console.log('💡 Suggestion: Contact support if the issue persists');
    }
    
    throw error;
  }
}

/**
 * Example 2: Update privilege with validation and error handling
 */
export async function updatePrivilegeExample(vipId, privilegeId, isActive) {
  try {
    console.log(`Updating privilege ${privilegeId} for VIP ${vipId}...`);
    
    // The service will automatically validate parameters
    const response = await vipService.updatePrivilege({
      vipId,
      privilegeId,
      isActive
    });
    
    console.log('✅ Privilege updated successfully');
    return response;
    
  } catch (error) {
    console.error('❌ Failed to update privilege:', error.message);
    
    // Handle validation errors
    if (error.code?.startsWith('MISSING_') || error.code?.startsWith('INVALID_')) {
      console.log('💡 Validation error - please check your input parameters');
    }
    
    throw error;
  }
}

/**
 * Example 3: Using loading states in a Vue component
 */
export function createVueComponentExample() {
  return {
    setup() {
      // Use the VIP loading composable
      const { loadingStates, isAnyLoading, isLoading } = useVipLoading();
      
      const loadPackages = async () => {
        try {
          await loadVipPackagesExample();
        } catch (error) {
          // Handle error in component
          console.error('Component error:', error.message);
        }
      };
      
      const updatePrivilege = async (vipId, privilegeId, isActive) => {
        try {
          await updatePrivilegeExample(vipId, privilegeId, isActive);
        } catch (error) {
          // Handle error in component
          console.error('Component error:', error.message);
        }
      };
      
      return {
        loadingStates,
        isAnyLoading,
        isLoadingPackages: computed(() => isLoading('getAll')),
        isUpdatingPrivilege: computed(() => isLoading('updatePrivilege')),
        loadPackages,
        updatePrivilege
      };
    },
    
    template: `
      <div>
        <button 
          @click="loadPackages" 
          :disabled="isLoadingPackages"
        >
          {{ isLoadingPackages ? 'Loading...' : 'Load VIP Packages' }}
        </button>
        
        <div v-if="isAnyLoading" class="loading-indicator">
          <span>Processing VIP operations...</span>
        </div>
      </div>
    `
  };
}

/**
 * Example 4: Advanced error handling with custom options
 */
export async function advancedErrorHandlingExample() {
  try {
    // Load with custom retry settings
    const packages = await vipService.getAll({ 
      maxRetries: 5 // Override default 3 retries
    });
    
    // Update without retry for immediate feedback
    await vipService.updatePrivilege({
      vipId: 1,
      privilegeId: 2,
      isActive: true
    }, { 
      skipRetry: true // Skip retry logic
    });
    
    console.log('✅ Advanced operations completed');
    
  } catch (error) {
    console.error('❌ Advanced operation failed:', error.message);
    
    // Access additional error context
    if (error.operation) {
      console.log('Failed operation:', error.operation);
    }
    if (error.timestamp) {
      console.log('Error timestamp:', error.timestamp);
    }
    if (error.context) {
      console.log('Error context:', error.context);
    }
  }
}

/**
 * Example 5: Monitoring loading statistics
 */
export function monitorLoadingStates() {
  // Get current loading statistics
  const stats = vipService.getLoadingStatistics();
  
  console.log('Loading Statistics:', {
    activeOperations: stats.activeOperations,
    totalActiveRequests: stats.totalActiveRequests,
    activeRequests: stats.activeRequests
  });
  
  // Check specific operations
  console.log('Is loading packages:', vipService.isLoading('getAll'));
  console.log('Is updating privileges:', vipService.isLoading('updatePrivilege'));
  console.log('Any operation loading:', vipService.isAnyLoading());
}

/**
 * Example 6: Error handling for deprecated methods (backward compatibility)
 */
export async function backwardCompatibilityExample() {
  try {
    // These methods are deprecated but still work with enhanced error handling
    const formData = new FormData();
    formData.append('name', 'Test Option');
    formData.append('description', 'Test Description');
    
    const newOption = await vipService.create(1, formData);
    console.log('✅ Created option (deprecated method):', newOption);
    
    const updatedOption = await vipService.toggleStatus(newOption.item.id, false);
    console.log('✅ Toggled status (deprecated method):', updatedOption);
    
  } catch (error) {
    console.error('❌ Deprecated method failed:', error.message);
    console.warn('💡 Consider migrating to updatePrivilege() method');
  }
}

// Export all examples
export default {
  loadVipPackagesExample,
  updatePrivilegeExample,
  createVueComponentExample,
  advancedErrorHandlingExample,
  monitorLoadingStates,
  backwardCompatibilityExample
};