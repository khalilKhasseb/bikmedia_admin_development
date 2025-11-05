/**
 * VIP  entity configuration
 * @module config/entities/vip
 */

import { STANDARD_LOCALES } from './helpers.js';

/**
 * VIP  entity configuration
 * Defines non-translatable fields for VIP  management
 * (name, description, icon, svga, isActive)
 * 
 * @type {import('./types.js').EntityConfig}
 */


const vipConfig = {

    entityName: "vip",
    apiEndpoint: "/noble",
    displayName: "Vip",
    pluralName: "Vip's",

    translatableFields: [],

    nonTranslatableFields: [

        {
            "name": "id",
            "type": "number",
            "required": true,
            "label": "ID",
            "placeholder": "Enter ID"
        },
        {
            "name": "name",
            "type": "text",
            "required": true,
            "maxLength": 255,
            "label": "Name",
            "placeholder": "Enter name"
        },
        {
            "name": "coin",
            "type": "number",
            "required": true,
            "label": "Coin",
            "placeholder": "Enter coin amount"
        },
        {
            "name": "renew_coin",
            "type": "number",
            "required": true,
            "label": "Renew Coin",
            "placeholder": "Enter renew coin amount"
        },
        {
            "name": "img",
            "type": "file",
            "accept": "image/*",
            "required": false,
            "label": "Image",
            "supportsUrlFallback": true,
            "maxSize": 5,
            "helpText": "Upload package image (max 5MB) or enter URL"
        },
        {
            "name": "days",
            "type": "number",
            "required": true,
            "label": "Days",
            "placeholder": "Enter number of days"
        },
        {
            "name": "content",
            "type": "textarea",
            "required": false,
            "maxLength": 1000,
            "label": "Content",
            "placeholder": "Enter content"
        },
        {
            "name": "chat_bg_ids",
            "type": "text",
            "required": false,
            "maxLength": 255,
            "label": "Chat Background IDs",
            "placeholder": "Enter chat background IDs"
        },
        {
            "name": "chat_bubble_ids",
            "type": "text",
            "required": false,
            "maxLength": 255,
            "label": "Chat Bubble IDs",
            "placeholder": "Enter chat bubble IDs"
        },
        {
            "name": "avatar_frame_ids",
            "type": "text",
            "required": false,
            "maxLength": 255,
            "label": "Avatar Frame IDs",
            "placeholder": "Enter avatar frame IDs"
        },
        {
            "name": "medal_ids",
            "type": "text",
            "required": false,
            "maxLength": 255,
            "label": "Medal IDs",
            "placeholder": "Enter medal IDs"
        },
        {
            "name": "car_ids",
            "type": "text",
            "required": false,
            "maxLength": 255,
            "label": "Car IDs",
            "placeholder": "Enter car IDs"
        },
        {
            "name": "colors",
            "type": "text",
            "required": false,
            "maxLength": 255,
            "label": "Colors",
            "placeholder": "Enter colors"
        },
        {
            "name": "entry_effects",
            "type": "text",
            "required": false,
            "maxLength": 255,
            "label": "Entry Effects",
            "placeholder": "Enter entry effects"
        },
        {
            "name": "room_images",
            "type": "text",
            "required": false,
            "maxLength": 255,
            "label": "Room Images",
            "placeholder": "Enter room images"
        },
        {
            "name": "state",
            "type": "number",
            "required": true,
            "label": "State",
            "placeholder": "Enter state (0 or 1)"
        },
        {
            "name": "orderno",
            "type": "number",
            "required": false,
            "label": "Order Number",
            "placeholder": "Enter order number"
        },
        {
            "name": "lang_name",
            "type": "text",
            "required": false,
            "maxLength": 255,
            "label": "Language Name",
            "placeholder": "Enter language name"
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
}


export default vipConfig;