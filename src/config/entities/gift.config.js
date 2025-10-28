/**
 * Gift entity configuration
 * @module config/entities/gift
 */

import { STANDARD_LOCALES } from './helpers.js';

/**
 * Gift entity configuration
 * Defines translatable fields (name, description) and non-translatable fields
 * (coin, type, lvl, vip, anim_type, list_order, mark, icon, anim)
 * 
 * @type {import('./types.js').EntityConfig}
 */
const giftConfig = {
  entityName: 'Gift',
  apiEndpoint: '/gifts',
  displayName: 'Gift',
  pluralName: 'Gifts',

  // Locales (EN/AR) configured
  supportedLocales: STANDARD_LOCALES,

  // Translatable field definitions for name and description
  translatableFields: [
    {
      name: 'name',
      type: 'text',
      required: false,
      maxLength: 255,
      placeholder: {
        en: 'Gift Name',
        ar: 'اسم الهدية'
      }
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      maxLength: 1000,
      rows: 4,
      placeholder: {
        en: 'Gift Description',
        ar: 'وصف الهدية'
      }
    }
  ],

  // Gift non-translatable fields
  nonTranslatableFields: [
    {
      name: 'coin',
      type: 'number',
      required: false,
      min: 0,
      default: 0,
      label: 'Coins',
      placeholder: 'Coin Value'
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      default: 0,
      label: 'Type',
      options: [
        { value: 0, label: 'Default' },
        { value: 1, label: 'Standard' },
        { value: 2, label: 'Premium' },
        { value: 3, label: 'Video' },
        { value: 4, label: 'Special' }
      ]
    },
    {
      name: 'lvl',
      type: 'number',
      required: false,
      min: 0,
      default: 0,
      label: 'Level',
      placeholder: 'Level Requirement'
    },
    {
      name: 'vip',
      type: 'number',
      required: false,
      min: 0,
      default: 0,
      label: 'VIP',
      placeholder: 'VIP Requirement'
    },
    {
      name: 'anim_type',
      type: 'number',
      required: false,
      min: 0,
      default: 0,
      label: 'Animation Type',
      placeholder: 'Animation Type'
    },
    {
      name: 'list_order',
      type: 'number',
      required: false,
      min: 0,
      default: 100000,
      label: 'List Order',
      placeholder: 'Display Order',
      helpText: 'Lower numbers appear first'
    },
    {
      name: 'mark',
      type: 'number',
      required: false,
      min: 0,
      default: 1,
      label: 'Mark',
      placeholder: 'Mark Value'
    },
    {
      name: 'icon',
      type: 'file',
      accept: 'image/*',
      required: false,
      label: 'Icon',
      supportsUrlFallback: true,
      maxSize: 5
    },
    {
      name: 'anim',
      type: 'file',
      accept: '.svga,.webp,.gif',
      required: false,
      label: 'Animation',
      supportsUrlFallback: true,
      maxSize: 10
    }
  ],

  formSections: [
    {
      name: 'basicInfo',
      label: 'Basic Info',
      fields: ['name']
    },
    {
      name: 'details',
      label: 'Details',
      fields: ['description']
    },
    {
      name: 'settings',
      label: 'Settings',
      fields: ['coin', 'type', 'lvl', 'vip', 'anim_type', 'list_order', 'mark']
    },
    {
      name: 'media',
      label: 'Media',
      fields: ['icon', 'anim']
    }
  ]
};

// Export as both default and named exports
export default giftConfig;
export { giftConfig };
