# Modular Navigation System Guide

This guide explains how to add and manage navigation items in your sidebar using the new modular system.

## Overview

The navigation system is now configuration-based, allowing you to add nav items without touching the template code. All navigation is defined in `src/composables/use-navigation.js`.

## Quick Start

### 1. Adding a Single Nav Item

Open `src/composables/use-navigation.js` and add to the `navigationConfig` array:

```javascript
{
    type: 'single',
    label: 'My Page',
    icon: icons.settings,
    to: '/my-page'
}
```

### 2. Adding a Group with Children

```javascript
{
    id: 'myGroup',  // Required for groups
    type: 'group',
    label: 'My Features',
    icon: icons.zap,
    children: [
        { type: 'single', label: 'Feature 1', to: '/feature-1' },
        { type: 'single', label: 'Feature 2', to: '/feature-2' }
    ]
}
```

### 3. Adding Nested Groups (Unlimited Depth)

```javascript
{
    id: 'parent',
    type: 'group',
    label: 'Parent Group',
    icon: icons.box,
    children: [
        { type: 'single', label: 'Item 1', to: '/item-1' },
        {
            id: 'subGroup',
            type: 'group',
            label: 'Sub Group',
            children: [
                { type: 'single', label: 'Sub Item 1', to: '/sub-1' },
                { type: 'single', label: 'Sub Item 2', to: '/sub-2' }
            ]
        }
    ]
}
```

## Item Properties

### Common Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `'single' \| 'group'` | Yes | Type of navigation item |
| `label` | `string` | Yes | Display text (can be i18n key) |
| `icon` | `string` | No | SVG icon markup |

### Single Item Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `to` | `string` | Yes | Route path or URL |
| `external` | `boolean` | No | Opens in new tab if true |
| `badge` | `object` | No | Badge config: `{ text, color }` |

### Group Item Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier for collapse |
| `children` | `array` | Yes | Array of child items |

### Optional Properties (All Items)

| Property | Type | Description |
|----------|------|-------------|
| `permission` | `string` | Permission key to check visibility |
| `hidden` | `boolean \| function` | Hide item conditionally |

## Examples

### Example 1: Simple Dashboard Link

```javascript
{
    type: 'single',
    label: 'Dashboard',
    icon: icons.home,
    to: '/dashboard'
}
```

### Example 2: External Documentation Link

```javascript
{
    type: 'single',
    label: 'Documentation',
    icon: icons.book,
    to: 'https://docs.example.com',
    external: true
}
```

### Example 3: Item with Badge

```javascript
{
    type: 'single',
    label: 'Messages',
    icon: icons.fileText,
    to: '/messages',
    badge: { text: '5', color: 'danger' }
}
```

### Example 4: Item with Permission Check

```javascript
{
    type: 'single',
    label: 'Admin Panel',
    icon: icons.settings,
    to: '/admin',
    permission: 'admin_access'  // Only visible if user has this permission
}
```

### Example 5: Conditionally Hidden Item

```javascript
{
    type: 'single',
    label: 'Beta Feature',
    icon: icons.zap,
    to: '/beta',
    hidden: () => !import.meta.env.VITE_ENABLE_BETA  // Hide based on condition
}
```

### Example 6: Complex Nested Structure

```javascript
{
    id: 'ecommerce',
    type: 'group',
    label: 'E-Commerce',
    icon: icons.box,
    permission: 'view_ecommerce',
    children: [
        { type: 'single', label: 'Products', to: '/products' },
        { type: 'single', label: 'Orders', to: '/orders' },
        {
            id: 'customers',
            type: 'group',
            label: 'Customers',
            children: [
                { type: 'single', label: 'All Customers', to: '/customers' },
                { type: 'single', label: 'Customer Groups', to: '/customer-groups' }
            ]
        },
        {
            id: 'reports',
            type: 'group',
            label: 'Reports',
            children: [
                { type: 'single', label: 'Sales Report', to: '/reports/sales' },
                { type: 'single', label: 'Inventory Report', to: '/reports/inventory' }
            ]
        }
    ]
}
```

