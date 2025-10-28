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
  
  // Read-only configuration with operation flags
  readOnly: true,
  supportsCreate: false,
  supportsEdit: false,
  supportsDelete: false,
  supportsView: true,

  // Locales (EN/AR) configured
  supportedLocales: STANDARD_LOCALES,

  // Translatable field definitions (read-only for Level)
  // NOTE: Level entity only supports 'name' field. Unlike Equipment and Gift,
  // the Level API does not expose a 'description' field in its response structure.
  // The API returns only: id, lid, lvl, target, and nested level object (name, icon, icon_disable, icon_anim).
  // See: src/views/bikmedia/store/levels.vue (lines 162-190) and src/services/api/level.service.js
  translatableFields: [
    {
      name: 'name',
      type: 'text',
      required: false,
      readOnly: true,
      label: 'Level Name',
      placeholder: {
        en: 'Level Name',
        ar: 'اسم المستوى'
      }
    }
    // 'description' field is intentionally omitted - not supported by Level API
  ],

  // Non-translatable fields including nested level object
  nonTranslatableFields: [
    {
      name: 'id',
      type: 'number',
      readOnly: true,
      required: false,
      label: 'ID',
      display: true
    },
    {
      name: 'lid',
      type: 'number',
      readOnly: true,
      required: false,
      label: 'Level ID',
      display: true
    },
    {
      name: 'lvl',
      type: 'number',
      readOnly: true,
      required: false,
      label: 'Level',
      display: true,
      primaryDisplayField: true
    },
    {
      name: 'target',
      type: 'number',
      readOnly: true,
      required: false,
      label: 'Target Points',
      display: true,
      format: 'number'
    },
    {
      name: 'level.icon',
      type: 'image',
      readOnly: true,
      required: false,
      label: 'Active Icon',
      display: true,
      path: 'level.icon'
    },
    {
      name: 'level.icon_disable',
      type: 'image',
      readOnly: true,
      required: false,
      label: 'Disabled Icon',
      display: true,
      path: 'level.icon_disable'
    },
    {
      name: 'level.icon_anim',
      type: 'image',
      readOnly: true,
      required: false,
      label: 'Animated Icon',
      display: true,
      path: 'level.icon_anim'
    }
  ],

  // View section groupings
  viewSections: [
    {
      name: 'basicInfo',
      label: 'Basic Info',
      fields: ['id', 'lid', 'lvl', 'name']
    },
    {
      name: 'progress',
      label: 'Progress',
      fields: ['target']
    },
    {
      name: 'icons',
      label: 'Icons',
      fields: ['level.icon', 'level.icon_disable', 'level.icon_anim']
    }
  ]
};

// Export as both default and named exports
export default levelConfig;
export { levelConfig };
