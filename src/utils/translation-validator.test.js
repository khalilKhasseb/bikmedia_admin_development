/**
 * Translation Validator Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import TranslationValidator from './translation-validator.js';

describe('TranslationValidator', () => {
    let validator;
    let mockMessages;

    beforeEach(() => {
        validator = new TranslationValidator();
        mockMessages = {
            en: {
                bikmedia: {
                    store: {
                        gifts: 'Gifts',
                        equipment: 'Equipment'
                    },
                    actions: {
                        create: 'Create',
                        edit: 'Edit'
                    }
                },
                common: {
                    save: 'Save'
                }
            },
            ar: {
                bikmedia: {
                    store: {
                        gifts: 'الهدايا'
                        // equipment missing
                    },
                    actions: {
                        create: 'إنشاء',
                        edit: 'تعديل'
                    }
                }
                // common missing entirely
            }
        };
    });

    describe('hasTranslation', () => {
        it('should return true for existing translation', () => {
            expect(validator.hasTranslation('bikmedia.store.gifts', mockMessages.en)).toBe(true);
        });

        it('should return false for missing translation', () => {
            expect(validator.hasTranslation('bikmedia.store.nonexistent', mockMessages.en)).toBe(false);
        });

        it('should return false for null/undefined messages', () => {
            expect(validator.hasTranslation('test', null)).toBe(false);
            expect(validator.hasTranslation('test', undefined)).toBe(false);
        });
    });

    describe('validateKey', () => {
        it('should identify valid keys', () => {
            const result = validator.validateKey('bikmedia.store.gifts', mockMessages);
            expect(result.isValid).toBe(true);
            expect(result.missingLocales).toEqual([]);
        });

        it('should identify invalid keys', () => {
            const result = validator.validateKey('bikmedia.store.equipment', mockMessages);
            expect(result.isValid).toBe(false);
            expect(result.missingLocales).toContain('ar');
        });

        it('should identify completely missing keys', () => {
            const result = validator.validateKey('common.save', mockMessages);
            expect(result.isValid).toBe(false);
            expect(result.missingLocales).toContain('ar');
        });
    });

    describe('getTranslationWithFallback', () => {
        it('should return translation from current locale if available', () => {
            const result = validator.getTranslationWithFallback('bikmedia.store.gifts', 'ar', mockMessages);
            expect(result).toBe('الهدايا');
        });

        it('should fallback to English if Arabic translation missing', () => {
            const result = validator.getTranslationWithFallback('bikmedia.store.equipment', 'ar', mockMessages);
            expect(result).toBe('Equipment');
        });

        it('should return key if no translation found in any locale', () => {
            const result = validator.getTranslationWithFallback('nonexistent.key', 'ar', mockMessages);
            expect(result).toBe('nonexistent.key');
        });
    });

    describe('interpolateParams', () => {
        it('should interpolate parameters correctly', () => {
            const result = validator.interpolateParams('Hello {name}!', { name: 'World' });
            expect(result).toBe('Hello World!');
        });

        it('should handle multiple parameters', () => {
            const result = validator.interpolateParams('{min} to {max} characters', { min: 5, max: 10 });
            expect(result).toBe('5 to 10 characters');
        });

        it('should leave unmatched parameters as is', () => {
            const result = validator.interpolateParams('Hello {name}!', { other: 'value' });
            expect(result).toBe('Hello {name}!');
        });
    });

    describe('extractAllKeys', () => {
        it('should extract all nested keys', () => {
            const keys = validator.extractAllKeys(mockMessages.en.bikmedia, 'bikmedia');
            expect(keys).toContain('bikmedia.store.gifts');
            expect(keys).toContain('bikmedia.store.equipment');
            expect(keys).toContain('bikmedia.actions.create');
            expect(keys).toContain('bikmedia.actions.edit');
        });

        it('should handle empty objects', () => {
            const keys = validator.extractAllKeys({});
            expect(keys).toEqual([]);
        });

        it('should handle null/undefined input', () => {
            expect(validator.extractAllKeys(null)).toEqual([]);
            expect(validator.extractAllKeys(undefined)).toEqual([]);
        });
    });

    describe('validateBikmediaTranslations', () => {
        it('should generate comprehensive validation report', () => {
            const report = validator.validateBikmediaTranslations(mockMessages);
            
            expect(report.totalKeys).toBeGreaterThan(0);
            expect(report.validKeys).toBeGreaterThan(0);
            expect(report.invalidKeys).toBeGreaterThan(0);
            expect(report.localeCompleteness.en.percentage).toBe(100);
            expect(report.localeCompleteness.ar.percentage).toBeLessThan(100);
        });

        it('should track missing translations', () => {
            const report = validator.validateBikmediaTranslations(mockMessages);
            
            const equipmentMissing = report.missingTranslations.find(
                item => item.key === 'bikmedia.store.equipment'
            );
            expect(equipmentMissing).toBeDefined();
            expect(equipmentMissing.missingLocales).toContain('ar');
        });
    });
});

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log('Running translation validator tests...');
}