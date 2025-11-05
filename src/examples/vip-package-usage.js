/**
 * VIP Package Management System - Usage Examples
 * 
 * This file demonstrates how to use the VIP package management system
 * in different scenarios and contexts.
 */

import vipService from '@/services/api/vip.service';
import vipConfig from '@/config/entities/vip.config';
import { initializeFormData, validateEntityFields, buildDynamicPayload } from '@/config/entities/helpers';

// ========================================
// 1. BASIC VIP PACKAGE OPERATIONS
// ========================================

/**
 * Example: Load all VIP packages
 */
export async function loadVipPackagesExample() {
  try {
    console.log('Loading VIP packages...');
    
    const { items, raw } = await vipService.getAll();
    
    console.log('Loaded packages:', items);
    console.log('Raw API response:', raw);
    
    return items;
  } catch (error) {
    console.error('Failed to load VIP packages:', error.message);
    throw error;
  }
}

/**
 * Example: Update a VIP package
 */
export async function updateVipPackageExample(packageId, updateData) {
  try {
    console.log('Updating VIP package:', packageId, updateData);
    
    const response = await vipService.updatePackage(packageId, updateData);
    
    console.log('Package updated successfully:', response.data.data);
    
    return response.data.data;
  } catch (error) {
    console.error('Failed to update VIP package:', error.message);
    throw error;
  }
}

/**
 * Example: Toggle VIP package privilege
 */
export async function togglePrivilegeExample(vipId, privilegeId, isActive) {
  try {
    console.log('Toggling privilege:', { vipId, privilegeId, isActive });
    
    const response = await vipService.updatePrivilege({
      vipId,
      privilegeId,
      isActive
    });
    
    console.log('Privilege toggled successfully:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Failed to toggle privilege:', error.message);
    throw error;
  }
}

// ========================================
// 2. FORM DATA MANAGEMENT
// ========================================

/**
 * Example: Initialize form data for a new VIP package
 */
export function initializeVipFormExample() {
  console.log('Initializing VIP form data...');
  
  const formData = initializeFormData(vipConfig);
  
  console.log('Initialized form data:', formData);
  
  return formData;
}

/**
 * Example: Initialize form data with existing package data
 */
export function populateVipFormExample(existingPackage) {
  console.log('Populating VIP form with existing data:', existingPackage);
  
  const formData = initializeFormData(vipConfig, existingPackage);
  
  console.log('Populated form data:', formData);
  
  return formData;
}

/**
 * Example: Validate VIP form data
 */
export function validateVipFormExample(formData) {
  console.log('Validating VIP form data:', formData);
  
  const { valid, errors } = validateEntityFields(vipConfig, formData);
  
  console.log('Validation result:', { valid, errors });
  
  return { valid, errors };
}

/**
 * Example: Build payload for VIP package update
 */
export function buildVipPayloadExample(formData, originalData, mode = 'update') {
  console.log('Building VIP payload:', { formData, originalData, mode });
  
  const payload = buildDynamicPayload(
    vipConfig,
    formData,
    originalData,
    mode,
    { id: originalData?.id, updateStrategy: 'changed' }
  );
  
  console.log('Built payload:', payload);
  
  return payload;
}

// ========================================
// 3. COMPLETE WORKFLOW EXAMPLES
// ========================================

/**
 * Example: Complete VIP package edit workflow
 */
export async function completeEditWorkflowExample(packageId) {
  try {
    console.log('Starting complete edit workflow for package:', packageId);
    
    // Step 1: Load all packages to find the target package
    const { items } = await vipService.getAll();
    const targetPackage = items.find(pkg => pkg.id === packageId);
    
    if (!targetPackage) {
      throw new Error(`Package with ID ${packageId} not found`);
    }
    
    console.log('Found target package:', targetPackage);
    
    // Step 2: Initialize form data with existing package data
    const formData = initializeFormData(vipConfig, targetPackage);
    
    // Step 3: Simulate user making changes
    formData.name = 'Updated VIP Package Name';
    formData.coin = 2000;
    formData.days = 60;
    formData.content = 'Updated package description';
    
    console.log('Modified form data:', formData);
    
    // Step 4: Validate the form data
    const { valid, errors } = validateEntityFields(vipConfig, formData);
    
    if (!valid) {
      console.error('Form validation failed:', errors);
      throw new Error('Form validation failed');
    }
    
    // Step 5: Build update payload
    const payload = buildDynamicPayload(
      vipConfig,
      formData,
      targetPackage,
      'update',
      { id: packageId, updateStrategy: 'changed' }
    );
    
    console.log('Update payload:', payload);
    
    // Step 6: Update the package
    const response = await vipService.updatePackage(packageId, payload);
    
    console.log('Package updated successfully:', response.data.data);
    
    return response.data.data;
    
  } catch (error) {
    console.error('Complete edit workflow failed:', error.message);
    throw error;
  }
}

