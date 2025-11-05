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
      description: 'VIP package name and identification',
      fields: ['id', 'name', 'lang_name', 'orderno']
    },
    {
      name: 'pricing',
      label: 'Pricing & Duration',
      description: 'Coin costs and subscription period',
      fields: ['coin', 'renew_coin', 'days']
    },
    {
      name: 'media',
      label: 'Media & Content',
      description: 'Images and content description',
      fields: ['img', 'content']
    },
    {
      name: 'customization',
      label: 'Customization Features',
      description: 'Chat backgrounds, bubbles, and avatar frames',
      fields: ['chat_bg_ids', 'chat_bubble_ids', 'avatar_frame_ids', 'colors']
    },
    {
      name: 'rewards',
      label: 'Rewards & Effects',
      description: 'Medals, cars, and special effects',
      fields: ['medal_ids', 'car_ids', 'entry_effects', 'room_images']
    },
    {
      name: 'settings',
      label: 'Settings',
      description: 'Package status and configuration',
      fields: ['state']
    }
  ]
};

// Export as both default and named exports
export default vipOptionConfig;
export { vipOptionConfig };