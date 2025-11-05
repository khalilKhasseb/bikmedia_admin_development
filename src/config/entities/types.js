/**
 * Shared type definitions for entity configurations
 * @module config/entities/types
 */

/**
 * Locale configuration object
 * @typedef {Object} LocaleConfig
 * @property {string} code - Locale code (e.g., 'en', 'ar')
 * @property {string} label - Display label for the locale
 * @property {'ltr'|'rtl'} direction - Text direction
 */

/**
 * Translatable field configuration
 * @typedef {Object} TranslatableField
 * @property {string} name - Base field name (without locale suffix)
 * @property {'text'|'textarea'} type - Field input type
 * @property {boolean} required - Whether the field is required
 * @property {boolean} [readOnly] - Whether the field is read-only
 * @property {number} [maxLength] - Maximum character length
 * @property {number} [rows] - Number of rows for textarea
 * @property {string} [label] - Field label
 * @property {Object.<string, string>} placeholder - Placeholder text per locale
 */

/**
 * Select option for dropdown fields
 * @typedef {Object} SelectOption
 * @property {number|string} value - Option value
 * @property {string} label - Option display label
 */

/**
 * Non-translatable field configuration
 * @typedef {Object} NonTranslatableField
 * @property {string} name - Field name
 * @property {'number'|'select'|'file'|'text'|'image'} type - Field type
 * @property {boolean} required - Whether the field is required
 * @property {boolean} [readOnly] - Whether the field is read-only
 * @property {number|string} [default] - Default value
 * @property {number} [min] - Minimum value for number fields
 * @property {number} [max] - Maximum value for number fields
 * @property {string} label - Field label
 * @property {string} [placeholder] - Placeholder text
 * @property {SelectOption[]} [options] - Options for select fields
 * @property {string} [accept] - Accepted file types
 * @property {boolean} [supportsUrlFallback] - Whether file field supports URL fallback
 * @property {number} [maxSize] - Maximum file size in MB
 * @property {string} [helpText] - Additional help text
 * @property {boolean} [display] - Whether to display in view
 * @property {string} [path] - Nested object path (e.g., 'level.icon')
 * @property {boolean} [primaryDisplayField] - Whether this is the primary display field
 * @property {string} [format] - Display format (e.g., 'number')
 */

/**
 * Nested field configuration for read-only entities
 * @typedef {Object} NestedField
 * @property {string} name - Field name
 * @property {'number'|'image'|'text'} type - Field type
 * @property {boolean} readOnly - Whether the field is read-only
 * @property {string} label - Field label
 * @property {boolean} display - Whether to display in view
 * @property {string} [path] - Nested object path (e.g., 'level.icon')
 * @property {boolean} [primaryDisplayField] - Whether this is the primary display field
 * @property {string} [format] - Display format (e.g., 'number')
 */

/**
 * Form section grouping
 * @typedef {Object} FormSection
 * @property {string} name - Section name
 * @property {string} label - Section display label
 * @property {string[]} fields - Array of field names in this section
 */

/**
 * View section grouping for read-only entities
 * @typedef {Object} ViewSection
 * @property {string} name - Section name
 * @property {string} label - Section display label
 * @property {string[]} fields - Array of field names in this section
 */

/**
 * Complete entity configuration
 * @typedef {Object} EntityConfig
 * @property {string} entityName - Entity name
 * @property {string} apiEndpoint - API endpoint path
 * @property {string} displayName - Display name (singular)
 * @property {string} pluralName - Display name (plural)
 * @property {boolean} [readOnly] - Whether entity is read-only
 * @property {boolean} [supportsCreate] - Whether entity supports create operation
 * @property {boolean} [supportsEdit] - Whether entity supports edit operation
 * @property {boolean} [supportsDelete] - Whether entity supports delete operation
 * @property {boolean} [supportsView] - Whether entity supports view operation
 * @property {LocaleConfig[]} supportedLocales - Supported locales
 * @property {TranslatableField[]} translatableFields - Fields that support translation
 * @property {NonTranslatableField[]} nonTranslatableFields - Fields without translation
 * @property {FormSection[]} [formSections] - Form section groupings
 * @property {ViewSection[]} [viewSections] - View section groupings
 */

export {};