/**
 * Example: Bulk privilege management
 */
export async function bulkPrivilegeManagementExample(vipId, privilegeUpdates) {
  try {
    console.log('Starting bulk privilege management:', { vipId, privilegeUpdates });
    
    const results = [];
    
    for (const update of privilegeUpdates) {
      try {
        const result = await vipService.updatePrivilege({
          vipId,
          privilegeId: update.privilegeId,
          isActive: update.isActive
        });
        
        results.push({
          privilegeId: update.privilegeId,
          success: true,
          data: result.data
        });
        
        console.log(`Privilege ${update.privilegeId} updated successfully`);
        
      } catch (error) {
        results.push({
          privilegeId: update.privilegeId,
          success: false,
          error: error.message
        });
        
        console.error(`Failed to update privilege ${update.privilegeId}:`, error.message);
      }
    }
    
    console.log('Bulk privilege management completed:', results);
    
    return results;
    
  } catch (error) {
    console.error('Bulk privilege management failed:', error.message);
    throw error;
  }
}

// ========================================
// 4. ERROR HANDLING EXAMPLES
// ========================================

/**
 * Example: Handling network errors with retry
 */
export async function networkErrorHandlingExample() {
  try {
    console.log('Testing network error handling...');
    
    // This will use the built-in retry logic
    const { items } = await vipService.getAll();
    
    console.log('Request succeeded:', items.length, 'packages loaded');
    
    return items;
    
  } catch (error) {
    console.error('Request failed after retries:', error.message);
    console.error('Error code:', error.code);
    console.error('Original error:', error.originalError);
    
    // Handle different error types
    switch (error.code) {
      case 'NETWORK_ERROR':
        console.log('Network error - check internet connection');
        break;
      case 'TIMEOUT':
        console.log('Request timeout - try again later');
        break;
      case 'SERVER_ERROR':
        console.log('Server error - contact support');
        break;
      default:
        console.log('Unknown error - check logs');
    }
    
    throw error;
  }
}

/**
 * Example: Handling validation errors
 */
export function validationErrorHandlingExample() {
  console.log('Testing validation error handling...');
  
  // Create invalid form data
  const invalidFormData = {
    name: '', // Required field is empty
    coin: -100, // Negative value
    days: 0, // Must be greater than zero
    renew_coin: 'invalid' // Should be a number
  };
  
  console.log('Invalid form data:', invalidFormData);
  
  // Validate the form
  const { valid, errors } = validateEntityFields(vipConfig, invalidFormData);
  
  console.log('Validation result:', { valid, errors });
  
  // Handle validation errors
  if (!valid) {
    console.log('Validation failed. Errors by field:');
    
    Object.entries(errors).forEach(([field, message]) => {
      console.log(`- ${field}: ${message}`);
    });
    
    // Return user-friendly error messages
    return {
      success: false,
      errors,
      message: 'Please fix the following errors before saving:'
    };
  }
  
  return { success: true };
}

// ========================================
// 5. LOADING STATE MANAGEMENT EXAMPLES
// ========================================

/**
 * Example: Monitor loading states
 */
