/**
 * VIP Option entity configuration
 * @module config/entities/vip-option
 */

import { STANDARD_LOCALES } from './helpers.js';

/**
 * VIP Option entity configuration
 * Defines non-translatable fields for VIP option management
 * (name, description, icon, svga, isActive)
 * 
 * @type {import('./types.js').EntityConfig}
 */
const vipOptionConfig = {
  entityName: 'VipOption',
  apiEndpoint: '/vip-options',
  displayName: 'VIP Option',
  pluralName: 'VIP Options',

  // Locales (EN/AR) configured
  supportedLocales: STANDARD_LOCALES,

  // No translatable fields for VIP options
  translatableFields: [],

  // VIP option non-translatable fields
  nonTranslatableFields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 255,
      label: 'Option Name',
      placeholder: 'Enter option name'
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      maxLength: 500,
      rows: 3,
      label: 'Description',
      placeholder: 'Enter option description'
    },
    {
      name: 'icon',
      type: 'file',
      accept: 'image/*',
      required: false,
      label: 'Icon',
      supportsUrlFallback: true,
      maxSize: 5,
      helpText: 'Upload an icon image (max 5MB)'
    },
    {
      name: 'svga',
      type: 'file',
      accept: '.svga,.webp,.gif,.svg',
      required: false,
      label: 'Animation',
      supportsUrlFallback: true,
      maxSize: 10,
      helpText: 'Upload animation file (max 10MB)'
    },
    {
      name: 'isActive',
      type: 'boolean',
      required: false,
      default: true,
      label: 'Active Status',
      helpText: 'Enable or disable this option'
    }
  ],

  formSections: [
    {
      name: 'basicInfo',
      label: 'Basic Information',
      description: 'Option name and description',
      fields: ['name', 'description']
    },
    {
      name: 'media',
      label: 'Media Files',
      description: 'Upload icon and animation files',
      fields: ['icon', 'svga']
    }
  ]
};

// Export as both default and named exports
export default vipOptionConfig;
export { vipOptionConfig };