# Quick Start: Adding Navigation Items

## 🚀 In 3 Simple Steps

### Step 1: Open the Navigation Config File
```
src/composables/use-navigation.js
```

### Step 2: Find the `navigationConfig` Array
Look for this section (around line 150):

```javascript
const navigationConfig = [
    // Dashboard (existing)
    { ... },

    // ✅ ADD YOUR ITEMS HERE (before Template Components)
    
    // Template Components (existing - keep at bottom)
    { ... }
];
```

### Step 3: Add Your Nav Items

## 📋 Copy-Paste Examples

### Example 1: Single Page Link
```javascript
{
    type: 'single',
    label: 'My Dashboard',
    icon: icons.home,
    to: '/my-dashboard'
},
```

### Example 2: Group with Multiple Pages
```javascript
{
    id: 'products',
    type: 'group',
    label: 'Products',
    icon: icons.box,
    children: [
        { type: 'single', label: 'All Products', to: '/products' },
        { type: 'single', label: 'Add Product', to: '/products/add' },
        { type: 'single', label: 'Categories', to: '/products/categories' }
    ]
},
```

### Example 3: Nested Groups
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
                { type: 'single', label: 'All Orders', to: '/orders' },
                { type: 'single', label: 'Pending', to: '/orders/pending' },
                { type: 'single', label: 'Completed', to: '/orders/completed' }
            ]
        },
        {
            id: 'customers',
            type: 'group',
            label: 'Customers',
            children: [
                { type: 'single', label: 'All Customers', to: '/customers' },
                { type: 'single', label: 'Add Customer', to: '/customers/add' }
            ]
        }
    ]
},
```

### Example 4: With Permission Check
```javascript
{
    type: 'single',
    label: 'Admin Panel',
    icon: icons.settings,
    to: '/admin',
    permission: 'admin_access'  // Only visible if user has this permission
},
```

### Example 5: With Badge
```javascript
{
    type: 'single',
    label: 'Messages',
    icon: icons.fileText,
    to: '/messages',
    badge: { text: '5', color: 'danger' }
},
```

### Example 6: External Link
```javascript
{
    type: 'single',
    label: 'Documentation',
    icon: icons.book,
    to: 'https://docs.myapp.com',
    external: true
},
```

## 🎨 Available Icons

Use any of these pre-defined icons:

```javascript
icons.home        // Home icon
icons.box         // Box/Package icon
icons.users       // Users/People icon
icons.settings    // Settings/Gear icon
icons.zap         // Lightning/Fast icon
icons.cpu         // CPU/Apps icon
icons.clipboard   // Clipboard/Forms icon
icons.fileText    // File/Document icon
icons.layers      // Layers/Stack icon
icons.target      // Target/Focus icon
icons.airplay     // Airplay/Display icon
icons.layout      // Layout/Grid icon
icons.move        // Move/Drag icon
icons.pieChart    // Chart/Analytics icon
icons.book        // Book/Documentation icon
icons.lock        // Lock/Security icon
```

## 📍 Where to Add Your Items

Open `src/composables/use-navigation.js` and add your items here:

```javascript
const navigationConfig = [
    // Dashboard (line ~150)
    {
        id: 'dashboard',
        type: 'group',
        label: 'dashboard',
        icon: icons.home,
        children: [...]
    },

    // ========================================
    // ✅ ADD YOUR CUSTOM ITEMS HERE
    // ========================================
    
    {
        id: 'myFeatures',
        type: 'group',
        label: 'My Features',
        icon: icons.zap,
        children: [
            { type: 'single', label: 'Feature 1', to: '/feature-1' },
            { type: 'single', label: 'Feature 2', to: '/feature-2' }
        ]
    },

    // ========================================
    // Template Components (keep at bottom)
    // ========================================
    {
        id: 'templateComponents',
        type: 'group',
        label: 'Template Components',
        ...
    }
];
```

## ✅ That's It!

Your navigation items will automatically appear in the sidebar. No need to:
- Edit the sidebar template
- Write HTML
- Handle collapse logic
- Manage active states

Everything is handled automatically!

## 🔄 To Switch to the Modular System Completely

If you want to replace the current hardcoded sidebar with the fully dynamic version:

1. Open `src/components/layout/sidebar.vue`
2. Replace the `<perfect-scrollbar>` content with:

```vue
<perfect-scrollbar class="list-unstyled menu-categories" tag="ul" :options="{ wheelSpeed: 0.5, swipeEasing: !0, minScrollbarLength: 40, maxScrollbarLength: 300, suppressScrollX: true }">
    <nav-item
        v-for="(item, index) in navigationItems"
        :key="item.id || `nav-${index}`"
        :item="item"
        @toggle-mobile="toggleMobileMenu"
    />
</perfect-scrollbar>
```

3. Update the script section:

```vue
<script setup>
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import NavItem from './nav-item.vue';
import { useNavigation } from '../../composables/use-navigation';

const store = useStore();
const { navigationItems } = useNavigation();

// ... rest of your script
</script>
```

## 📚 Need More Help?

See the full documentation: `NAVIGATION_GUIDE.md`

## 🎯 Real-World Example

Here's a complete example for a blog application:

```javascript
// In src/composables/use-navigation.js
const navigationConfig = [
    // Dashboard
    {
        id: 'dashboard',
        type: 'group',
        label: 'dashboard',
        icon: icons.home,
        children: [
            { type: 'single', label: 'sales', to: '/' },
            { type: 'single', label: 'analytics', to: '/index2' }
        ]
    },

    // Blog Management
    {
        id: 'blog',
        type: 'group',
        label: 'Blog',
        icon: icons.fileText,
        children: [
            { 
                type: 'single', 
                label: 'All Posts', 
                to: '/blog/posts',
                badge: { text: '12', color: 'primary' }
            },
            { type: 'single', label: 'Add New Post', to: '/blog/posts/create' },
            { type: 'single', label: 'Categories', to: '/blog/categories' },
            { type: 'single', label: 'Tags', to: '/blog/tags' },
            {
                id: 'comments',
                type: 'group',
                label: 'Comments',
                children: [
                    { 
                        type: 'single', 
                        label: 'All Comments', 
                        to: '/blog/comments',
                        badge: { text: '3', color: 'warning' }
                    },
                    { type: 'single', label: 'Pending', to: '/blog/comments/pending' },
                    { type: 'single', label: 'Spam', to: '/blog/comments/spam' }
                ]
            }
        ]
    },

    // Media
    {
        type: 'single',
        label: 'Media Library',
        icon: icons.layers,
        to: '/media'
    },

    // Settings
    {
        id: 'settings',
        type: 'group',
        label: 'Settings',
        icon: icons.settings,
        permission: 'manage_settings',
        children: [
            { type: 'single', label: 'General', to: '/settings/general' },
            { type: 'single', label: 'SEO', to: '/settings/seo' },
            { type: 'single', label: 'Users', to: '/settings/users', permission: 'manage_users' }
        ]
    },

    // Template Components (existing)
    { ... }
];
```

This will create a clean, organized sidebar with all your blog management features!
