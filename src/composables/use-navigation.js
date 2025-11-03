import { computed } from 'vue';
import { useStore } from 'vuex';

/**
 * Navigation Composable
 * 
 * Provides a modular, configuration-based approach to sidebar navigation.
 * 
 * Usage:
 * const { navigationItems, hasPermission } = useNavigation();
 * 
 * Item Structure:
 * {
 *   id: 'unique-id',           // Required for groups
 *   type: 'single' | 'group',  // Type of nav item
 *   label: 'Display Text',     // Label (can be i18n key)
 *   icon: 'svg string',        // SVG icon markup
 *   to: '/path',               // Route path (for single items)
 *   children: [],              // Child items (for groups)
 *   permission: 'key',         // Permission check (optional)
 *   badge: { text, color },    // Badge config (optional)
 *   external: boolean,         // External link (optional)
 *   hidden: boolean|function,  // Hide condition (optional)
 * }
 */

// SVG Icons Library
export const icons = {
    home: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,

    cpu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-cpu"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`,

    box: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-box"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,

    zap: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,

    users: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,

    settings: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-settings"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6"></path></svg>`,

    clipboard: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clipboard"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`,

    fileText: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,

    layers: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,

    target: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-target"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,

    airplay: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-airplay"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path><polygon points="12 15 17 21 7 21 12 15"></polygon></svg>`,

    layout: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-layout"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`,

    move: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-move"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>`,

    pieChart: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-pie-chart"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>`,

    book: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-book"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,

    lock: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-lock"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
};

// Chevron icon for dropdowns
export const chevronRight = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

// Navigation Configuration
// ============================================
// ADD YOUR CUSTOM NAVIGATION ITEMS HERE
// ============================================
const navigationConfig = [
    // Dashboard
    {
        id: 'dashboard',
        type: 'single',
        label: 'dashboard',
        icon: icons.home,
        to:"/"
       
    },

    // Bikmedia Store
    {
        id: "store",
        type: "group",
        label: "bikmedia.navigation.menu.store",
        icon: icons.box,
        children: [
            {
                type: "single",
                label: "bikmedia.navigation.menu.gifts",
                to: "/store/gifts"
            },
            {
                type: "single",
                label: "bikmedia.navigation.menu.equipment",
                to: "/store/equipments"
            },
            {
                type: "single",
                label: "bikmedia.navigation.menu.levels",
                to: "/store/levels"
            }
        ]
    },

    // VIP OPtions
    {
        id:"vipopt",
        type:"single",
        label:"bikmedia.navigation.menu.vipopt",
        to:"/vipopt"
    }

    // ============================================
    // EXAMPLE: Add your custom navigation items
    // ============================================

    // Example 1: Single nav item
    // {
    //     type: 'single',
    //     label: 'My Dashboard',
    //     icon: icons.settings,
    //     to: '/my-dashboard',
    //     permission: 'view_dashboard', // Optional: check user permission
    //     badge: { text: 'New', color: 'success' } // Optional: show badge
    // },

    // Example 2: Group with children
    // {
    //     id: 'myFeatures',
    //     type: 'group',
    //     label: 'My Features',
    //     icon: icons.zap,
    //     children: [
    //         { type: 'single', label: 'Feature 1', to: '/feature-1' },
    //         { type: 'single', label: 'Feature 2', to: '/feature-2' },
    //         {
    //             id: 'subFeatures',
    //             type: 'group',
    //             label: 'Sub Features',
    //             children: [
    //                 { type: 'single', label: 'Sub 1', to: '/sub-1' },
    //                 { type: 'single', label: 'Sub 2', to: '/sub-2' },
    //             ]
    //         }
    //     ]
    // },

    // Example 3: External link
    // {
    //     type: 'single',
    //     label: 'Documentation',
    //     icon: icons.book,
    //     to: 'https://docs.example.com',
    //     external: true
    // },

    // ============================================
    // Template Components (existing template items)
    // ============================================
   
];

export function useNavigation() {
    const store = useStore();

    // Get user permissions from store (adjust based on your auth structure)
    const userPermissions = computed(() => {
        return store.state.auth?.permissions || [];
    });

    // Check if user has permission
    const hasPermission = (permission) => {
        if (!permission) return true;
        return userPermissions.value.includes(permission);
    };

    // Filter navigation items based on permissions and hidden state
    const filterItems = (items) => {
        return items
            .filter(item => {
                // Check hidden state
                if (item.hidden) {
                    const isHidden = typeof item.hidden === 'function' ? item.hidden() : item.hidden;
                    if (isHidden) return false;
                }
                // Check permission
                if (!hasPermission(item.permission)) return false;
                return true;
            })
            .map(item => {
                // Recursively filter children
                if (item.children) {
                    return {
                        ...item,
                        children: filterItems(item.children)
                    };
                }
                return item;
            })
            .filter(item => {
                // Remove groups with no visible children
                if (item.type === 'group' && item.children) {
                    return item.children.length > 0;
                }
                return true;
            });
    };

    // Filtered navigation items
    const navigationItems = computed(() => {
        return filterItems(navigationConfig);
    });

    return {
        navigationItems,
        hasPermission,
        icons,
        chevronRight
    };
}
