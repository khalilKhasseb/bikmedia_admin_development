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

  filters: [
    { "value": 0, "label": "person" },
    { "value": 1, "label": "audioLive" },
    { "value": 2, "label": "videoLive" },
    { "value": 3, "label": "video" },
    { "value": 4, "label": "sticker" },
    { "value": 5, "label": "exclusive" },
    { "value": 6, "label": "vip" },
    { "value": 7, "label": "level" }
  ],

  // Translatable field definitions for name and description
  translatableFields: [
    // {
    //   name: 'name',
    //   type: 'text',
    //   required: false,
    //   maxLength: 255,
    //   label: 'Name',
    //   placeholder: {
    //     en: 'Gift Name',
    //     ar: 'اسم الهدية'
    //   }
    // },
    // {
    //   name: 'description',
    //   type: 'textarea',
    //   required: false,
    //   maxLength: 1000,
    //   rows: 4,
    //   label: 'Description',
    //   placeholder: {
    //     en: 'Gift Description',
    //     ar: 'وصف الهدية'
    //   }
    // }
  ],

  // Gift non-translatable fields
  nonTranslatableFields: [
    {
      name: 'name',
      type: 'text',
      required: false,
      maxLength: 255,
      label: 'Name',
      placeholder: "Gift name"
    },

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
        { "value": 0, "label": "person" },
        { "value": 1, "label": "audioLive" },
        { "value": 2, "label": "videoLive" },
        { "value": 3, "label": "video" },
        { "value": 4, "label": "sticker" },
        { "value": 5, "label": "exclusive" },
        { "value": 6, "label": "vip" },
        { "value": 7, "label": "level" }
      ]
    },
    {
      name: 'lvl',
      type: 'number',
      required: false,
      min: 0,
      default: 0,
      label: 'Level',
      placeholder: 'Level Requirement',
      condition: { field: 'type', operator: '===', value: 7 } // Show only when type is "level" (7)
    },
    // {
    //   name: 'vip',
    //   type: 'number',
    //   required: false,
    //   min: 0,
    //   default: 0,
    //   label: 'VIP',
    //   placeholder: 'VIP Requirement'
    // },
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
    // {
    //   name: 'mark',
    //   type: 'number',
    //   required: false,
    //   min: 0,
    //   default: 1,
    //   label: 'Mark',
    //   placeholder: 'Mark Value'
    // },
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
      name:"enable_animation",
      type: 'boolean',
      required: false,
      default: false,
      label: 'Enable Animation',
      placeholder: 'Enable Animation'
    },
    {
      name: 'anim',
      type: 'file',
      accept: '.svga,.webp,.gif,.svg',
      required: false,
      label: 'Animation',
      supportsUrlFallback: true,
      maxSize: 10,
      condition: { field: 'enable_animation', operator: '===', value: true } // Show only when enable_animation is true
    }
  ],

  formSections: [
    {
      name: 'basicInfo',
      label: 'Basic Info',
      description: 'Gift name and identification',
      fields: ['name', 'coin'],
      columnsPerRow: 2 // 2 fields per row (each field takes col-md-6)
    },
    {
      name: 'media',
      label: 'Media',
      description: 'Upload icon and animation files',
      fields: ['icon','anim', 'enable_animation'],
      columnsPerRow: 3 // 2 fields per row (each field takes col-md-6)
    },
    {
      name: 'settings',
      label: 'Settings',
      description: 'Gift properties and requirements',
      fields: ['type', 'lvl', 'anim_type', 'list_order'],
      columnsPerRow: 3 // 3 fields per row (each field takes col-md-4)
    }
  ]
};

// Export as both default and named exports
export default giftConfig;
export { giftConfig };
