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
        type: 'group',
        label: 'dashboard',
        icon: icons.home,
        children: [
            { type: 'single', label: 'sales', to: '/' },
            { type: 'single', label: 'analytics', to: '/index2' }
        ]
    },

    {
        id: "store",
        type: "group",
        label: "store",
        icon: icons.box,
        children: [
            {
                type: "single",
                label: "gifts",
                to: "/store/gifts"
            },
            {
                type: "single",
                label: "equipments",
                to: "/store/equipments"

            },
            {
                type:"single",
                label:"level",
                to:"/store/levels"
            }
        ]
    },

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
    {
        id: 'templateComponents',
        type: 'group',
        label: 'Template Components',
        icon: icons.box,
        children: [
            // Apps
            {
                id: 'apps',
                type: 'group',
                label: 'apps',
                icon: icons.cpu,
                children: [
                    { type: 'single', label: 'Chat', to: '/apps/chat' },
                    { type: 'single', label: 'Mailbox', to: '/apps/mailbox' },
                    { type: 'single', label: 'Todo List', to: '/apps/todo-list' },
                    { type: 'single', label: 'Notes', to: '/apps/notes' },
                    { type: 'single', label: 'Scrumboard', to: '/apps/scrumboard' },
                    { type: 'single', label: 'Contacts', to: '/apps/contacts' },
                    {
                        id: 'invoice',
                        type: 'group',
                        label: 'Invoice',
                        children: [
                            { type: 'single', label: 'List', to: '/apps/invoice/list' },
                            { type: 'single', label: 'Preview', to: '/apps/invoice/preview' },
                            { type: 'single', label: 'Add', to: '/apps/invoice/add' },
                            { type: 'single', label: 'Edit', to: '/apps/invoice/edit' }
                        ]
                    },
                    { type: 'single', label: 'Calendar', to: '/apps/calendar' }
                ]
            },
            // Components
            {
                id: 'components',
                type: 'group',
                label: 'components',
                icon: icons.box,
                children: [
                    { type: 'single', label: 'Tabs', to: '/components/tabs' },
                    { type: 'single', label: 'Accordions', to: '/components/accordions' },
                    { type: 'single', label: 'Modals', to: '/components/modals' },
                    { type: 'single', label: 'Cards', to: '/components/cards' },
                    { type: 'single', label: 'Carousel', to: '/components/carousel' },
                    { type: 'single', label: 'Countdown', to: '/components/countdown' },
                    { type: 'single', label: 'Counter', to: '/components/counter' },
                    { type: 'single', label: 'Sweet Alerts', to: '/components/sweetalert' },
                    { type: 'single', label: 'Timeline', to: '/components/timeline' },
                    { type: 'single', label: 'Notifications', to: '/components/notifications' },
                    { type: 'single', label: 'Media Object', to: '/components/media-object' },
                    { type: 'single', label: 'List Group', to: '/components/list-group' },
                    { type: 'single', label: 'Pricing Tables', to: '/components/pricing-table' },
                    { type: 'single', label: 'Lightbox', to: '/components/lightbox' }
                ]
            },
            // Elements
            {
                id: 'elements',
                type: 'group',
                label: 'elements',
                icon: icons.zap,
                children: [
                    { type: 'single', label: 'Alerts', to: '/elements/alerts' },
                    { type: 'single', label: 'Avatar', to: '/elements/avatar' },
                    { type: 'single', label: 'Badges', to: '/elements/badges' },
                    { type: 'single', label: 'Breadcrumbs', to: '/elements/breadcrumbs' },
                    { type: 'single', label: 'Buttons', to: '/elements/buttons' },
                    { type: 'single', label: 'Button Groups', to: '/elements/buttons-group' },
                    { type: 'single', label: 'Color Library', to: '/elements/color-library' },
                    { type: 'single', label: 'Dropdown', to: '/elements/dropdown' },
                    { type: 'single', label: 'Infobox', to: '/elements/infobox' },
                    { type: 'single', label: 'Jumbotron', to: '/elements/jumbotron' },
                    { type: 'single', label: 'Loader', to: '/elements/loader' },
                    { type: 'single', label: 'Pagination', to: '/elements/pagination' },
                    { type: 'single', label: 'Popovers', to: '/elements/popovers' },
                    { type: 'single', label: 'Progress Bar', to: '/elements/progress-bar' },
                    { type: 'single', label: 'Search', to: '/elements/search' },
                    { type: 'single', label: 'Tooltips', to: '/elements/tooltips' },
                    { type: 'single', label: 'Treeview', to: '/elements/treeview' },
                    { type: 'single', label: 'Typography', to: '/elements/typography' }
                ]
            },
            // Font Icons
            { type: 'single', label: 'font_icons', icon: icons.target, to: '/font-icons' },
            // Widgets
            { type: 'single', label: 'widgets', icon: icons.airplay, to: '/widgets' },
            // Tables
            { type: 'single', label: 'tables', icon: icons.layout, to: '/tables' },
            // Datatables
            {
                id: 'datatables',
                type: 'group',
                label: 'datatables',
                icon: icons.layers,
                children: [
                    {
                        id: 'vue3Datatable',
                        type: 'group',
                        label: 'vue3-datatable',
                        children: [
                            { type: 'single', label: 'Basic', to: '/tables/vue3-datatable/basic' },
                            { type: 'single', label: 'Advanced', to: '/tables/vue3-datatable/advance' },
                            { type: 'single', label: 'Order Sorting', to: '/tables/vue3-datatable/order-sorting' },
                            { type: 'single', label: 'Alt. Pagination', to: '/tables/vue3-datatable/alt-pagination' },
                            { type: 'single', label: 'Search', to: '/tables/vue3-datatable/search' },
                            { type: 'single', label: 'Checkbox', to: '/tables/vue3-datatable/checkbox' },
                            { type: 'single', label: 'Slot', to: '/tables/vue3-datatable/slot' },
                            { type: 'single', label: 'Column Filter', to: '/tables/vue3-datatable/column-filter' },
                            { type: 'single', label: 'Actions', to: '/tables/vue3-datatable/actions' },
                            { type: 'single', label: 'Sticky Header', to: '/tables/vue3-datatable/sticky-header' },
                            { type: 'single', label: 'Column Chooser', to: '/tables/vue3-datatable/column-chooser' }
                        ]
                    },
                    {
                        id: 'v3Table',
                        type: 'group',
                        label: 'v3-table',
                        children: [
                            { type: 'single', label: 'Basic', to: '/tables/v3-table/basic' },
                            { type: 'single', label: 'Striped Table', to: '/tables/v3-table/striped' },
                            { type: 'single', label: 'Order Sorting', to: '/tables/v3-table/order-sorting' },
                            { type: 'single', label: 'Multi Column', to: '/tables/v3-table/multi-column' },
                            { type: 'single', label: 'Multiple Tables', to: '/tables/v3-table/multiple-tables' },
                            { type: 'single', label: 'Alt. Pagination', to: '/tables/v3-table/alt-pagination' },
                            { type: 'single', label: 'Custom', to: '/tables/v3-table/custom' },
                            { type: 'single', label: 'Range Search', to: '/tables/v3-table/range-search' },
                            { type: 'single', label: 'Export', to: '/tables/v3-table/export' },
                            { type: 'single', label: 'Live DOM ordering', to: '/tables/v3-table/live-dom-ordering' },
                            { type: 'single', label: 'Miscellaneous', to: '/tables/v3-table/miscellaneous' }
                        ]
                    }
                ]
            },
            // Forms
            {
                id: 'forms',
                type: 'group',
                label: 'forms',
                icon: icons.clipboard,
                children: [
                    { type: 'single', label: 'Basic', to: '/forms/basic' },
                    { type: 'single', label: 'Input Group', to: '/forms/input-group' },
                    { type: 'single', label: 'Layouts', to: '/forms/layouts' },
                    { type: 'single', label: 'Validation', to: '/forms/validation' },
                    { type: 'single', label: 'Input Mask', to: '/forms/input-mask' },
                    { type: 'single', label: 'Select2', to: '/forms/select2' },
                    { type: 'single', label: 'Touchspin', to: '/forms/touchspin' },
                    { type: 'single', label: 'Checkbox & Radio', to: '/forms/checkbox-radio' },
                    { type: 'single', label: 'Switches', to: '/forms/switches' },
                    { type: 'single', label: 'Wizards', to: '/forms/wizards' },
                    { type: 'single', label: 'File Upload', to: '/forms/file-upload' },
                    { type: 'single', label: 'Quill Editor', to: '/forms/quill-editor' },
                    { type: 'single', label: 'Markdown Editor', to: '/forms/markdown-editor' },
                    { type: 'single', label: 'Date & Range Picker', to: '/forms/date-picker' },
                    { type: 'single', label: 'Clipboard', to: '/forms/clipboard' }
                ]
            },
            // Users
            {
                id: 'users',
                type: 'group',
                label: 'users',
                icon: icons.users,
                children: [
                    { type: 'single', label: 'Profile', to: '/users/profile' },
                    { type: 'single', label: 'Account Settings', to: '/users/account-setting' }
                ]
            },
            // Pages
            {
                id: 'pages',
                type: 'group',
                label: 'pages',
                icon: icons.fileText,
                children: [
                    { type: 'single', label: 'Helpdesk', to: '/pages/helpdesk' },
                    { type: 'single', label: 'Contact Form', to: '/pages/contact-us' },
                    { type: 'single', label: 'FAQ', to: '/pages/faq' },
                    { type: 'single', label: 'Privacy Policy', to: '/pages/privacy-policy' },
                    { type: 'single', label: 'Coming Soon', to: '/pages/coming-soon', external: true },
                    {
                        id: 'error',
                        type: 'group',
                        label: 'Error',
                        children: [
                            { type: 'single', label: '404', to: '/pages/error404', external: true },
                            { type: 'single', label: '500', to: '/pages/error500', external: true },
                            { type: 'single', label: '503', to: '/pages/error503', external: true }
                        ]
                    },
                    { type: 'single', label: 'Maintanence', to: '/pages/maintenence', external: true },
                    { type: 'single', label: 'Blank Page', to: '/pages/blank-page' },
                    { type: 'single', label: 'Sample Page', to: '/pages/sample' }
                ]
            },
            // Authentication
            {
                id: 'authentication',
                type: 'group',
                label: 'authentication',
                icon: icons.lock,
                children: [
                    { type: 'single', label: 'Login Boxed', to: '/auth/login-boxed', external: true },
                    { type: 'single', label: 'Register Boxed', to: '/auth/register-boxed', external: true },
                    { type: 'single', label: 'Unlock Boxed', to: '/auth/lockscreen-boxed', external: true },
                    { type: 'single', label: 'Recover ID Boxed', to: '/auth/pass-recovery-boxed', external: true },
                    { type: 'single', label: 'Login Cover', to: '/auth/login', external: true },
                    { type: 'single', label: 'Register Cover', to: '/auth/register', external: true },
                    { type: 'single', label: 'Unlock Cover', to: '/auth/lockscreen', external: true },
                    { type: 'single', label: 'Recover ID Cover', to: '/auth/pass-recovery', external: true }
                ]
            },
            // Drag and Drop
            { type: 'single', label: 'drag_and_drop', icon: icons.move, to: '/dragndrop' },
            // Charts
            { type: 'single', label: 'charts', icon: icons.pieChart, to: '/charts/apex-chart' },
            // Documentation
            { type: 'single', label: 'documentation', icon: icons.book, to: 'https://cork-vue.sbthemes.com', external: true }
        ]
    }
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
