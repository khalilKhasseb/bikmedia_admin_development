# 🎯 Modular Navigation System

## What Was Created

A complete, modular navigation system that allows you to manage sidebar navigation through configuration instead of template code.

## 📁 Files Created

### 1. **`src/composables/use-navigation.js`** (Main Config File)
- **Purpose**: Central place to define all navigation items
- **What it contains**:
  - Icon library (SVG icons)
  - Navigation configuration array
  - Permission checking logic
  - Filtering logic for visibility

### 2. **`src/components/layout/nav-item.vue`** (Rendering Component)
- **Purpose**: Recursively renders navigation items
- **Features**:
  - Handles single items and groups
  - Supports unlimited nesting
  - Active route highlighting
  - i18n support
  - Badge support

### 3. **`NAVIGATION_GUIDE.md`** (Full Documentation)
- Complete reference guide
- All properties explained
- Advanced examples
- Troubleshooting tips

### 4. **`QUICK_START_NAVIGATION.md`** (Quick Reference)
- Copy-paste examples
- Common use cases
- Real-world examples

## 🚀 How to Use

### Quick Start (3 Steps)

1. **Open**: `src/composables/use-navigation.js`
2. **Find**: The `navigationConfig` array
3. **Add**: Your navigation items

```javascript
// Example: Add a new nav item
{
    type: 'single',
    label: 'My Page',
    icon: icons.settings,
    to: '/my-page'
}

// Example: Add a group
{
    id: 'myGroup',
    type: 'group',
    label: 'My Features',
    icon: icons.zap,
    children: [
        { type: 'single', label: 'Feature 1', to: '/feature-1' },
        { type: 'single', label: 'Feature 2', to: '/feature-2' }
    ]
}
```

## ✨ Features

### ✅ What You Can Do

- **Add single nav items** - Simple links to pages
- **Create groups** - Collapsible sections with children
- **Nest infinitely** - Groups within groups, unlimited depth
- **Add icons** - Pre-defined SVG icons or custom ones
- **Set permissions** - Show/hide based on user permissions
- **Add badges** - Show notification counts or labels
- **External links** - Link to external URLs
- **Conditional visibility** - Show/hide based on conditions
- **i18n support** - Multi-language labels

### ✅ What's Handled Automatically

- Active route highlighting
- Collapse/expand behavior
- Mobile menu toggling
- Permission checking
- i18n translation
- Bootstrap integration

## 📊 Structure

```
navigationConfig = [
    {
        id: 'uniqueId',           // Required for groups
        type: 'single' | 'group', // Type of item
        label: 'Display Text',    // Label (supports i18n)
        icon: icons.iconName,     // SVG icon
        to: '/path',              // Route path (for single)
        children: [],             // Child items (for groups)
        permission: 'key',        // Permission check (optional)
        badge: { text, color },   // Badge (optional)
        external: boolean,        // External link (optional)
        hidden: boolean|function  // Hide condition (optional)
    }
]
```

## 🎨 Available Icons

```javascript
icons.home        icons.box         icons.users
icons.settings    icons.zap         icons.cpu
icons.clipboard   icons.fileText    icons.layers
icons.target      icons.airplay     icons.layout
icons.move        icons.pieChart    icons.book
icons.lock
```

## 📝 Common Patterns

### Pattern 1: Simple Page
```javascript
{
    type: 'single',
    label: 'Dashboard',
    icon: icons.home,
    to: '/dashboard'
}
```

### Pattern 2: Section with Pages
```javascript
{
    id: 'products',
    type: 'group',
    label: 'Products',
    icon: icons.box,
    children: [
        { type: 'single', label: 'All Products', to: '/products' },
        { type: 'single', label: 'Add Product', to: '/products/add' }
    ]
}
```

