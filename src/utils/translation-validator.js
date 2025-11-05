/**
 * Translation Validation Utility
 * 
 * This utility provides comprehensive translation validation including:
 * - Validation of all translation keys presence
 * - Development warnings for missing translations
 * - Fallback mechanism for missing Arabic translations
 */

import { nextTick } from 'vue';

class TranslationValidator {
    constructor() {
        this.missingKeys = new Set();
        this.checkedKeys = new Set();
        this.isDevelopment = import.meta.env.DEV;
        this.warningsEnabled = this.isDevelopment;
        this.fallbackLocale = 'en';
        this.supportedLocales = ['en', 'ar'];
    }

    /**
     * Validate if a translation key exists in all supported locales
     * @param {string} key - Translation key to validate
     * @param {Object} messages - i18n messages object
     * @returns {Object} Validation result with missing locales
     */
    validateKey(key, messages) {
        const result = {
            isValid: true,
            missingLocales: [],
            key: key
        };

        for (const locale of this.supportedLocales) {
            if (!this.hasTranslation(key, messages[locale])) {
                result.isValid = false;
                result.missingLocales.push(locale);
            }
        }

        return result;
    }

    /**
     * Check if a translation key exists in a locale object
     * @param {string} key - Translation key (dot notation)
     * @param {Object} localeMessages - Locale messages object
     * @returns {boolean} True if translation exists
     */
    hasTranslation(key, localeMessages) {
        if (!localeMessages || typeof localeMessages !== 'object') {
            return false;
        }

        const keys = key.split('.');
        let current = localeMessages;

        for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
                current = current[k];
            } else {
                return false;
            }
        }

        return current !== null && current !== undefined && current !== '';
    }

    /**
     * Get translation value with fallback mechanism
     * @param {string} key - Translation key
     * @param {string} locale - Current locale
     * @param {Object} messages - i18n messages object
     * @param {Object} params - Translation parameters
     * @returns {string} Translation value or fallback
     */
    getTranslationWithFallback(key, locale, messages, params = {}) {
        // First try the requested locale
        if (this.hasTranslation(key, messages[locale])) {
            return this.extractTranslation(key, messages[locale], params);
        }

        // Log missing translation in development
        if (this.warningsEnabled && !this.checkedKeys.has(`${locale}.${key}`)) {
            console.warn(`[Translation Validator] Missing translation for key "${key}" in locale "${locale}"`);
            this.missingKeys.add(`${locale}.${key}`);
            this.checkedKeys.add(`${locale}.${key}`);
        }

        // Try fallback locale
        if (locale !== this.fallbackLocale && this.hasTranslation(key, messages[this.fallbackLocale])) {
            if (this.warningsEnabled) {
                console.info(`[Translation Validator] Using fallback locale "${this.fallbackLocale}" for key "${key}"`);
            }
            return this.extractTranslation(key, messages[this.fallbackLocale], params);
        }

        // Return key as last resort
        if (this.warningsEnabled) {
            console.error(`[Translation Validator] No translation found for key "${key}" in any locale`);
        }
        return key;
    }

    /**
     * Extract translation value from nested object
     * @param {string} key - Translation key
     * @param {Object} localeMessages - Locale messages object
     * @param {Object} params - Translation parameters
     * @returns {string} Translation value
     */
    extractTranslation(key, localeMessages, params = {}) {
        const keys = key.split('.');
        let current = localeMessages;

        for (const k of keys) {
            current = current[k];
        }

        if (typeof current === 'string') {
            return this.interpolateParams(current, params);
        }

        return current;
    }

    /**
     * Interpolate parameters in translation string
     * @param {string} translation - Translation string
     * @param {Object} params - Parameters to interpolate
     * @returns {string} Interpolated string
     */
    interpolateParams(translation, params) {
        if (!params || Object.keys(params).length === 0) {
            return translation;
        }

        return translation.replace(/\{(\w+)\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    /**
     * Validate all bikmedia translation keys
     * @param {Object} messages - i18n messages object
     * @returns {Object} Comprehensive validation report
     */
    validateBikmediaTranslations(messages) {
        const report = {
            totalKeys: 0,
            validKeys: 0,
            invalidKeys: 0,
            missingTranslations: [],
            localeCompleteness: {}
        };

        // Initialize locale completeness tracking
        this.supportedLocales.forEach(locale => {
            report.localeCompleteness[locale] = {
                total: 0,
                present: 0,
                missing: [],
                percentage: 0
            };
        });

        // Get all bikmedia keys from English (reference locale)
        const bikmediaKeys = this.extractAllKeys(messages.en?.bikmedia || {}, 'bikmedia');
        report.totalKeys = bikmediaKeys.length;

        // Validate each key
        bikmediaKeys.forEach(key => {
            const validation = this.validateKey(key, messages);
            
            if (validation.isValid) {
                report.validKeys++;
            } else {
                report.invalidKeys++;
                report.missingTranslations.push(validation);
            }

            // Update locale completeness
            this.supportedLocales.forEach(locale => {
                report.localeCompleteness[locale].total++;
                if (!validation.missingLocales.includes(locale)) {
                    report.localeCompleteness[locale].present++;
                } else {
                    report.localeCompleteness[locale].missing.push(key);
                }
            });
        });

        // Calculate percentages
        this.supportedLocales.forEach(locale => {
            const stats = report.localeCompleteness[locale];
            stats.percentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;
        });

        return report;
    }

    /**
     * Extract all translation keys from a nested object
     * @param {Object} obj - Object to extract keys from
     * @param {string} prefix - Key prefix
     * @returns {Array} Array of all keys
     */
    extractAllKeys(obj, prefix = '') {
        const keys = [];

        if (!obj || typeof obj !== 'object') {
            return keys;
        }

        Object.keys(obj).forEach(key => {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                keys.push(...this.extractAllKeys(obj[key], fullKey));
            } else {
                keys.push(fullKey);
            }
        });

        return keys;
    }

    /**
     * Generate missing translation keys report
     * @param {Object} messages - i18n messages object
     * @returns {Object} Missing keys report
     */
    generateMissingKeysReport(messages) {
        const report = this.validateBikmediaTranslations(messages);
        
        if (this.warningsEnabled) {
            console.group('[Translation Validator] Validation Report');
            console.log(`Total Keys: ${report.totalKeys}`);
            console.log(`Valid Keys: ${report.validKeys}`);
            console.log(`Invalid Keys: ${report.invalidKeys}`);
            
            if (report.invalidKeys > 0) {
                console.group('Missing Translations:');
                report.missingTranslations.forEach(missing => {
                    console.warn(`Key: ${missing.key}, Missing in: ${missing.missingLocales.join(', ')}`);
                });
                console.groupEnd();
            }

            console.group('Locale Completeness:');
            Object.entries(report.localeCompleteness).forEach(([locale, stats]) => {
                console.log(`${locale.toUpperCase()}: ${stats.percentage}% (${stats.present}/${stats.total})`);
                if (stats.missing.length > 0 && stats.missing.length <= 10) {
                    console.log(`  Missing: ${stats.missing.join(', ')}`);
                } else if (stats.missing.length > 10) {
                    console.log(`  Missing: ${stats.missing.slice(0, 10).join(', ')} ... and ${stats.missing.length - 10} more`);
                }
            });
            console.groupEnd();
            
            console.groupEnd();
        }

        return report;
    }

    /**
     * Enable or disable development warnings
     * @param {boolean} enabled - Whether to enable warnings
     */
    setWarningsEnabled(enabled) {
        this.warningsEnabled = enabled && this.isDevelopment;
    }

    /**
     * Clear tracked missing keys
     */
    clearTrackedKeys() {
        this.missingKeys.clear();
        this.checkedKeys.clear();
    }

    /**
     * Get all tracked missing keys
     * @returns {Array} Array of missing keys
     */
    getMissingKeys() {
        return Array.from(this.missingKeys);
    }
}

// Create singleton instance
const translationValidator = new TranslationValidator();

/**
 * Vue plugin for translation validation
 */
export const TranslationValidatorPlugin = {
    install(app, options = {}) {
        // Configure validator
        if (options.warningsEnabled !== undefined) {
            translationValidator.setWarningsEnabled(options.warningsEnabled);
        }

        if (options.fallbackLocale) {
            translationValidator.fallbackLocale = options.fallbackLocale;
        }

        if (options.supportedLocales) {
            translationValidator.supportedLocales = options.supportedLocales;
        }

        // Add global properties
        app.config.globalProperties.$translationValidator = translationValidator;

        // Provide for composition API
        app.provide('translationValidator', translationValidator);
    }
};

/**
 * Enhanced translation function with validation
 * @param {Function} originalT - Original i18n t function
 * @param {Object} i18n - i18n instance
 * @returns {Function} Enhanced t function
 */
export function createValidatedTranslation(originalT, i18n) {
    return function(key, params, options) {
        const currentLocale = i18n.global.locale.value;
        const messages = i18n.global.messages.value;

        // Use validator for fallback if key is missing
        if (!translationValidator.hasTranslation(key, messages[currentLocale])) {
            return translationValidator.getTranslationWithFallback(key, currentLocale, messages, params);
        }

        // Use original function if translation exists
        return originalT(key, params, options);
    };
}

/**
 * Composable for using translation validator
 * @returns {Object} Translation validator utilities
 */
export function useTranslationValidator() {
    return {
        validator: translationValidator,
        validateKey: (key, messages) => translationValidator.validateKey(key, messages),
        hasTranslation: (key, locale, messages) => translationValidator.hasTranslation(key, messages[locale]),
        generateReport: (messages) => translationValidator.generateMissingKeysReport(messages),
        clearTrackedKeys: () => translationValidator.clearTrackedKeys(),
        getMissingKeys: () => translationValidator.getMissingKeys()
    };
}

export default translationValidator;