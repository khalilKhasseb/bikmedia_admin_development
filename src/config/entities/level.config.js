/**
 * Level entity configuration
 * @module config/entities/level
 */

import { STANDARD_LOCALES } from './helpers.js';

/**
 * Level entity configuration (read-only)
 * Defines view-only fields including nested level object properties
 * 
 * @type {import('./types.js').EntityConfig}
 */
const levelConfig = {
  entityName: 'Level',
  apiEndpoint: '/levels',
  displayName: 'Level',
  pluralName: 'Levels',

  // Configuration with operation flags based on API capabilities
  readOnly: false, // Allow some operations
  supportsCreate: false, // API doesn't support level creation
  supportsEdit: true,   // API supports level editing
  supportsDelete: true,  // API supports level deletion
  supportsView: true,    // API supports viewing levels

  // Locales (EN/AR) configured
  supportedLocales: STANDARD_LOCALES,

  // Translatable field definitions
  // NOTE: The API returns name inside nested level object (level.name) but expects flat structure for edit (nameEN/nameAR)
  // The edit view will handle mapping between nested response and flat edit payload
  translatableFields: [
    {
      name: 'name',
      type: 'text',
      readOnly: false,  // Toggle to make editable/read-only
      required: false,
      label: 'Level Name',
      placeholder: {
        en: 'Level Name',
        ar: 'اسم المستوى'
      }
    }
    // 'description' field is intentionally omitted - not supported by Level API
  ],

  // Non-translatable fields - flat structure for edit, nested for view
  // The edit view will handle mapping between nested response (level.icon) and flat edit payload (icon)
  nonTranslatableFields: [
    {
      name: 'id',
      type: 'number',
      readOnly: true,  // Always read-only (auto-generated)
      required: false,
      label: 'ID',
      display: true
    },
    {
      name: 'lid',
      type: 'number',
      readOnly: false,  // Toggle to make editable/read-only
      required: false,
      label: 'Level ID',
      display: true
    },
    {
      name: 'lvl',
      type: 'number',
      readOnly: false,  // Toggle to make editable/read-only
      required: false,
      label: 'Level',
      display: true,
      primaryDisplayField: true
    },
    {
      name: 'target',
      type: 'number',
      readOnly: false,  // Toggle to make editable/read-only
      required: false,
      label: 'Target Points',
      display: true,
      format: 'number'
    },
    {
      name: 'icon',
      type: 'file',  // Changed from 'image' to 'file' for upload support
      readOnly: false,  // Toggle to make editable/read-only
      required: false,
      label: 'Active Icon',
      display: true,
      accept: 'image/*',
      // For view mode, data comes from level.icon (nested)
      // For edit mode, we send as icon (flat)
      viewPath: 'level.icon'  // Path to read from in view mode
    },
    {
      name: 'icon_disable',
      type: 'file',  // Changed from 'image' to 'file' for upload support
      readOnly: false,  // Toggle to make editable/read-only
      required: false,
      label: 'Disabled Icon',
      display: true,
      accept: 'image/*',
      viewPath: 'level.icon_disable'  // Path to read from in view mode
    },
    {
      name: 'icon_anim',
      type: 'file',  // Changed from 'image' to 'file' for upload support
      readOnly: false,  // Toggle to make editable/read-only
      required: false,
      label: 'Animated Icon',
      display: true,
      accept: 'image/*,.webp,.svga',  // Support animated formats
      viewPath: 'level.icon_anim'  // Path to read from in view mode
    }
  ],

  // View section groupings (uses nested paths for display)
  viewSections: [
    {
      name: 'basicInfo',
      label: 'Basic Info',
      fields: ['id', 'lid', 'lvl', 'name'],
      columnsPerRow: 4 // 4 fields per row (each field takes col-md-3)
    },
    {
      name: 'progress',
      label: 'Progress',
      fields: ['target'],
      columnsPerRow: 1 // 1 field per row (each field takes col-md-12)
    },
    {
      name: 'icons',
      label: 'Icons',
      fields: ['icon', 'icon_disable', 'icon_anim'],  // Use flat names, viewPath handles nested access
      columnsPerRow: 3 // 3 fields per row (each field takes col-md-4)
    }
  ],
  // Form section groupings for edit/create operations (uses flat structure)
  formSections: [
    {
      name: 'basicInfo',
      label: 'Basic Info',
      fields: ['id', 'lid', 'lvl', 'name'],
      columnsPerRow: 2 // 2 fields per row (each field takes col-md-6)
    },
    {
      name: 'progress',
      label: 'Progress',
      fields: ['target'],
      columnsPerRow: 1 // 1 field per row (each field takes col-md-12)
    },
    {
      name: 'icons',
      label: 'Icons',
      fields: ['icon', 'icon_disable', 'icon_anim'],  // Flat structure for edit
      columnsPerRow: 3 // 3 fields per row (each field takes col-md-4)
    }
  ]
};

// Export as both default and named exports
export default levelConfig;
export { levelConfig };