### Pattern 3: Nested Sections
```javascript
{
    id: 'ecommerce',
    type: 'group',
    label: 'E-Commerce',
    icon: icons.box,
    children: [
        { type: 'single', label: 'Dashboard', to: '/ecommerce' },
        {
            id: 'orders',
            type: 'group',
            label: 'Orders',
            children: [
                { type: 'single', label: 'All', to: '/orders' },
                { type: 'single', label: 'Pending', to: '/orders/pending' }
            ]
        }
    ]
}
```

## 🔐 Permission System

The system integrates with your Vuex store:

```javascript
// Checks: store.state.auth?.permissions

// Usage:
{
    type: 'single',
    label: 'Admin Panel',
    to: '/admin',
    permission: 'admin_access'  // Only visible if user has permission
}
```

## 🌍 i18n Support

Labels automatically use i18n if they match the pattern:

```javascript
// Uses i18n (lowercase with underscores)
{ label: 'my_page' }  // Translates via $t('my_page')

// Displays as-is
{ label: 'My Page' }  // Shows "My Page"
```

## 🔄 Migration Path

### Current State
The sidebar (`src/components/layout/sidebar.vue`) still uses hardcoded HTML for now.

### To Switch to Modular System

1. Open `src/components/layout/sidebar.vue`
2. Replace the menu items with:

```vue
<nav-item
    v-for="(item, index) in navigationItems"
    :key="item.id || `nav-${index}`"
    :item="item"
    @toggle-mobile="toggleMobileMenu"
/>
```

3. Update imports:

```vue
<script setup>
import NavItem from './nav-item.vue';
import { useNavigation } from '../../composables/use-navigation';

const { navigationItems } = useNavigation();
// ... rest of code
</script>
```

## 📚 Documentation

- **Quick Start**: `QUICK_START_NAVIGATION.md` - Copy-paste examples
- **Full Guide**: `NAVIGATION_GUIDE.md` - Complete reference
- **This File**: Overview and summary

## 💡 Benefits

### Before (Hardcoded)
```vue
<!-- Had to edit template for every nav item -->
<li class="menu">
    <a data-bs-toggle="collapse" data-bs-target="#myGroup">
        <div><svg>...</svg><span>My Group</span></div>
        <div><svg>...</svg></div>
    </a>
    <ul id="myGroup" class="collapse submenu" data-bs-parent="#sidebar">
        <li><router-link to="/page1">Page 1</router-link></li>
        <li><router-link to="/page2">Page 2</router-link></li>
    </ul>
</li>
```

### After (Modular)
```javascript
// Just add to config
{
    id: 'myGroup',
    type: 'group',
    label: 'My Group',
    icon: icons.box,
    children: [
        { type: 'single', label: 'Page 1', to: '/page1' },
        { type: 'single', label: 'Page 2', to: '/page2' }
    ]
}
```

## 🎯 Use Cases

### ✅ Perfect For:
- Adding new features/pages
- Organizing navigation
- Role-based menus
- Multi-tenant applications
- Frequently changing navigation
- Team collaboration (no merge conflicts)

### ✅ Supports:
- Single page links
- Grouped navigation
- Nested groups (unlimited depth)
- External links
- Permission-based visibility
- Conditional visibility
- Badges and notifications
- Custom icons
- i18n/multi-language

## 🚦 Getting Started

1. **Read**: `QUICK_START_NAVIGATION.md` (5 min)
2. **Try**: Add a simple nav item
3. **Explore**: Check `NAVIGATION_GUIDE.md` for advanced features
4. **Customize**: Add your application's navigation

## 🤝 Contributing

To add new icons:

```javascript
// In src/composables/use-navigation.js
export const icons = {
    // ... existing icons
    
    myIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <!-- Your SVG paths -->
    </svg>`
};
```

## ❓ Questions?

- Check `NAVIGATION_GUIDE.md` for detailed documentation
- See `QUICK_START_NAVIGATION.md` for examples
- Look at `src/composables/use-navigation.js` for the config structure

---

**Happy Coding! 🚀**

Your navigation is now modular, maintainable, and easy to extend!
