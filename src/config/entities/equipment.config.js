/**
 * Equipment entity configuration
 * @module config/entities/equipment
 */

import { STANDARD_LOCALES } from './helpers.js';

/**
 * Equipment entity configuration
 * Defines translatable fields (name, description) and non-translatable fields
 * (coin, days, type, lvl, vip, icon, anim)
 * 
 * @type {import('./types.js').EntityConfig}
 */
const equipmentConfig = {
  entityName: 'Equipment',
  apiEndpoint: '/equipment',
  displayName: 'Equipment',
  pluralName: 'Equipments',

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
        en: 'Equipment Name',
        ar: 'اسم المعدات',
        // fa: 'نام تجهیز'
      }
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      maxLength: 1000,
      rows: 4,
      label: 'Description',
      placeholder: {
        en: 'Equipment Description',
        ar: 'وصف المعدات'
      }
    }
  ],

  // Equipment non-translatable fields
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
      name: 'days',
      type: 'number',
      required: false,
      min: 0,
      default: 0,
      label: 'Days',
      placeholder: 'Duration in Days'
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      default: 1,
      label: 'Type',
      options: [
        { value: 1, label: 'Frame' },
        { value: 2, label: 'Entry Effect' },
        { value: 3, label: 'Badge' },
        { value: 4, label: 'Theme' }
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
      name: 'icon',
      type: 'file',
      accept: 'image/*',
      required: false,
      label: 'Icon',
      supportsUrlFallback: true,
      maxSize: 5
    },
    {
      name: 'svga',
      type: 'file',
      accept: '.svga,.webp,.gif,.svg',
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
      fields: []
    },
    {
      name: 'settings',
      label: 'Settings',
      fields: ['coin', 'days', 'type', 'lvl', 'vip']
    },
    {
      name: 'media',
      label: 'Media',
      fields: ['icon', 'svga']
    }
  ]
};

// Export as both default and named exports
export default equipmentConfig;
export { equipmentConfig };