## Available Icons

The system includes pre-defined icons. Use them like `icon: icons.iconName`:

- `icons.home` - Home
- `icons.cpu` - CPU/Apps
- `icons.box` - Box/Package
- `icons.zap` - Lightning/Fast
- `icons.users` - Users/People
- `icons.settings` - Settings/Gear
- `icons.clipboard` - Clipboard/Forms
- `icons.fileText` - File/Document
- `icons.layers` - Layers/Stack
- `icons.target` - Target/Focus
- `icons.airplay` - Airplay/Display
- `icons.layout` - Layout/Grid
- `icons.move` - Move/Drag
- `icons.pieChart` - Chart/Analytics
- `icons.book` - Book/Documentation
- `icons.lock` - Lock/Security

### Adding Custom Icons

Add your custom SVG icons to the `icons` object in `use-navigation.js`:

```javascript
export const icons = {
    // ... existing icons
    
    myCustomIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <!-- Your SVG paths here -->
    </svg>`
};
```

## i18n Support

Labels automatically support i18n. If your label is:
- Lowercase with underscores (e.g., `'my_page'`): Treated as i18n key
- Any other format (e.g., `'My Page'`): Displayed as-is

```javascript
// Will use i18n translation
{ label: 'dashboard', ... }

// Will display as-is
{ label: 'My Custom Page', ... }
```

## Permission System

The system integrates with your Vuex store to check permissions:

```javascript
// In use-navigation.js, permissions are checked from:
store.state.auth?.permissions || []

// Example usage:
{
    type: 'single',
    label: 'Admin',
    to: '/admin',
    permission: 'admin_access'  // Only visible if user has 'admin_access' permission
}
```

To customize the permission source, edit the `userPermissions` computed property in `use-navigation.js`.

## Best Practices

1. **Use Descriptive IDs**: Give groups meaningful IDs like `'userManagement'` instead of `'group1'`

2. **Keep It Organized**: Group related items together

3. **Use i18n Keys**: For multi-language support, use i18n keys for labels

4. **Icon Consistency**: Use consistent icons for similar item types

5. **Logical Hierarchy**: Don't nest too deeply (3-4 levels max recommended)

6. **Permission Granularity**: Apply permissions at the appropriate level

## Where to Add Your Items

In `src/composables/use-navigation.js`, find the `navigationConfig` array. Your custom items should go:

1. **After Dashboard** - For main application features
2. **Before Template Components** - For production features
3. **Inside Template Components** - Only for template reference items

```javascript
const navigationConfig = [
    // Dashboard (existing)
    { ... },

    // ✅ ADD YOUR CUSTOM ITEMS HERE
    {
        id: 'myFeatures',
        type: 'group',
        label: 'My Features',
        ...
    },

    // Template Components (existing - for reference only)
    { ... }
];
```

## Troubleshooting

### Item Not Showing
- Check if `hidden` property is set
- Verify user has required `permission`
- Ensure `id` is unique for groups
- Check console for errors

### Collapse Not Working
- Ensure group has unique `id`
- Verify `children` array is not empty
- Check Bootstrap is loaded

### Icon Not Displaying
- Verify icon string is valid SVG
- Check icon is defined in `icons` object
- Ensure `v-html` is rendering correctly

## Migration from Old System

If you have hardcoded nav items in `sidebar.vue`, migrate them to the config:

**Old (in template):**
```html
<li class="menu">
    <router-link to="/my-page">
        <svg>...</svg>
        <span>My Page</span>
    </router-link>
</li>
```

**New (in use-navigation.js):**
```javascript
{
    type: 'single',
    label: 'My Page',
    icon: icons.myIcon,
    to: '/my-page'
}
```

## Support

For questions or issues with the navigation system, refer to:
- This guide
- `src/composables/use-navigation.js` - Configuration
- `src/components/layout/nav-item.vue` - Rendering component
- `src/components/layout/sidebar.vue` - Implementation example
