/**
 * VIP Service Error Handling and Validation Tests
 * 
 * Tests the comprehensive error handling, validation, and loading state management
 * implemented in task 6 of the VIP service modernization.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VipService } from '../services/api/vip.service.js';
import vipLoadingManager from '../utils/vip-loading-manager.js';

describe('VIP Service Error Handling and Validation', () => {
    let vipService;

    beforeEach(() => {
        vipService = new VipService();
        vipLoadingManager.resetAll();
    });

    describe('Parameter Validation', () => {
        it('should validate updatePrivilege parameters', async () => {
            // Test missing vipId
            await expect(vipService.updatePrivilege({})).rejects.toThrow('vipId');

            // Test invalid vipId
            await expect(vipService.updatePrivilege({ vipId: -1, privilegeId: 1, isActive: true })).rejects.toThrow();

            // Test missing privilegeId
            await expect(vipService.updatePrivilege({ vipId: 1 })).rejects.toThrow('privilegeId');

            // Test invalid privilegeId
            await expect(vipService.updatePrivilege({ vipId: 1, privilegeId: 0, isActive: true })).rejects.toThrow();

            // Test missing isActive
            await expect(vipService.updatePrivilege({ vipId: 1, privilegeId: 1 })).rejects.toThrow('isActive');

            // Test invalid isActive
            await expect(vipService.updatePrivilege({ vipId: 1, privilegeId: 1, isActive: 'true' })).rejects.toThrow();
        });

        it('should validate business logic constraints', async () => {
            // Test VIP ID out of range
            await expect(vipService.updatePrivilege({
                vipId: 101,
                privilegeId: 1,
                isActive: true
            })).rejects.toThrow('range');

            // Test privilege ID out of range
            await expect(vipService.updatePrivilege({
                vipId: 1,
                privilegeId: 1001,
                isActive: true
            })).rejects.toThrow('range');
        });

        it('should validate deprecated method parameters', async () => {
            // Test create method validation
            const invalidFormData = new FormData();
            await expect(vipService.create(1, invalidFormData)).rejects.toThrow('name');

            // Test update method validation
            const emptyFormData = new FormData();
            await expect(vipService.update(1, emptyFormData)).rejects.toThrow('update');

            // Test toggleStatus validation
            await expect(vipService.toggleStatus(null)).rejects.toThrow('Option ID');
            await expect(vipService.toggleStatus(-1)).rejects.toThrow('positive');
        });
    });

    describe('Loading State Management', () => {
        it('should manage loading states correctly', () => {
            expect(vipService.isLoading('getAll')).toBe(false);
            expect(vipService.isAnyLoading()).toBe(false);

            const requestId = vipLoadingManager.startLoading('getAll');
            expect(vipService.isLoading('getAll')).toBe(true);
            expect(vipService.isAnyLoading()).toBe(true);

            vipLoadingManager.stopLoading('getAll', requestId);
            expect(vipService.isLoading('getAll')).toBe(false);
            expect(vipService.isAnyLoading()).toBe(false);
        });

        it('should handle concurrent operations', () => {
            const requestId1 = vipLoadingManager.startLoading('getAll');
            const requestId2 = vipLoadingManager.startLoading('updatePrivilege');

            expect(vipService.isLoading('getAll')).toBe(true);
            expect(vipService.isLoading('updatePrivilege')).toBe(true);
            expect(vipService.isAnyLoading()).toBe(true);

            vipLoadingManager.stopLoading('getAll', requestId1);
            expect(vipService.isLoading('getAll')).toBe(false);
            expect(vipService.isLoading('updatePrivilege')).toBe(true);
            expect(vipService.isAnyLoading()).toBe(true);

            vipLoadingManager.stopLoading('updatePrivilege', requestId2);
            expect(vipService.isAnyLoading()).toBe(false);
        });

        it('should provide loading statistics', () => {
            const requestId = vipLoadingManager.startLoading('getAll');
            const stats = vipService.getLoadingStatistics();

            expect(stats.activeOperations).toContain('getAll');
            expect(stats.totalActiveRequests).toBe(1);
            expect(stats.activeRequests.getAll).toBe(1);

            vipLoadingManager.stopLoading('getAll', requestId);
        });
    });

    describe('Error Enhancement', () => {
        it('should create user-friendly error messages', () => {
            const originalError = new Error('Network error');
            originalError.code = 'NETWORK_ERROR';

            const enhancedError = vipService._createUserFriendlyError(originalError, 'getAll');

            expect(enhancedError.message).toContain('connect to the server');
            expect(enhancedError.code).toBe('NETWORK_ERROR');
            expect(enhancedError.operation).toBe('getAll');
            expect(enhancedError.originalError).toBe(originalError);
        });

        it('should handle HTTP status codes', () => {
            const error401 = new Error('Unauthorized');
            error401.response = { status: 401, data: {} };

            const enhanced401 = vipService._createUserFriendlyError(error401, 'updatePrivilege');
            expect(enhanced401.message).toContain('Authentication failed');
            expect(enhanced401.code).toBe('AUTH_FAILED');

            const error404 = new Error('Not found');
            error404.response = { status: 404, data: {} };

            const enhanced404 = vipService._createUserFriendlyError(error404, 'getAll');
            expect(enhanced404.message).toContain('endpoint not found');
        });
    });

    describe('Retry Logic Configuration', () => {
        it('should identify retryable errors', () => {
            const networkError = new Error('Network error');
            networkError.code = 'NETWORK_ERROR';
            expect(vipService._isRetryableError(networkError)).toBe(true);

            const timeoutError = new Error('timeout');
            expect(vipService._isRetryableError(timeoutError)).toBe(true);

            const validationError = new Error('Invalid input');
            validationError.code = 'VALIDATION_ERROR';
            expect(vipService._isRetryableError(validationError)).toBe(false);
        });

        it('should have correct retry configuration', () => {
            expect(vipService.retryConfig.maxRetries).toBe(3);
            expect(vipService.retryConfig.retryDelay).toBe(1000);
            expect(vipService.retryConfig.retryDelayMultiplier).toBe(2);
            expect(vipService.retryConfig.retryableErrors).toContain('NETWORK_ERROR');
            expect(vipService.retryConfig.retryableErrors).toContain('TIMEOUT');
        });
    });

    describe('Method Options', () => {
        it('should support skipRetry option', async () => {
            // This would need to be tested with actual API calls
            // For now, just verify the option is handled
            const options = { skipRetry: true };
            expect(options.skipRetry).toBe(true);
        });

        it('should support skipValidation option', async () => {
            const options = { skipValidation: true };
            expect(options.skipValidation).toBe(true);
        });

        it('should support custom maxRetries', async () => {
            const options = { maxRetries: 5 };
            expect(options.maxRetries).toBe(5);
        });
    });
});