/**
 * Common utilities for entity configurations
 * @module config/entities/helpers
 */

/**
 * Standard supported locales (EN and AR)
 * @type {import('./types.js').LocaleConfig[]}
 */
export const STANDARD_LOCALES = [
  { code: 'en', label: 'English', direction: 'ltr' },
  { code: 'ar', label: 'العربية', direction: 'rtl' },
//   { code: 'fa', label: 'فارسی', direction: 'rtl' }
];

/**
 * Generate suffixed field names for API
 * @param {string} fieldName - Base field name
 * @param {string[]} localeCodes - Array of locale codes
 * @returns {string[]} Array of suffixed field names
 * 
 * @example
 * generateSuffixedFields('name', ['en', 'ar']) // ['nameEN', 'nameAR']
 */
export function generateSuffixedFields(fieldName, localeCodes) {
  return localeCodes.map(code => `${fieldName}${code.toUpperCase()}`);
}

/**
 * Get locale by code
 * @param {string} code - Locale code
 * @returns {import('./types.js').LocaleConfig|undefined} Locale config or undefined
 */
export function getLocaleByCode(code) {
  return STANDARD_LOCALES.find(locale => locale.code === code);
}

/**
 * Validate entity configuration
 * @param {import('./types.js').EntityConfig} config - Entity configuration
 * @throws {Error} If configuration is invalid
 */
export function validateEntityConfig(config) {
  if (!config.entityName) {
    throw new Error('Entity configuration must have an entityName');
  }
  if (!config.apiEndpoint) {
    throw new Error('Entity configuration must have an apiEndpoint');
  }
  if (!config.supportedLocales || config.supportedLocales.length === 0) {
    throw new Error('Entity configuration must have at least one supported locale');
  }
}