export function loadingStateExample() {
  console.log('Monitoring VIP service loading states...');
  
  // Check if any operation is loading
  const isAnyLoading = vipService.isAnyLoading();
  console.log('Any operation loading:', isAnyLoading);
  
  // Check specific operation loading states
  const isLoadingAll = vipService.isLoading('getAll');
  const isUpdatingPrivilege = vipService.isLoading('updatePrivilege');
  const isUpdatingPackage = vipService.isLoading('updatePackage');
  
  console.log('Loading states:', {
    getAll: isLoadingAll,
    updatePrivilege: isUpdatingPrivilege,
    updatePackage: isUpdatingPackage
  });
  
  // Get all loading states
  const allStates = vipService.getLoadingStates();
  console.log('All loading states:', allStates);
  
  // Get loading statistics
  const stats = vipService.getLoadingStatistics();
  console.log('Loading statistics:', stats);
  
  return {
    isAnyLoading,
    specificStates: {
      getAll: isLoadingAll,
      updatePrivilege: isUpdatingPrivilege,
      updatePackage: isUpdatingPackage
    },
    allStates,
    stats
  };
}

// ========================================
// 6. INTEGRATION EXAMPLES
// ========================================

/**
 * Example: Vue component integration
 */
export const vueComponentIntegrationExample = {
  // This would be used in a Vue component's setup function
  setup() {
    const { ref, onMounted } = Vue;
    
    const vipPackages = ref([]);
    const isLoading = ref(false);
    const error = ref(null);
    
    const loadPackages = async () => {
      isLoading.value = true;
      error.value = null;
      
      try {
        const { items } = await vipService.getAll();
        vipPackages.value = items;
      } catch (err) {
        error.value = err.message;
        console.error('Failed to load VIP packages:', err);
      } finally {
        isLoading.value = false;
      }
    };
    
    const updatePackage = async (packageId, updateData) => {
      try {
        const updatedPackage = await vipService.updatePackage(packageId, updateData);
        
        // Update the package in the local list
        const index = vipPackages.value.findIndex(pkg => pkg.id === packageId);
        if (index !== -1) {
          vipPackages.value[index] = updatedPackage;
        }
        
        return updatedPackage;
      } catch (error) {
        console.error('Failed to update package:', error);
        throw error;
      }
    };
    
    onMounted(() => {
      loadPackages();
    });
    
    return {
      vipPackages,
      isLoading,
      error,
      loadPackages,
      updatePackage
    };
  }
};

// ========================================
// 7. TESTING HELPERS
// ========================================

/**
 * Example: Generate test data for VIP packages
 */
export function generateTestVipPackage(overrides = {}) {
  const basePackage = {
    id: Math.floor(Math.random() * 1000) + 1,
    name: 'Test VIP Package',
    coin: 1000,
    renew_coin: 800,
    days: 30,
    img: '/assets/images/test-vip.png',
    content: 'Test VIP package description',
    chat_bg_ids: '1,2,3',
    chat_bubble_ids: '4,5,6',
    avatar_frame_ids: '7,8,9',
    medal_ids: '10,11,12',
    car_ids: '13,14,15',
    colors: '#ff0000,#00ff00,#0000ff',
    entry_effects: 'sparkle,glow',
    room_images: 'room1.jpg,room2.jpg',
    state: 1,
    orderno: 100,
    lang_name: 'Test VIP'
  };
  
  return { ...basePackage, ...overrides };
}

/**
 * Example: Run all examples
 */
export async function runAllExamples() {
  console.log('Running all VIP package management examples...');
  
  try {
    // Basic operations
    console.log('\n=== Basic Operations ===');
    await loadVipPackagesExample();
    
    // Form management
    console.log('\n=== Form Management ===');
    initializeVipFormExample();
    
    const testPackage = generateTestVipPackage();
    populateVipFormExample(testPackage);
    
    // Validation
    console.log('\n=== Validation ===');
    validationErrorHandlingExample();
    
    // Loading states
    console.log('\n=== Loading States ===');
    loadingStateExample();
    
    console.log('\n=== All examples completed successfully ===');
    
  } catch (error) {
    console.error('Examples failed:', error.message);
  }
}

// Export all examples for easy access
export default {
  loadVipPackagesExample,
  updateVipPackageExample,
  togglePrivilegeExample,
  initializeVipFormExample,
  populateVipFormExample,
  validateVipFormExample,
  buildVipPayloadExample,
  completeEditWorkflowExample,
  bulkPrivilegeManagementExample,
  networkErrorHandlingExample,
  validationErrorHandlingExample,
  loadingStateExample,
  vueComponentIntegrationExample,
  generateTestVipPackage,
  runAllExamples
};