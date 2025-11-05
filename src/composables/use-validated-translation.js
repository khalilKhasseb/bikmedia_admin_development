/**
 * Enhanced translation composable with validation and fallback support
 */

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTranslationValidator } from '@/utils/translation-validator.js';

/**
 * Composable for validated translations with fallback support
 * @returns {Object} Enhanced translation utilities
 */
export function useValidatedTranslation() {
    const { t: originalT, locale, messages } = useI18n();
    const { validator } = useTranslationValidator();

    /**
     * Enhanced translation function with validation and fallback
     * @param {string} key - Translation key
     * @param {Object} params - Translation parameters
     * @param {Object} options - Translation options
     * @returns {string} Translated text with fallback support
     */
    const t = (key, params = {}, options = {}) => {
        const currentLocale = locale.value;
        const allMessages = messages.value;

        // Check if translation exists in current locale
        if (validator.hasTranslation(key, allMessages[currentLocale])) {
            return originalT(key, params, options);
        }

        // Use validator fallback mechanism
        return validator.getTranslationWithFallback(key, currentLocale, allMessages, params);
    };

    /**
     * Translation function that returns null if key doesn't exist (no fallback)
     * @param {string} key - Translation key
     * @param {Object} params - Translation parameters
     * @returns {string|null} Translated text or null if not found
     */
    const tStrict = (key, params = {}) => {
        const currentLocale = locale.value;
        const allMessages = messages.value;

        if (validator.hasTranslation(key, allMessages[currentLocale])) {
            return originalT(key, params);
        }

        return null;
    };

    /**
     * Check if a translation key exists in current locale
     * @param {string} key - Translation key to check
     * @returns {boolean} True if translation exists
     */
    const hasTranslation = (key) => {
        const currentLocale = locale.value;
        const allMessages = messages.value;
        return validator.hasTranslation(key, allMessages[currentLocale]);
    };

    /**
     * Check if a translation key exists in any supported locale
     * @param {string} key - Translation key to check
     * @returns {boolean} True if translation exists in any locale
     */
    const hasTranslationInAnyLocale = (key) => {
        const allMessages = messages.value;
        const validation = validator.validateKey(key, allMessages);
        return validation.isValid || validation.missingLocales.length < validator.supportedLocales.length;
    };

    /**
     * Get translation with explicit locale
     * @param {string} key - Translation key
     * @param {string} targetLocale - Target locale
     * @param {Object} params - Translation parameters
     * @returns {string} Translated text with fallback
     */
    const tLocale = (key, targetLocale, params = {}) => {
        const allMessages = messages.value;
        return validator.getTranslationWithFallback(key, targetLocale, allMessages, params);
    };

    /**
     * Get all available translations for a key
     * @param {string} key - Translation key
     * @returns {Object} Object with locale as key and translation as value
     */
    const getAllTranslations = (key) => {
        const allMessages = messages.value;
        const translations = {};

        validator.supportedLocales.forEach(loc => {
            if (validator.hasTranslation(key, allMessages[loc])) {
                translations[loc] = validator.extractTranslation(key, allMessages[loc]);
            }
        });

        return translations;
    };

    /**
     * Computed property for bikmedia-specific translations
     */
    const bikmedia = computed(() => ({
        store: {
            gifts: t('bikmedia.store.gifts'),
            equipment: t('bikmedia.store.equipment'),
            levels: t('bikmedia.store.levels'),
            title: t('bikmedia.store.title')
        },
        actions: {
            create: t('bikmedia.actions.create'),
            edit: t('bikmedia.actions.edit'),
            delete: t('bikmedia.actions.delete'),
            save: t('bikmedia.actions.save'),
            cancel: t('bikmedia.actions.cancel'),
            view: t('bikmedia.actions.view'),
            search: t('bikmedia.actions.search'),
            filter: t('bikmedia.actions.filter')
        },
        messages: {
            loading: t('bikmedia.messages.loading'),
            success: {
                created: t('bikmedia.messages.success.created'),
                updated: t('bikmedia.messages.success.updated'),
                deleted: t('bikmedia.messages.success.deleted')
            },
            errors: {
                network: t('bikmedia.messages.errors.network'),
                server: t('bikmedia.messages.errors.server'),
                notFound: t('bikmedia.messages.errors.notFound')
            }
        }
    }));

    /**
     * Helper function for form validation messages
     * @param {string} field - Field name
     * @param {string} rule - Validation rule
     * @param {Object} params - Validation parameters
     * @returns {string} Validation message
     */
    const validationMessage = (field, rule, params = {}) => {
        const key = `bikmedia.forms.validation.${rule}`;
        return t(key, { field: t(`bikmedia.forms.${field}`), ...params });
    };

    /**
     * Helper function for API error messages
     * @param {number|string} errorCode - HTTP status code or error type
     * @returns {string} Error message
     */
    const apiErrorMessage = (errorCode) => {
        const key = `bikmedia.messages.errors.api.${errorCode}`;
        return hasTranslation(key) ? t(key) : t('bikmedia.messages.errors.unknown');
    };

    /**
     * Helper function for confirmation messages
     * @param {string} action - Action type (delete, update, etc.)
     * @param {string} entity - Entity type (gift, equipment, level)
     * @returns {string} Confirmation message
     */
    const confirmationMessage = (action, entity = '') => {
        const specificKey = `bikmedia.messages.confirmations.${action}${entity ? entity.charAt(0).toUpperCase() + entity.slice(1) : ''}`;
        const genericKey = `bikmedia.messages.confirmations.${action}`;
        
        return hasTranslation(specificKey) ? t(specificKey) : t(genericKey);
    };

    return {
        // Core translation functions
        t,
        tStrict,
        tLocale,
        
        // Validation functions
        hasTranslation,
        hasTranslationInAnyLocale,
        getAllTranslations,
        
        // Convenience computed properties
        bikmedia,
        
        // Helper functions
        validationMessage,
        apiErrorMessage,
        confirmationMessage,
        
        // Original i18n utilities
        locale,
        messages
    };
}